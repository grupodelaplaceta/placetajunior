#!/usr/bin/env python3
"""Regenera las miniaturas 16:9 de los juegos de Infantil (public/img/juegos/*.webp) y js/juegos-miniaturas.js.

Abre cada juego en Chromium (Playwright), hace una interacción sencilla para que no salga vacío,
captura el área de juego y la guarda a 480x270 WebP.

Uso:   pip install playwright pillow && playwright install chromium
       python3 tools/generar-miniaturas.py            # todas
       python3 tools/generar-miniaturas.py "Laberint"  # solo una (nombre en catalán)
"""
import asyncio, io, json, math, os, random, re, subprocess, sys, time, unicodedata
from playwright.async_api import async_playwright
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
OUT = os.path.join(ROOT, 'img', 'juegos')
PORT = 8123
OSCUROS = {'Bombolles de sabó', 'Cometa brillant', 'Cuques de llum', 'Fes créixer la flor', 'Globus volador', 'Imant de purpurina', 'Llança coets',
           'Llanterna màgica', 'Pluja de caramels', 'Salta el conill', 'Serp golafre', 'Theremin màgic', 'Torre de gelats', 'Pinzells màgics', 'Esborra i descobreix', 'Talla la fruita', 'Escombra les fulles'}

def slug(n):
    s = unicodedata.normalize('NFKD', n).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

async def main():
    only = set(sys.argv[1:])
    os.makedirs(OUT, exist_ok=True)
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(args=['--no-sandbox'])
            pg = await b.new_page(viewport={'width': 1100, 'height': 696})   # área de juego ≈ 16:9
            await pg.goto(f'http://localhost:{PORT}/index.html#/juegos'); await pg.wait_for_timeout(800)
            try: await pg.click('[data-a=start]', timeout=1500)
            except Exception: pass
            await pg.add_style_tag(content='#g [style*="z-index: 70"],#g [style*="z-index: 69"]{display:none!important}')  # oculta la manita de pista
            res = {}
            for i, cat, n in await pg.evaluate("PJG.list.map(g=>[g.i,g.cat,g.n])"):
                if only and n not in only: continue
                await pg.evaluate("()=>{location.hash='#/juegos'}"); await pg.wait_for_timeout(250)
                await pg.evaluate("i=>{location.hash='#/j/'+i}", i); await pg.wait_for_timeout(600)
                x0, y0, w, h = await pg.evaluate("(()=>{const r=document.getElementById('g').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
                await pg.mouse.click(x0 + w / 2, y0 + h / 2); await pg.wait_for_timeout(900)
                if n in OSCUROS or cat == 3:
                    await pg.mouse.move(x0 + w * .3, y0 + h * .5); await pg.mouse.down()
                    for a in range(0, 520, 8):
                        await pg.mouse.move(x0 + w * (.5 + .3 * math.cos(a / 30)), y0 + h * (.5 + .25 * math.sin(a / 22))); await pg.wait_for_timeout(14)
                    await pg.mouse.up()
                else:
                    for _ in range(6):
                        await pg.mouse.click(x0 + random.uniform(.15, .85) * w, y0 + random.uniform(.2, .75) * h); await pg.wait_for_timeout(110)
                await pg.wait_for_timeout(450)
                im = Image.open(io.BytesIO(await (await pg.query_selector('#g')).screenshot())).convert('RGB')
                W, H = im.size; th = int(W * 9 / 16)
                if th <= H: im = im.crop((0, (H - th) // 2, W, (H - th) // 2 + th))
                f = slug(n) + '.webp'; im.resize((480, 270), Image.LANCZOS).save(os.path.join(OUT, f), 'WEBP', quality=80, method=6)
                res[n] = ['img/juegos/' + f]; print('✓', n)
            await b.close()
        # mapa JS (se conserva lo ya existente si solo se regenera un juego)
        mp = os.path.join(ROOT, 'js', 'juegos-miniaturas.js'); prev = {}
        if os.path.exists(mp):
            m = re.search(r'window\.PJ_GIMG=(\{.*\});', open(mp, encoding='utf-8').read(), re.S)
            if m: prev = json.loads(m.group(1))
        prev.update(res)
        prev.setdefault('col', prev.get('Pinta la casa')); prev.setdefault('puz', prev.get('Puzle: la casa'))
        prev = {k: v for k, v in prev.items() if v}
        open(mp, 'w', encoding='utf-8').write("/* Generado por tools/generar-miniaturas.py. Clave = nombre catalán del juego, o 'col'/'puz' para los grupos. */\nwindow.PJ_GIMG=" + json.dumps(prev, ensure_ascii=False, separators=(',', ':')) + ";\n")
    finally:
        srv.terminate()

asyncio.run(main())
