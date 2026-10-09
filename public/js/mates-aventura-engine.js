const MATES_AVENTURA_STYLES = "@import url(\"https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap\");\n\n:host{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);--bg:#fff4e0;--bg2:#ffe0f0;--fg:#2b2350;--card:#fff;--line:#e3d9f5;--acc:#7c4dff;--acc2:#ff6fae;--ok:#1fb86a;--bad:#ff4d5e;--mut:#7a6f9b}\n@media (prefers-color-scheme:dark){:host(:not([data-theme=\"light\"])){--bg:#1b1535;--bg2:#2a1740;--fg:#f3eeff;--card:#2a2250;--line:#43386f;--acc:#a58bff;--acc2:#ff7fb9;--ok:#3ee08c;--bad:#ff6b7a;--mut:#b3a8d9}}\n:host([data-theme=\"dark\"]){--bg:#1b1535;--bg2:#2a1740;--fg:#f3eeff;--card:#2a2250;--line:#43386f;--acc:#a58bff;--acc2:#ff7fb9;--ok:#3ee08c;--bad:#ff6b7a;--mut:#b3a8d9}\n:host{scroll-padding-top:env(safe-area-inset-top,0px)}\n*{box-sizing:border-box}\n:host{margin:0;min-height:100%;background:linear-gradient(160deg,var(--bg),var(--bg2));color:var(--fg);font:500 17px/1.35 \"Baloo 2\",system-ui,-apple-system,\"Segoe UI\",sans-serif}\n.ma-main{max-width:640px;margin:0 auto;padding:12px}\nheader{display:flex;align-items:center;justify-content:space-between;gap:8px}\nh1{font-size:24px;margin:2px 0;font-weight:800}\n#stars{background:var(--card);border-radius:20px;padding:4px 14px;font-weight:800;box-shadow:0 3px 0 var(--line)}\nnav{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:7px;margin:8px 0 12px}\nnav button{padding:8px 2px;border:0;background:var(--card);color:var(--fg);border-radius:16px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 0 var(--line);transition:transform .15s}\nnav button b{display:block;font-size:24px;line-height:1.1}\nnav button:active{transform:translateY(3px)}\nnav button.on{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;box-shadow:0 4px 0 #0003}\n.card{position:relative;overflow:hidden;background:var(--card);border-radius:26px;padding:14px;box-shadow:0 6px 0 var(--line)}\n.game{display:none}.game.on{display:block;animation:in .4s}\n@keyframes in{from{opacity:0;transform:translateY(12px)}}\n.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px}\nselect,input[type=number]{font:inherit;color:var(--fg);background:var(--bg);border:2px solid var(--line);border-radius:12px;padding:5px 9px}\n.btn{font:inherit;font-weight:800;color:#fff;background:var(--acc);border:0;border-radius:14px;padding:8px 16px;cursor:pointer;box-shadow:0 4px 0 #0003}\n.btn:active{transform:translateY(3px);box-shadow:0 1px 0 #0003}\n.btn.alt{background:var(--bg);color:var(--fg);box-shadow:0 4px 0 var(--line)}\n.btn.big{font-size:20px;padding:10px 22px;background:linear-gradient(135deg,var(--ok),#13a0b8)}\n.mut{color:var(--mut);font-size:14px}\n.msg{min-height:30px;font-weight:800;font-size:19px;text-align:center;margin:6px 0}\n.good{color:var(--ok)}.badc{color:var(--bad)}\n/* píxel */\n#grid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin:8px 0}\n.cell{aspect-ratio:1;border-radius:9px;background:var(--bg);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:clamp(9px,2.7vw,13px);font-weight:800;cursor:pointer;text-align:center;transition:background .4s}\n.cell.sel{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc);animation:pulse 1s infinite}\n@keyframes pulse{50%{transform:scale(1.08)}}\n.cell.done{border-color:transparent;color:transparent;cursor:default;animation:pop .5s;box-shadow:inset 0 -5px 0 #0003,inset 0 3px 0 #fff5}\n@keyframes pop{40%{transform:scale(1.4) rotate(8deg)}}\n.cell.bad{animation:shk .45s;background:var(--bad)!important;color:#fff}\n@keyframes shk{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}\n#opbox{font-size:34px;font-weight:800;text-align:center}\n#ans{width:120px;font-size:26px;text-align:center}\n/* balanza */\n#bal{width:100%;max-height:310px}\n#beam,.pan{transition:transform 1s cubic-bezier(.3,1.6,.5,1)}\n#beam{transform-origin:200px 60px}.pan{transform-origin:0 0}\n.tray{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0}\n.w{width:64px;height:64px;border:0;background:none;padding:0;cursor:pointer;filter:drop-shadow(0 4px 2px #0004);animation:wob 2.4s infinite}\n.w svg{width:100%;height:100%;display:block}\n.w:nth-child(2n){animation-delay:.4s}.w:nth-child(3n){animation-delay:.8s}\n@keyframes wob{50%{transform:rotate(4deg) translateY(-3px)}}\n.w:disabled{opacity:.2;animation:none;filter:none}\n.w.sym{width:80px;height:66px;border-radius:18px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;font:inherit;font-size:38px;font-weight:800;box-shadow:0 5px 0 #0003;filter:none}\n/* arcade */\n#arena{position:relative;height:350px;border-radius:20px;overflow:hidden;background:linear-gradient(#5fb8ff,#cdeeff 68%,#e9fbe6)}\n#arena .bgA{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\n.cl{animation:cl 38s linear infinite}.cl2{animation:cl 60s linear infinite;animation-delay:-25s}\n@keyframes cl{from{transform:translateX(430px)}to{transform:translateX(-200px)}}\n#q{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max-content;max-width:94%;text-align:center;font-size:32px;font-weight:800;color:#1f2a55;background:#ffffffcc;padding:2px 20px;border-radius:24px;pointer-events:none;z-index:1;box-shadow:0 4px 0 #0002}\n.bub{position:absolute;left:0;top:0;width:62px;height:88px;border:0;background:none;padding:0;cursor:pointer;z-index:2;filter:drop-shadow(0 6px 4px #0003)}\n.bub svg{width:100%;height:100%;display:block}\n.bub span{position:absolute;left:0;right:0;top:20px;text-align:center;font:inherit;font-size:24px;font-weight:800;color:#fff;text-shadow:0 2px 2px #0006}\n.bub.bo{animation:bo .5s}\n@keyframes bo{30%{scale:1.35 .65}60%{scale:.8 1.2}}\n#a-hud{display:flex;align-items:center;gap:2px}#a-hud>svg{width:24px;height:22px}\n#over{position:absolute;inset:0;background:#000a;color:#fff;display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:5;font-size:26px;font-weight:800}\n/* río */\n#scene{border-radius:22px;position:relative;overflow:hidden;padding:0 6px 16px;background:linear-gradient(#cfeeff 0,#a6e0fa 70px,#37a6e6 70px,#1b72bd 100%)}\n#scene .bgsvg{position:absolute;left:0;top:0;width:100%;height:76px}\n#scene .wv{position:absolute;left:0;right:0;top:70px;bottom:0;pointer-events:none;background-image:var(--w),var(--w),var(--w);background-repeat:repeat-x;background-size:80px 14px;background-position:0 20%,30px 52%,10px 84%;animation:wv 7s linear infinite;--w:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='14'><path d='M0 7Q20 0 40 7T80 7' fill='none' stroke='white' stroke-opacity='.4' stroke-width='3'/></svg>\")}\n@keyframes wv{to{background-position:80px 20%,-50px 52%,90px 84%}}\n#trail{position:relative;display:flex;justify-content:center;align-items:flex-end;gap:4px;height:148px;padding-top:4px}\n.rk{position:relative;flex:none;width:64px;height:44px;opacity:.9}\n.rk .sk{width:100%;height:100%;display:block;filter:drop-shadow(0 4px 3px #0005)}\n.rk .num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;color:#fff;text-shadow:0 2px 2px #0007;padding-bottom:5px}\n.rk.cur{width:98px;height:66px;opacity:1}\n.rk.cur .num{font-size:30px;color:#5a3200;text-shadow:0 1px 0 #fff8}\n.frogw{position:absolute;left:50%;bottom:34px;width:88px;margin-left:-44px;pointer-events:none;z-index:2;animation:idle 2.6s ease-in-out infinite;transform-origin:50% 100%}\n@keyframes idle{50%{transform:scale(1.04,.96)}}\n.frogw.land{animation:leap .75s cubic-bezier(.3,.6,.5,1)}\n@keyframes leap{0%{transform:translate(-110px,10px) scale(1,.8)}45%{transform:translate(-50px,-62px) scale(.92,1.1) rotate(-8deg)}80%{transform:translate(0,2px) scale(1.12,.88)}100%{transform:none}}\n.frog .lid{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0);animation:blink 4.2s infinite}\n@keyframes blink{94%,100%{transform:scaleY(0)}97%{transform:scaleY(1)}}\n.rk.fell .frogw{animation:sink 1.3s forwards}\n@keyframes sink{30%{transform:translateY(-16px) rotate(12deg)}100%{transform:translateY(54px) scale(.7) rotate(25deg);opacity:0}}\n.splash{position:absolute;left:50%;bottom:30px;width:0;height:0;z-index:3}\n.splash i{position:absolute;width:9px;height:9px;border-radius:50%;background:#e8f8ff;left:-4px;top:0;animation:drop 1s ease-out forwards;animation-delay:.25s;opacity:0}\n.splash i:nth-child(1){--x:-46px}.splash i:nth-child(2){--x:-24px}.splash i:nth-child(3){--x:0px}.splash i:nth-child(4){--x:26px}.splash i:nth-child(5){--x:48px}\n@keyframes drop{0%{opacity:1;transform:translate(0,0)}45%{transform:translate(var(--x),-58px)}100%{opacity:0;transform:translate(calc(var(--x)*1.3),12px)}}\n.splash b{position:absolute;left:-36px;top:10px;width:72px;height:20px;border:4px solid #fff;border-radius:50%;opacity:0;animation:ring 1.1s ease-out forwards;animation-delay:.3s}\n.splash b+b{animation-delay:.5s}\n@keyframes ring{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(1.8)}}\n.jmp{align-self:center;font-weight:800;color:#fff;background:#0b3a6b99;border-radius:12px;padding:0 7px;font-size:13px;margin-bottom:14px}\n#choices{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}\n.pad{position:relative;border:0;background:none;padding:0;cursor:pointer;aspect-ratio:10/7;animation:fl 2.6s ease-in-out infinite;transition:transform .7s,opacity .7s}\n.pad svg{width:100%;height:100%;display:block;filter:drop-shadow(0 5px 3px #0005)}\n.pad span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:inherit;font-size:25px;font-weight:800;color:#fff;text-shadow:0 2px 3px #0a4a1c}\n.pad:nth-child(2){animation-delay:.6s}.pad:nth-child(3){animation-delay:1.2s}.pad:nth-child(4){animation-delay:1.8s}\n@keyframes fl{50%{transform:translateY(-5px) rotate(2deg)}}\n.pad:active{transform:scale(.94)}\n.pad.sink{transform:translateY(26px) scale(.6);opacity:.25;animation:none}\n.pad.right svg{filter:drop-shadow(0 0 10px #fff) drop-shadow(0 0 16px #ffe36a)}\n.pad.right{animation:pulse 1s infinite}\n.pad:disabled{cursor:default}\n#bar{height:14px;background:var(--line);border-radius:8px;overflow:hidden;margin-top:10px}#bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ok),#ffd23f);transition:width .4s}\n/* monstruo */\n#monwrap{position:relative;padding:6px 0 0}\n#mon{width:min(250px,64vw);display:block;margin:0 auto;overflow:visible}\n#mon *{transform-box:fill-box}\n#mon .m-open,#mon .m-happy,#mon .m-sick,#mon .happyeyes{display:none}\n#mon .bd{transform-origin:50% 100%;animation:bob 2.4s ease-in-out infinite}\n@keyframes bob{50%{transform:scale(1.02,.97)}}\n#mon .pup{transition:transform .08s}\n#mon.open .m-idle,#mon.chew .m-idle,#mon.happy .m-idle,#mon.sick .m-idle{display:none}\n#mon.open .m-open,#mon.chew .m-open{display:block}\n#mon.chew .m-open{animation:chew .22s infinite alternate;transform-origin:50% 30%}\n@keyframes chew{from{transform:scaleY(.35)}to{transform:scaleY(1)}}\n#mon.chew .bd{animation:sq .22s infinite alternate}\n@keyframes sq{from{transform:scale(1.04,.95)}to{transform:scale(.97,1.04)}}\n#mon.open .bd{animation:none;transform:scale(1.06)}\n#mon.happy .m-happy{display:block}#mon.happy .eyes{display:none}#mon.happy .happyeyes{display:block}\n#mon.happy .bd{animation:jump .5s infinite alternate}\n@keyframes jump{to{transform:translateY(-14px)}}\n#mon.happy .arm{transform:translateY(-38px) rotate(0deg)}\n#mon.sick{filter:hue-rotate(115deg) saturate(.85)}\n#mon.sick .m-sick{display:block}#mon.sick .bd{animation:shk .6s infinite}\n#monwrap.hl::after{content:\"¡Suelta aquí!\";position:absolute;left:50%;top:-4px;transform:translateX(-50%);background:var(--acc2);color:#fff;font-weight:800;font-size:14px;border-radius:12px;padding:1px 12px}\n#feed{display:flex;gap:18px;justify-content:center;align-items:flex-end;margin:10px 0;padding:14px 10px 10px;border-radius:18px;background:linear-gradient(#d9a066,#a8723a);border-bottom:8px solid #7a4a1e;box-shadow:inset 0 3px 0 #fff4}#feed .fb{color:#fff;text-shadow:0 2px 2px #0006}\n.fb{touch-action:none;user-select:none;-webkit-user-select:none;border:0;background:none;color:var(--fg);font:inherit;font-weight:800;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}\n.fb:active{transform:scale(.92)}\n.blk{background-color:#ffb02e;background-image:linear-gradient(#0004 1px,transparent 1px),linear-gradient(90deg,#0004 1px,transparent 1px);background-size:8px 8px;border:1px solid #0006}\n.u{width:8px;height:8px;background:#4cc3ff}.t{width:80px;height:8px;background-color:#ff6fae}.h{width:80px;height:80px;background-color:#8f7bff}\n.tgt{font-size:40px;font-weight:800;text-align:center}\n.sat{height:20px;background:var(--line);border-radius:12px;overflow:hidden}.sat i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffd23f,#ff6fae);transition:width .3s}\n/* música */\n#f-stage{position:relative;height:160px;border-radius:20px;background:radial-gradient(circle at 50% 115%,#ffd98a,#c76bff 55%,#4b2cc2);display:flex;align-items:center;justify-content:center;overflow:hidden}\n#f-stage::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(#5b3b2a,#3a2418);border-top:4px solid #8a5a3a}\n#f-big{position:relative;z-index:1;width:200px;height:130px;margin-bottom:12px;filter:drop-shadow(0 8px 6px #0006)}\n#f-big svg,.tile svg{overflow:visible;width:100%;height:100%;display:block}\n#f-big.play{animation:bnc .28s infinite alternate}@keyframes bnc{to{transform:translateY(-9px) rotate(2deg)}}\n#f-big.bad{animation:shk .5s 2;filter:grayscale(.7) drop-shadow(0 8px 6px #0006)}\n#f-ins{display:flex;gap:8px;justify-content:center;margin:10px 0}\n.tile{position:relative;width:70px;height:56px;border-radius:14px;border:3px solid var(--line);background:var(--bg);padding:4px;cursor:pointer}\n.tile.on{border-color:var(--acc);box-shadow:0 0 0 3px var(--acc)}\n.tile .in{display:block;width:100%;height:100%}\n.tile.lock{cursor:default}.tile.lock .in{filter:grayscale(1) brightness(.5);opacity:.6}\n.tile .lk{position:absolute;right:3px;bottom:3px;width:22px;height:22px}\n#staff{display:flex;min-height:84px;border-radius:14px;overflow:hidden;margin:8px 0;background:repeating-linear-gradient(to bottom,transparent 0 15px,var(--line) 15px 17px),var(--bg);border:3px solid var(--line)}\n.nt{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;cursor:pointer;border-right:3px solid #fff8;animation:pop .4s;min-width:0;overflow:hidden}\n.nt svg{width:24px;height:34px}.nt.over{filter:saturate(.3) brightness(.8)}\n.fn{width:74px;border:0;border-radius:16px;color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer;box-shadow:0 5px 0 #0003;padding:6px 0;display:flex;flex-direction:column;align-items:center}\n.fn svg{width:30px;height:42px}\n.flt{position:absolute;pointer-events:none;z-index:5;width:22px;height:30px}\n/* estimación */\n.nl{position:relative;height:132px;margin:6px 14px 0}\n.ruler{position:absolute;left:0;right:0;top:52px;height:18px;border-radius:9px;background:linear-gradient(#ffe9a8,#e8b64d);border:2px solid #a96d1c;box-shadow:0 3px 0 #0003}\n.ticks{position:absolute;left:0;right:0;top:52px;height:9px;border-right:2px solid #6b4310;background:repeating-linear-gradient(90deg,#6b4310 0 2px,transparent 2px 10%)}\n.pin{position:absolute;top:2px;transform:translateX(-50%);transition:left .5s}.pin svg{width:34px;height:46px;display:block}\n.pin.tg{top:76px}.pin.tg svg{width:40px;height:40px}\n.pin small{position:absolute;left:50%;transform:translateX(-50%);top:100%;font-size:13px;font-weight:800;white-space:nowrap}\n.lbl{position:absolute;top:74px;font-weight:800;font-size:15px}\n.dn{width:118px;height:118px;display:block;margin:4px auto;overflow:visible}\n.dartin{animation:dart .45s cubic-bezier(.2,.7,.3,1)}@keyframes dart{from{transform:translate(50px,-70px) scale(1.8);opacity:0}}\n#e-tg{min-height:126px}\n.tankwrap{position:relative;width:210px;height:190px;margin:6px auto}\n.scale{position:absolute;left:0;top:9px;height:170px;width:46px;display:flex;flex-direction:column;justify-content:space-between;font-size:12px;font-weight:800;text-align:right;color:var(--mut)}\n.tank{position:absolute;left:52px;top:4px;width:110px;height:180px;border:5px solid #9fb4d4;border-radius:10px 10px 26px 26px;background:#e8f4ff55;overflow:hidden}\n.tank i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(#69d0ff,#1c7de0)}\n.tank i::before{content:\"\";position:absolute;left:-10%;right:-10%;top:-6px;height:12px;border-radius:50%;background:#9be4ff;animation:bob2 2s ease-in-out infinite}\n@keyframes bob2{50%{transform:translateY(2px)}}\n.est{position:absolute;left:44px;width:126px;height:0;border-top:4px dashed var(--acc2);z-index:2}\ninput[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:36px;background:none}\ninput[type=range]::-webkit-slider-runnable-track{height:12px;border-radius:8px;background:linear-gradient(90deg,var(--acc),var(--acc2))}\ninput[type=range]::-moz-range-track{height:12px;border-radius:8px;background:linear-gradient(90deg,var(--acc),var(--acc2))}\ninput[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:34px;height:34px;margin-top:-11px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d9d0ff);border:4px solid var(--acc);box-shadow:0 3px 4px #0004}\ninput[type=range]::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:#fff;border:4px solid var(--acc)}\n#stars{font-size:15px;white-space:nowrap}\n.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.05;margin:0 5px;font-weight:800}\n.frac i{font-style:normal;padding:0 7px}.frac i:first-child{border-bottom:3px solid currentColor}\n#rb-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px}#rb-row svg{width:44px;height:52px}#rb-row svg.lit{animation:pop .6s}\n#rb-svg .belt{animation:beltm 1s linear infinite}@keyframes beltm{to{stroke-dashoffset:-24}}\n.gearspin{animation:spin 4s linear infinite;transform-box:fill-box;transform-origin:center}@keyframes spin{to{transform:rotate(360deg)}}\n.mshake{animation:mshk .1s 8}.mshake2{animation:mshk .08s 18}@keyframes mshk{25%{transform:translate(-3px,1px)}75%{transform:translate(3px,-1px)}}\n.chipb{width:72px;height:72px;border:0;background:none;padding:0;cursor:grab;touch-action:none;filter:drop-shadow(0 4px 2px #0004);border-radius:50%}\n.chipb svg{width:100%;height:100%;display:block}.chipb.sel{outline:4px solid var(--acc);outline-offset:-2px}\n.tapb{border:0;background:var(--bg);border-radius:16px;padding:6px 8px;cursor:pointer;font:inherit;font-weight:800;font-size:13px;color:var(--fg);box-shadow:0 4px 0 var(--line);display:flex;flex-direction:column;align-items:center;width:96px}\n.tapb:active{transform:translateY(3px)}.tapb svg{width:52px;height:52px}\n.slb{animation:slb .7s}@keyframes slb{30%{transform:scale(1.08,.9)}60%{transform:scale(.94,1.1)}}\n.flick{animation:flk .3s infinite alternate;transform-box:fill-box;transform-origin:50% 100%}@keyframes flk{to{transform:scale(.85,1.12)}}\n.pls{animation:pls 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes pls{50%{opacity:.4}}\n#tp-svg .tc{cursor:pointer}#tp-svg .tc:hover{filter:brightness(1.12)}\nnav#tabs{display:none}.ma-.ma-main{max-width:960px}\n";
const MATES_AVENTURA_MARKUP = "<main class=\"ma-main\">\n<svg width=\"0\" height=\"0\" style=\"position:absolute\"><defs>\n<linearGradient id=\"woodG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e6a05a\"/><stop offset=\"1\" stop-color=\"#9a5320\"/></linearGradient>\n<linearGradient id=\"brassG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffe9a0\"/><stop offset=\".55\" stop-color=\"#e5a91a\"/><stop offset=\"1\" stop-color=\"#a8740e\"/></linearGradient>\n</defs></svg>\n<header><h1 id=\"ttl\"></h1><div id=\"stars\"></div></header>\n<nav id=\"tabs\"></nav>\n<div class=\"row\"><button class=\"btn alt\" id=\"mute\"></button></div>\n\n<section class=\"game on card\" id=\"g1\">\n<div class=\"row\"><label>Operaciones <select id=\"p-lvl\"><option value=\"sum\">Sumas</option><option value=\"sub\">Restas</option><option value=\"mul\">Tablas</option><option value=\"mix\">Mezcla</option></select></label>\n<label>Dibujo <select id=\"p-art\"><option value=\"cohete\"> Cohete</option><option value=\"dino\"> Dino</option></select></label><button class=\"btn alt\" id=\"p-new\">Reiniciar</button></div>\n<div id=\"grid\"></div><div id=\"opbox\"></div>\n<div class=\"row\" style=\"justify-content:center\"><input id=\"ans\" type=\"number\" inputmode=\"numeric\" placeholder=\"?\"><button class=\"btn\" id=\"p-ok\">Comprobar</button></div>\n<div class=\"msg\" id=\"pmsg\"></div><div class=\"mut\" id=\"pprog\" style=\"text-align:center\"></div>\n</section>\n\n<section class=\"game card\" id=\"g2\">\n<div class=\"row\"><span>Nivel <b id=\"blvl\">1</b></span><span class=\"mut\" id=\"bgoal\"></span></div>\n<svg id=\"bal\" viewBox=\"-10 0 420 270\">\n<defs>\n<linearGradient id=\"brass\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f7de8a\"/><stop offset=\".5\" stop-color=\"#d9a73a\"/><stop offset=\"1\" stop-color=\"#9a6a14\"/></linearGradient>\n<linearGradient id=\"brassOk\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#9ff2bd\"/><stop offset=\".5\" stop-color=\"#2fa84f\"/><stop offset=\"1\" stop-color=\"#1b6e34\"/></linearGradient>\n<linearGradient id=\"wood\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e0a66c\"/><stop offset=\"1\" stop-color=\"#8a5524\"/></linearGradient>\n<linearGradient id=\"steel\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#8a93a8\"/><stop offset=\".5\" stop-color=\"#e3e9f5\"/><stop offset=\"1\" stop-color=\"#8a93a8\"/></linearGradient>\n</defs>\n<ellipse cx=\"200\" cy=\"257\" rx=\"96\" ry=\"8\" fill=\"#0003\"/>\n<path d=\"M118 254Q124 234 200 234Q276 234 282 254Z\" fill=\"url(#wood)\" stroke=\"#5a3510\" stroke-width=\"3\" stroke-linejoin=\"round\"/>\n<rect x=\"191\" y=\"60\" width=\"18\" height=\"178\" rx=\"6\" fill=\"url(#steel)\" stroke=\"#5b6478\" stroke-width=\"2\"/>\n<g id=\"beam\"><rect id=\"bline\" x=\"62\" y=\"53\" width=\"276\" height=\"14\" rx=\"7\" fill=\"url(#wood)\" stroke=\"#5a3510\" stroke-width=\"2.5\"/>\n<g transform=\"translate(70 60)\"><g class=\"pan\" id=\"pl\"></g></g><g transform=\"translate(330 60)\"><g class=\"pan\" id=\"pr\"></g></g></g>\n<circle cx=\"200\" cy=\"60\" r=\"13\" fill=\"url(#brass)\" stroke=\"#6b4e12\" stroke-width=\"3\"/><circle cx=\"200\" cy=\"60\" r=\"5\" fill=\"#6b4e12\"/></svg>\n<div id=\"bctl\"></div><div class=\"msg\" id=\"bmsg\"></div>\n<div class=\"mut\" style=\"text-align:center\" id=\"bhelp\"></div>\n</section>\n\n<section class=\"game card\" id=\"g5\">\n<div class=\"row\"><label>Tipo <select id=\"a-t\"><option value=\"mix\">Mezcla</option><option value=\"half\">Mitad / doble</option><option value=\"add\">Sumas y restas</option><option value=\"mul\">Tablas</option></select></label>\n<button class=\"btn\" id=\"a-go\">Jugar</button><span id=\"a-hud\" style=\"margin-left:auto;font-weight:800\"></span></div>\n<div id=\"arena\"><svg class=\"bgA\" viewBox=\"0 0 400 350\" preserveAspectRatio=\"xMidYMax slice\"><g class=\"cl\"><g transform=\"translate(0 30)\"><path d=\"M10 44Q8 26 28 26Q34 8 54 14Q72 4 80 24Q100 24 98 44Z\" fill=\"#fff\" opacity=\".92\"/></g></g><g class=\"cl2\"><g transform=\"translate(0 110)\"><path d=\"M10 44Q8 26 28 26Q34 8 54 14Q72 4 80 24Q100 24 98 44Z\" fill=\"#fff\" opacity=\".8\" transform=\"scale(.8)\"/></g></g><path d=\"M0 350V300Q80 268 160 296T320 290T400 298V350Z\" fill=\"#8fd694\"/><path d=\"M0 350V328Q100 306 200 324T400 322V350Z\" fill=\"#5dbb6e\"/></svg>\n<div id=\"q\">Pulsa Jugar</div><div id=\"over\"><div id=\"ovt\"></div><button class=\"btn big\" id=\"a-re\">Otra vez</button></div></div>\n<div class=\"mut\" style=\"margin-top:6px\">Toca el globo con el resultado antes de que se escape. Fallar cuesta un corazón.</div>\n</section>\n\n<section class=\"game card\" id=\"g6\">\n<div class=\"row\"><label>Regla <select id=\"r-rule\"><option value=\"5\">De 5 en 5</option><option value=\"2\">De 2 en 2</option><option value=\"3\">De 3 en 3</option><option value=\"10\">De 10 en 10</option><option value=\"even\">Solo pares</option><option value=\"mix\">Mezcla</option></select></label>\n<label>Objetivo mínimo <input id=\"r-min\" type=\"number\" min=\"1\" max=\"100\" value=\"8\" style=\"width:70px\"></label><button class=\"btn alt\" id=\"r-new\">Reiniciar</button></div>\n<div class=\"msg\" id=\"rrule\" style=\"font-size:17px\"></div>\n<div id=\"scene\">\n<svg width=\"0\" height=\"0\" style=\"position:absolute\"><defs>\n<linearGradient id=\"frogG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7be06a\"/><stop offset=\"1\" stop-color=\"#2f9a3c\"/></linearGradient>\n<linearGradient id=\"stoneG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#cfcabd\"/><stop offset=\"1\" stop-color=\"#8a8579\"/></linearGradient>\n<linearGradient id=\"goldG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffe9a8\"/><stop offset=\"1\" stop-color=\"#e8a645\"/></linearGradient>\n<radialGradient id=\"padG\" cx=\".4\" cy=\".3\" r=\".8\"><stop offset=\"0\" stop-color=\"#8be87a\"/><stop offset=\"1\" stop-color=\"#2b9a3e\"/></radialGradient>\n</defs></svg>\n<svg class=\"bgsvg\" viewBox=\"0 0 400 76\" preserveAspectRatio=\"none\"><circle cx=\"330\" cy=\"26\" r=\"16\" fill=\"#ffe27a\"/><path d=\"M0 76V48Q60 20 130 46T270 40T400 50V76Z\" fill=\"#6cc27a\"/><path d=\"M0 76V60Q80 42 160 58T320 56T400 60V76Z\" fill=\"#43a35a\"/><g stroke=\"#2d7d43\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M30 76V50M36 76V44M42 76V52M360 76V48M366 76V42M372 76V50\"/></g></svg>\n<div class=\"wv\"></div>\n<div id=\"trail\"></div><div id=\"choices\"></div></div>\n<div id=\"bar\"><i></i></div>\n<div class=\"msg\" id=\"rmsg\"></div><div class=\"mut\" id=\"rcount\" style=\"text-align:center\"></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"r-stop\" style=\"display:none\">Terminar este reto</button></div>\n</section>\n\n<section class=\"game card\" id=\"g7\">\n<div class=\"row\"><label>Hasta <select id=\"m-max\"><option value=\"99\">99</option><option value=\"999\" selected>999</option></select></label><label><input type=\"checkbox\" id=\"m-cnt\" checked> Ver contador</label><button class=\"btn alt\" id=\"m-clr\"> Vaciar</button></div>\n<div class=\"mut\" style=\"text-align:center\">¡Tengo hambre de…!</div><div class=\"tgt\" id=\"m-t\"></div>\n<div id=\"monwrap\"><svg id=\"mon\" class=\"idle\" viewBox=\"0 0 220 235\" role=\"img\" aria-label=\"Monstruo glotón\">\n<defs><radialGradient id=\"mg\" cx=\".35\" cy=\".28\" r=\".95\"><stop offset=\"0\" stop-color=\"#b79bff\"/><stop offset=\".6\" stop-color=\"#7c4dff\"/><stop offset=\"1\" stop-color=\"#4b2cc2\"/></radialGradient>\n<radialGradient id=\"ey\" cx=\".4\" cy=\".35\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#e4e8f6\"/></radialGradient></defs>\n<ellipse cx=\"110\" cy=\"226\" rx=\"72\" ry=\"8\" fill=\"#0003\"/>\n<g class=\"bd\">\n<ellipse cx=\"72\" cy=\"214\" rx=\"26\" ry=\"13\" fill=\"#4b2cc2\"/><ellipse cx=\"148\" cy=\"214\" rx=\"26\" ry=\"13\" fill=\"#4b2cc2\"/>\n<path d=\"M82 46Q72 14 56 14\" stroke=\"#4b2cc2\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"56\" cy=\"14\" r=\"10\" fill=\"#ffd23f\" stroke=\"#e6a800\" stroke-width=\"3\"/>\n<path d=\"M138 46Q148 14 164 14\" stroke=\"#4b2cc2\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"164\" cy=\"14\" r=\"10\" fill=\"#ff6fae\" stroke=\"#d63b83\" stroke-width=\"3\"/>\n<g class=\"arm\"><ellipse cx=\"22\" cy=\"140\" rx=\"15\" ry=\"30\" transform=\"rotate(18 22 140)\" fill=\"#6a3fe8\"/><circle cx=\"14\" cy=\"166\" r=\"11\" fill=\"#7c4dff\"/></g>\n<g class=\"arm\"><ellipse cx=\"198\" cy=\"140\" rx=\"15\" ry=\"30\" transform=\"rotate(-18 198 140)\" fill=\"#6a3fe8\"/><circle cx=\"206\" cy=\"166\" r=\"11\" fill=\"#7c4dff\"/></g>\n<path d=\"M110 28C172 28 204 80 204 142C204 198 164 220 110 220C56 220 16 198 16 142C16 80 48 28 110 28Z\" fill=\"url(#mg)\" stroke=\"#3b1fa8\" stroke-width=\"3\"/>\n<ellipse cx=\"110\" cy=\"182\" rx=\"58\" ry=\"32\" fill=\"#fff\" opacity=\".16\"/>\n<circle cx=\"46\" cy=\"112\" r=\"8\" fill=\"#fff\" opacity=\".2\"/><circle cx=\"170\" cy=\"120\" r=\"10\" fill=\"#fff\" opacity=\".2\"/><circle cx=\"156\" cy=\"62\" r=\"6\" fill=\"#fff\" opacity=\".2\"/>\n<ellipse cx=\"62\" cy=\"52\" rx=\"22\" ry=\"10\" transform=\"rotate(-30 62 52)\" fill=\"#fff\" opacity=\".3\"/>\n<g class=\"eyes\"><circle cx=\"80\" cy=\"88\" r=\"24\" fill=\"url(#ey)\" stroke=\"#3b1fa8\" stroke-width=\"3\"/><circle cx=\"140\" cy=\"88\" r=\"24\" fill=\"url(#ey)\" stroke=\"#3b1fa8\" stroke-width=\"3\"/>\n<g class=\"pup\"><circle cx=\"82\" cy=\"91\" r=\"11\" fill=\"#2b2350\"/><circle cx=\"86\" cy=\"86\" r=\"4\" fill=\"#fff\"/></g><g class=\"pup\"><circle cx=\"138\" cy=\"91\" r=\"11\" fill=\"#2b2350\"/><circle cx=\"142\" cy=\"86\" r=\"4\" fill=\"#fff\"/></g></g>\n<g class=\"happyeyes\"><path d=\"M58 92Q80 62 102 92\" stroke=\"#2b2350\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M118 92Q140 62 162 92\" stroke=\"#2b2350\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/></g>\n<ellipse cx=\"52\" cy=\"128\" rx=\"11\" ry=\"7\" fill=\"#ff6fae\" opacity=\".55\"/><ellipse cx=\"168\" cy=\"128\" rx=\"11\" ry=\"7\" fill=\"#ff6fae\" opacity=\".55\"/>\n<g class=\"m-idle\"><path d=\"M82 138Q110 162 138 138\" stroke=\"#2b1566\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/></g>\n<g class=\"m-open\"><path d=\"M70 130Q110 124 150 130Q158 178 110 186Q62 178 70 130Z\" fill=\"#3a0f3d\" stroke=\"#2b1566\" stroke-width=\"4\"/><ellipse cx=\"110\" cy=\"172\" rx=\"26\" ry=\"12\" fill=\"#ff6f91\"/><path d=\"M78 131l9 15 9-15zM100 129l10 16 10-16zM124 131l9 15 9-15z\" fill=\"#fff\"/></g>\n<g class=\"m-happy\"><path d=\"M68 128Q110 196 152 128Z\" fill=\"#3a0f3d\" stroke=\"#2b1566\" stroke-width=\"4\" stroke-linejoin=\"round\"/><ellipse cx=\"110\" cy=\"164\" rx=\"24\" ry=\"11\" fill=\"#ff6f91\"/><path d=\"M80 129l8 12 8-12zM124 129l8 12 8-12z\" fill=\"#fff\"/></g>\n<g class=\"m-sick\"><path d=\"M78 150q8-12 16 0t16 0t16 0t16 0\" stroke=\"#2b1566\" stroke-width=\"6\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M114 152v24q0 12 11 12q11 0 11-12v-24z\" fill=\"#8be06e\" stroke=\"#2b1566\" stroke-width=\"3\"/></g>\n</g></svg></div><div class=\"sat\"><i id=\"m-bar\"></i></div>\n<div class=\"msg\" id=\"m-msg\"></div>\n<div id=\"feed\"><button class=\"fb\" data-v=\"100\"><div class=\"blk h\"></div>100</button><button class=\"fb\" data-v=\"10\"><div class=\"blk t\"></div>10</button><button class=\"fb\" data-v=\"1\"><div class=\"blk u\"></div>1</button></div>\n<div class=\"mut\" style=\"text-align:center\">Arrastra las cajas hasta la boca del monstruo (o simplemente tócalas). Cada decena mide 10 veces una unidad y cada centena 10 veces la decena.</div>\n</section>\n\n<section class=\"game card\" id=\"g8\">\n<div class=\"row\"><span>Compás de <b id=\"f-t\"></b></span><span class=\"mut\" id=\"f-un\"></span></div>\n<div id=\"f-stage\"><div id=\"f-big\"></div></div>\n<div id=\"f-ins\"></div>\n<div id=\"staff\"></div>\n<div class=\"row\" style=\"justify-content:center\" id=\"f-btns\"></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"f-play\">Tocar</button><button class=\"btn alt\" id=\"f-clr\">Borrar</button></div>\n<div class=\"msg\" id=\"f-msg\"></div>\n<div class=\"mut\" style=\"text-align:center\">Completa el compás con fracciones. Toca una nota puesta para quitarla. Si suma justo, suena genial y desbloqueas instrumentos.</div>\n</section>\n\n<section class=\"game card\" id=\"g9\">\n<div class=\"row\"><label>Reto <select id=\"e-m\"><option value=\"mix\">Mezcla</option><option value=\"10\">Línea 0 a 10</option><option value=\"100\">Línea 0 a 100</option><option value=\"1000\">Línea 0 a 1000</option><option value=\"tank\">Depósito %</option></select></label><span class=\"mut\">Margen: ±5%</span></div>\n<div class=\"msg\" id=\"e-q\"></div><div id=\"e-vis\"></div>\n<input type=\"range\" id=\"e-sl\" min=\"0\" max=\"100\" value=\"50\"><div class=\"tgt\" id=\"e-val\" style=\"font-size:28px\"></div>\n<div id=\"e-tg\"></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"e-go\">Disparar</button></div>\n<div class=\"msg\" id=\"e-msg\"></div>\n</section>\n<section class=\"game card\" id=\"g10\">\n<div class=\"msg\" id=\"n-q\" style=\"font-size:24px\"></div>\n<svg id=\"n-svg\" viewBox=\"0 0 400 300\" style=\"width:100%;touch-action:none;border-radius:20px;display:block;cursor:crosshair\">\n<defs><linearGradient id=\"nbg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a3566\"/><stop offset=\"1\" stop-color=\"#1f1533\"/></linearGradient></defs>\n<rect width=\"400\" height=\"300\" fill=\"url(#nbg)\"/><circle cx=\"140\" cy=\"140\" r=\"130\" fill=\"#fff\" opacity=\".06\"/>\n<path d=\"M0 240H400V300H0Z\" fill=\"#7a4a24\"/><path d=\"M0 240H400M80 240V300M200 240V300M320 240V300\" stroke=\"#4a2a10\" stroke-width=\"4\"/>\n<rect x=\"14\" y=\"8\" width=\"34\" height=\"86\" fill=\"#e5484d\" stroke=\"#8f1d26\" stroke-width=\"3\"/><path d=\"M22 30L40 60M40 30L22 60\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n<g id=\"n-obj\"></g>\n<g id=\"n-ch\" transform=\"translate(300 140)\"><path d=\"M8 110Q8 74 40 74Q72 74 72 110Z\" fill=\"#26203f\" stroke=\"#0f0b1e\" stroke-width=\"3\"/><circle cx=\"40\" cy=\"46\" r=\"34\" fill=\"#26203f\" stroke=\"#0f0b1e\" stroke-width=\"3\"/><rect x=\"9\" y=\"33\" width=\"62\" height=\"26\" rx=\"13\" fill=\"#f6d9b4\" stroke=\"#0f0b1e\" stroke-width=\"2.5\"/><rect x=\"5\" y=\"24\" width=\"70\" height=\"9\" fill=\"#e5484d\" stroke=\"#8f1d26\" stroke-width=\"2\"/><path d=\"M75 28l12 8M75 30l10-4\" stroke=\"#e5484d\" stroke-width=\"5\" stroke-linecap=\"round\"/><circle cx=\"28\" cy=\"46\" r=\"5.5\" fill=\"#fff\"/><circle cx=\"52\" cy=\"46\" r=\"5.5\" fill=\"#fff\"/><circle cx=\"29\" cy=\"47\" r=\"2.8\" fill=\"#111\"/><circle cx=\"53\" cy=\"47\" r=\"2.8\" fill=\"#111\"/><ellipse id=\"n-mouth\" cx=\"40\" cy=\"62\" rx=\"8\" ry=\"4\" fill=\"#5a1530\" style=\"transform-box:fill-box;transform-origin:center\"/></g>\n<polyline id=\"n-t1\" fill=\"none\" stroke=\"#7fd4ff\" stroke-width=\"12\" stroke-linecap=\"round\" stroke-linejoin=\"round\" opacity=\".5\" style=\"filter:blur(3px)\"/>\n<polyline id=\"n-t2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>\n<div class=\"msg\" id=\"n-msg\"></div>\n<div class=\"mut\" style=\"text-align:center\">Pasa el dedo (o el ratón) de lado a lado de la figura. Un buen corte deja un trozo del tamaño pedido.</div>\n</section>\n\n<section class=\"game card\" id=\"g11\">\n<div class=\"mut\" style=\"text-align:center\">¿Qué chip falta? Arrástralo a la máquina (o tócalo) y pulsa Probar.</div>\n<div id=\"rb-row\"></div>\n<svg id=\"rb-svg\" viewBox=\"0 0 400 210\" style=\"width:100%;display:block\">\n<defs><linearGradient id=\"mbG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6fa3f5\"/><stop offset=\"1\" stop-color=\"#2f62c4\"/></linearGradient></defs>\n<rect width=\"400\" height=\"210\" rx=\"16\" fill=\"#dfe8fb\"/>\n<rect x=\"0\" y=\"150\" width=\"135\" height=\"18\" rx=\"9\" fill=\"#3a4258\"/><line class=\"belt\" x1=\"8\" y1=\"159\" x2=\"127\" y2=\"159\" stroke=\"#9aa3b8\" stroke-width=\"4\" stroke-dasharray=\"12 12\"/>\n<rect x=\"265\" y=\"150\" width=\"135\" height=\"18\" rx=\"9\" fill=\"#3a4258\"/><line class=\"belt\" x1=\"273\" y1=\"159\" x2=\"392\" y2=\"159\" stroke=\"#9aa3b8\" stroke-width=\"4\" stroke-dasharray=\"12 12\"/>\n<g id=\"rb-m\"><rect x=\"226\" y=\"6\" width=\"24\" height=\"34\" rx=\"4\" fill=\"#6b7790\" stroke=\"#2b3550\" stroke-width=\"3\"/><rect x=\"132\" y=\"36\" width=\"136\" height=\"134\" rx=\"14\" fill=\"url(#mbG)\" stroke=\"#1d3c78\" stroke-width=\"4\"/>\n<g id=\"rb-gears\"></g><circle cx=\"150\" cy=\"56\" r=\"6\" fill=\"#4cd37a\"/><circle cx=\"168\" cy=\"56\" r=\"6\" fill=\"#ffd23f\"/><circle cx=\"186\" cy=\"56\" r=\"6\" fill=\"#ff6b6b\"/>\n<circle id=\"rb-slot\" cx=\"200\" cy=\"112\" r=\"30\" fill=\"#14233f\" stroke=\"#ffd23f\" stroke-width=\"3\" stroke-dasharray=\"6 5\" style=\"cursor:pointer\"/><g id=\"rb-sl\" transform=\"translate(200 112)\" style=\"pointer-events:none\"></g></g>\n<g id=\"rb-sm\"></g>\n<text x=\"65\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"800\" fill=\"#1d3c78\">ENTRA</text><text x=\"335\" y=\"24\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"800\" fill=\"#1d3c78\">DEBE SALIR</text>\n<g id=\"rb-goal\" transform=\"translate(305 100)\"><rect width=\"60\" height=\"50\" rx=\"10\" fill=\"#ffffff80\" stroke=\"#1d3c78\" stroke-width=\"3\" stroke-dasharray=\"6 5\"/><text id=\"rb-gt\" x=\"30\" y=\"36\" text-anchor=\"middle\" font-size=\"28\" font-weight=\"800\" fill=\"#1d3c78\"></text></g>\n<g id=\"rb-in\" transform=\"translate(35 100)\"><rect width=\"60\" height=\"50\" rx=\"10\" fill=\"#fff\" stroke=\"#1d3c78\" stroke-width=\"3\"/><text id=\"rb-int\" x=\"30\" y=\"36\" text-anchor=\"middle\" font-size=\"28\" font-weight=\"800\" fill=\"#1d3c78\"></text></g>\n<g id=\"rb-res\"></g><g id=\"rb-fx\"></g>\n</svg>\n<div class=\"msg\" id=\"rb-msg\"></div>\n<div id=\"rb-chips\" class=\"tray\"></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"rb-go\">Probar</button></div>\n</section>\n\n<section class=\"game card\" id=\"g12\">\n<div class=\"row\"><span>Objetivo: <b id=\"sl-goal\"></b></span><span class=\"mut\" id=\"sl-cur\"></span></div>\n<svg id=\"sl-svg\" viewBox=\"0 0 300 330\" style=\"width:100%;max-height:380px;display:block\">\n<defs><clipPath id=\"slc\"><path d=\"M72 42H228V290Q228 308 210 308H90Q72 308 72 290Z\"/></clipPath>\n<linearGradient id=\"slG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#b6f06a\"/><stop offset=\"1\" stop-color=\"#38a82a\"/></linearGradient></defs>\n<rect width=\"300\" height=\"330\" rx=\"16\" fill=\"#e9f3ff\"/>\n<rect x=\"104\" y=\"4\" width=\"92\" height=\"22\" rx=\"8\" fill=\"#9aa6bd\" stroke=\"#5b6478\" stroke-width=\"3\"/><rect x=\"138\" y=\"24\" width=\"24\" height=\"14\" fill=\"#7d889f\" stroke=\"#5b6478\" stroke-width=\"2\"/>\n<rect id=\"sl-str\" x=\"150\" y=\"38\" width=\"0\" height=\"0\" rx=\"3\" fill=\"#8be04c\"/>\n<g id=\"sl-lg\"><g clip-path=\"url(#slc)\"><path id=\"sl-liq\" fill=\"url(#slG)\"/><g id=\"sl-bub\"></g><g id=\"sl-face\" opacity=\"0\"><circle cx=\"-24\" r=\"13\" fill=\"#fff\" stroke=\"#1e5a14\" stroke-width=\"2.5\"/><circle cx=\"24\" r=\"13\" fill=\"#fff\" stroke=\"#1e5a14\" stroke-width=\"2.5\"/><circle cx=\"-22\" cy=\"1\" r=\"6\" fill=\"#16330f\"/><circle cx=\"26\" cy=\"1\" r=\"6\" fill=\"#16330f\"/><path id=\"sl-mouth\" d=\"M-20 22Q0 40 20 22\" stroke=\"#16330f\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/></g></g></g>\n<path d=\"M72 42H228V290Q228 308 210 308H90Q72 308 72 290Z\" fill=\"#ffffff22\" stroke=\"#5b7fa6\" stroke-width=\"5\" stroke-linejoin=\"round\"/><path d=\"M82 52V270\" stroke=\"#fff\" stroke-opacity=\".55\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n<g stroke=\"#5b7fa6\" stroke-width=\"2.5\"><path d=\"M72 268H92M72 228H100M72 188H92M72 148H100M72 108H92M72 68H100\"/></g>\n<g font-size=\"11\" font-weight=\"800\" fill=\"#5b7fa6\" text-anchor=\"end\"><text x=\"66\" y=\"272\">0,5</text><text x=\"66\" y=\"232\">1</text><text x=\"66\" y=\"192\">1,5</text><text x=\"66\" y=\"152\">2</text><text x=\"66\" y=\"112\">2,5</text><text x=\"66\" y=\"72\">3</text></g>\n<line id=\"sl-gl\" x1=\"60\" x2=\"236\" stroke=\"#ffb400\" stroke-width=\"4\" stroke-dasharray=\"10 6\"/><text id=\"sl-gt\" x=\"240\" font-size=\"12\" font-weight=\"800\" fill=\"#b97a00\">Meta</text>\n<g id=\"sl-sp\" opacity=\"0\"><rect x=\"160\" y=\"70\" width=\"120\" height=\"30\" rx=\"14\" fill=\"#fff\" stroke=\"#1e5a14\" stroke-width=\"2.5\"/><text x=\"220\" y=\"90\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"800\" fill=\"#1e5a14\">¡Más, por favor!</text></g>\n<g id=\"sl-fx\"></g>\n</svg>\n<div class=\"msg\" id=\"sl-msg\"></div>\n<div id=\"sl-taps\" class=\"tray\"></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"sl-ok\">Hecho</button><button class=\"btn alt\" id=\"sl-clr\">Vaciar</button></div>\n</section>\n\n<section class=\"game card\" id=\"g13\">\n<div class=\"msg\" id=\"t-q\" style=\"font-size:21px\"></div>\n<svg id=\"t-svg\" viewBox=\"0 0 400 300\" style=\"width:100%;touch-action:none;border-radius:18px;display:block\">\n<defs><pattern id=\"brk\" width=\"40\" height=\"20\" patternUnits=\"userSpaceOnUse\"><rect width=\"40\" height=\"20\" fill=\"#3d2c55\"/><path d=\"M0 0H40M0 10H40M20 0V10M0 10V20\" stroke=\"#2a1d3f\" stroke-width=\"2\" fill=\"none\"/></pattern>\n<linearGradient id=\"mirG\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e8f6ff\"/><stop offset=\"1\" stop-color=\"#7fa6c9\"/></linearGradient>\n<radialGradient id=\"glw\" cx=\".5\" cy=\".5\" r=\".7\"><stop offset=\"0\" stop-color=\"#ffe9a0\"/><stop offset=\"1\" stop-color=\"#ffb400\"/></radialGradient></defs>\n<rect width=\"400\" height=\"300\" fill=\"url(#brk)\"/>\n<rect x=\"0\" y=\"278\" width=\"400\" height=\"22\" fill=\"#2a1d3f\"/><rect x=\"14\" y=\"16\" width=\"26\" height=\"262\" fill=\"#53406f\" stroke=\"#2a1d3f\" stroke-width=\"3\"/><rect x=\"360\" y=\"16\" width=\"26\" height=\"262\" fill=\"#53406f\" stroke=\"#2a1d3f\" stroke-width=\"3\"/>\n<rect x=\"168\" y=\"12\" width=\"64\" height=\"84\" rx=\"32\" fill=\"#120b1e\"/><rect id=\"t-pass\" x=\"172\" y=\"16\" width=\"56\" height=\"80\" rx=\"28\" fill=\"#ffe27a\" opacity=\"0\"/>\n<g id=\"t-door\"><rect x=\"168\" y=\"12\" width=\"64\" height=\"84\" rx=\"32\" fill=\"#7a5230\" stroke=\"#3a2412\" stroke-width=\"4\"/><path d=\"M200 14V96M176 54H224\" stroke=\"#3a2412\" stroke-width=\"3\"/></g>\n<g transform=\"translate(60 40)\"><path d=\"M0 10V30\" stroke=\"#5a3a1c\" stroke-width=\"5\"/><path d=\"M0 8Q-9 -8 0 -16Q9 -8 0 8Z\" fill=\"#ff8a3d\" class=\"flick\"/></g><g transform=\"translate(340 40)\"><path d=\"M0 10V30\" stroke=\"#5a3a1c\" stroke-width=\"5\"/><path d=\"M0 8Q-9 -8 0 -16Q9 -8 0 8Z\" fill=\"#ff8a3d\" class=\"flick\"/></g>\n<g id=\"t-dyn\"></g><g id=\"t-ray\"></g><rect id=\"t-glow\" width=\"400\" height=\"300\" fill=\"url(#glw)\" opacity=\"0\" style=\"pointer-events:none\"/><g id=\"t-fx\"></g>\n</svg>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn alt\" id=\"t-m\">−5°</button><b id=\"t-ang\" style=\"font-size:24px;min-width:70px;text-align:center\"></b><button class=\"btn alt\" id=\"t-p\">+5°</button></div>\n<div class=\"row\" style=\"justify-content:center\"><button class=\"btn big\" id=\"t-go\">Emitir luz</button></div>\n<div class=\"msg\" id=\"t-msg\"></div>\n<div class=\"mut\" style=\"text-align:center\">Gira el espejo arrastrando por el aro graduado (o con los botones). El ángulo se mide desde la horizontal.</div>\n</section>\n\n<section class=\"game card\" id=\"g14\">\n<div class=\"row\"><label>Modo <select id=\"tp-mode\"><option value=\"cf\">Columna y fila</option><option value=\"xy\">Coordenadas (x, y)</option></select></label></div>\n<div class=\"msg\" id=\"tp-q\" style=\"font-size:20px\"></div>\n<svg id=\"tp-svg\" viewBox=\"0 0 380 380\" style=\"width:100%;max-width:460px;display:block;margin:0 auto\"></svg>\n<div class=\"msg\" id=\"tp-msg\"></div>\n</section>\n</main>";

function inicializarJuegoMates(root, config, onComplete) {
  const documentRef = root.ownerDocument;
  const gameSections = {
    mates_pixel: 'g1',
    mates_balanza: 'g2',
    mates_arcade: 'g5',
    mates_rio: 'g6',
    mates_monstruo: 'g7',
    mates_fracciones: 'g8',
    mates_estimacion: 'g9',
    mates_ninja: 'g10',
    mates_robots: 'g11',
    mates_slime: 'g12',
    mates_templo: 'g13',
    mates_topo: 'g14'
  };
  const gameSection = config && gameSections[config.tipo];
  if (!gameSection) throw new Error('Tipo de actividad de Mates Aventura no reconocido.');
  if (!config.datos || typeof config.datos !== 'object' || Array.isArray(config.datos)) {
    throw new Error('Los datos de la actividad de Mates Aventura no son válidos.');
  }
  const fail = error => { throw error; };
  const timeoutIds = new Set(), intervalIds = new Set(), frameIds = new Set(), eventListeners = [];
  let disposed = false;
  const nativeSetTimeout = window.setTimeout.bind(window), nativeClearTimeout = window.clearTimeout.bind(window);
  const nativeSetInterval = window.setInterval.bind(window), nativeClearInterval = window.clearInterval.bind(window);
  const setTimeout = (callback, delay, ...args) => { let id; id = nativeSetTimeout(() => { timeoutIds.delete(id); if (!disposed) callback(...args); }, delay); timeoutIds.add(id); return id; };
  const clearTimeout = id => { timeoutIds.delete(id); nativeClearTimeout(id); };
  const setInterval = (callback, delay, ...args) => { const id = nativeSetInterval(() => { if (!disposed) callback(...args); }, delay); intervalIds.add(id); return id; };
  const clearInterval = id => { intervalIds.delete(id); nativeClearInterval(id); };
  const requestAnimationFrame = callback => { let id; id = window.requestAnimationFrame(time => { frameIds.delete(id); if (!disposed) callback(time); }); frameIds.add(id); return id; };
  const cancelAnimationFrame = id => { frameIds.delete(id); window.cancelAnimationFrame(id); };
  const listen = (type, callback, options) => { root.addEventListener(type, callback, options); eventListeners.push([type, callback, options]); };
  let translationObserver = null;
  let languageChangeListener = null;
  let storageChangeListener = null;
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    translationObserver?.disconnect();
    if (languageChangeListener) window.removeEventListener('pj:idioma-cambiado', languageChangeListener);
    if (storageChangeListener) window.removeEventListener('storage', storageChangeListener);
    timeoutIds.forEach(nativeClearTimeout);
    intervalIds.forEach(nativeClearInterval);
    frameIds.forEach(id => window.cancelAnimationFrame(id));
    eventListeners.forEach(([type, callback, options]) => root.removeEventListener(type, callback, options));
  };
  try {
    const brandFonts = `
      :host{font:500 17px/1.35 var(--font-body,'Plus Jakarta Sans',system-ui,sans-serif);background:#fff;color:#25243a}
      .ma-main{background:#fff}
      .card{background:#fff}
      header{align-items:flex-start}
      header h1{margin:0}
      #stars{display:none}
      .ma-instruction{margin:4px 0 12px;color:#4b5563;font:500 1rem/1.5 var(--font-body,system-ui,sans-serif)}
      h1,#q,.btn,nav button,#stars{font-family:var(--font-head,'HandlyCasual',cursive)}
    `;
    const styles = MATES_AVENTURA_STYLES.replace(/^@import[^;]+;\s*/, '') + brandFonts;
    root.innerHTML = `<style>${styles}</style>${MATES_AVENTURA_MARKUP}`;
    const heading = root.querySelector('#ttl');
    root.querySelector('#tabs').hidden = true;
    const instruction = documentRef.createElement('p');
    instruction.className = 'ma-instruction';
    instruction.textContent = config.enunciado || '';
    heading.closest('header').after(instruction);
    const sourceText = new WeakMap(), sourceAttributes = new WeakMap();
    const locale = () => window.MATES_AVENTURA?.locale
      ? window.MATES_AVENTURA.locale()
      : ['es', 'ca', 'eu', 'en', 'val'].includes(documentRef.documentElement.lang) ? documentRef.documentElement.lang : 'es';
    const translate = value => window.MATES_AVENTURA?.translate
      ? window.MATES_AVENTURA.translate(value, locale())
      : value;
    const localizeTextNode = node => {
      const previous = sourceText.get(node);
      const current = node.data;
      const source = previous && previous.rendered === current ? previous.source : current;
      const leading = source.match(/^\s*/)[0], trailing = source.match(/\s*$/)[0];
      const rendered = leading + translate(source.trim()) + trailing;
      sourceText.set(node, { source, rendered });
      if (rendered !== current) node.data = rendered;
    };
    const localizeAttribute = (element, name) => {
      const values = sourceAttributes.get(element) || new Map();
      const previous = values.get(name);
      const current = element.getAttribute(name);
      const source = previous && previous.rendered === current ? previous.source : current;
      if (source == null) return;
      const rendered = translate(source);
      values.set(name, { source, rendered });
      sourceAttributes.set(element, values);
      if (rendered !== current) element.setAttribute(name, rendered);
    };
    const localizeSubtree = node => {
      if (node.nodeType === 3) {
        localizeTextNode(node);
        return;
      }
      const walker = documentRef.createTreeWalker(node, documentRef.defaultView.NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) localizeTextNode(walker.currentNode);
      if (node.nodeType === 1 && node.matches('*')) {
        ['aria-label', 'title', 'placeholder'].forEach(name => localizeAttribute(node, name));
      }
      node.querySelectorAll?.('*').forEach(element => ['aria-label', 'title', 'placeholder'].forEach(name => localizeAttribute(element, name)));
    };
    const applyLocale = () => localizeSubtree(root);
    languageChangeListener = applyLocale;
    window.addEventListener('pj:idioma-cambiado', languageChangeListener);
    storageChangeListener = event => {
      if (event.key === 'junior_acc_web') applyLocale();
    };
    window.addEventListener('storage', storageChangeListener);
    translationObserver = new MutationObserver(records => records.forEach(record => {
      if (record.type === 'characterData') localizeTextNode(record.target);
      else if (record.type === 'attributes') localizeAttribute(record.target, record.attributeName);
      else record.addedNodes.forEach(localizeSubtree);
    }));
    translationObserver.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label', 'title', 'placeholder']
    });
    applyLocale();
const $=s=>root.querySelector(s),R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,sh=a=>a.sort(()=>Math.random()-.5);
let ac,snd=true,ST=0;
function tone(f,d=.15,t='sine',s=0,v=.08){if(!snd||window.pjSonido?.isMuted())return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);if(s)o.frequency.exponentialRampToValueAtTime(s,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(n+d)}catch(e){}}
const notifyAnswer=correct=>{if(typeof window.pjRegistrarRespuestaActividad==='function')window.pjRegistrarRespuestaActividad(correct)};
const playSound=(name,fallback)=>{if(window.pjSonido&&typeof window.pjSonido[name]==='function')window.pjSonido[name]();else fallback()};
const ok=()=>{notifyAnswer(true);playSound('exito',()=>{tone(660,.1);setTimeout(()=>tone(880,.18),90);setTimeout(()=>tone(1100,.2),200)})},bad=()=>{notifyAnswer(false);playSound('error',()=>tone(220,.3,'sawtooth',110))},boing=()=>playSound('pop',()=>tone(250,.35,'sine',700)),mech=()=>playSound('golpe',()=>{tone(120,.08,'square');setTimeout(()=>tone(90,.12,'square'),80)});
const STAR='<svg viewBox="0 0 24 24" width="20" height="20" style="vertical-align:-4px"><path d="M12 2l3 7 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.8l1.8-7.3L1.5 9.6 9 9z" fill="#ffc928" stroke="#d99100" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const star=(n=1)=>{ST+=n;hdr()};
const say=(id,t,c)=>{const e=$(id);e.className='msg '+(c||'');e.textContent=t};
const SPK=on=>`<svg viewBox="0 0 24 24" width="20" height="20" style="vertical-align:-4px"><path d="M3 9v6h4l5 4V5L7 9z" fill="currentColor"/>${on?'<path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>':'<path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'}</svg>`;
const setMute=()=>{$('#mute').innerHTML=SPK(snd)+' Sonido '+(snd?'activado':'silenciado')};$('#mute').onclick=()=>{snd=!snd;setMute()};
const NAV=[['g1','Píxel','<svg viewBox="0 0 32 32" width="30" height="30">'+['#e53935','#ffd54f','#42a5f5','#4caf50','#e0e6ee','#ff8a3d','#8f7bff','#e53935','#ffd54f'].map((c,i)=>`<rect x="${2+i%3*10}" y="${2+Math.floor(i/3)*10}" width="9" height="9" rx="2" fill="${c}"/>`).join('')+'</svg>'],
['g2','Balanza','<svg viewBox="0 0 32 32" width="30" height="30"><path d="M16 5V26M9 27H23" stroke="#8a5524" stroke-width="3" stroke-linecap="round"/><path d="M4 10H28" stroke="#8a5524" stroke-width="3" stroke-linecap="round"/><path d="M4 10L1 19H9ZM28 10L23 19H31Z" fill="#e5a91a" stroke="#9a6a14" stroke-width="1.5" stroke-linejoin="round"/></svg>'],
['g5','Arcade','<svg viewBox="0 0 32 32" width="30" height="30"><path d="M16 29q-3-3 0-5" stroke="#777" stroke-width="1.5" fill="none"/><path d="M16 3C8 3 6 10 7 14C8 20 13 23 16 24C19 23 24 20 25 14C26 10 24 3 16 3Z" fill="#ff4d6d" stroke="#c4284a" stroke-width="2"/><path d="M16 24l-3 4h6z" fill="#c4284a"/><ellipse cx="12" cy="10" rx="2.5" ry="4" fill="#fff" opacity=".5"/></svg>'],
['g6','El río','<svg viewBox="0 0 44 32" width="34" height="25"><ellipse cx="22" cy="21" rx="19" ry="10" fill="#3cb54a" stroke="#1c6b2a" stroke-width="2.5"/><circle cx="11" cy="9" r="8" fill="#4cc65a" stroke="#1c6b2a" stroke-width="2.5"/><circle cx="33" cy="9" r="8" fill="#4cc65a" stroke="#1c6b2a" stroke-width="2.5"/><circle cx="11" cy="9" r="4.5" fill="#fff"/><circle cx="33" cy="9" r="4.5" fill="#fff"/><circle cx="12" cy="10" r="2.5" fill="#1b1b2f"/><circle cx="34" cy="10" r="2.5" fill="#1b1b2f"/><path d="M12 22Q22 29 32 22" stroke="#1c4d22" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'],
['g7','Monstruo','<svg viewBox="0 0 32 32" width="30" height="30"><path d="M16 4C25 4 29 12 29 19C29 26 24 29 16 29C8 29 3 26 3 19C3 12 7 4 16 4Z" fill="#7c4dff" stroke="#3b1fa8" stroke-width="2"/><circle cx="11" cy="14" r="4" fill="#fff"/><circle cx="21" cy="14" r="4" fill="#fff"/><circle cx="12" cy="15" r="2" fill="#2b2350"/><circle cx="22" cy="15" r="2" fill="#2b2350"/><path d="M10 22Q16 28 22 22Z" fill="#3a0f3d"/><circle cx="9" cy="3" r="2.5" fill="#ffd23f"/><circle cx="23" cy="3" r="2.5" fill="#ff6fae"/></svg>'],
['g8','Fracciones','<svg viewBox="0 0 32 32" width="30" height="30"><path d="M11 24V8L26 5V21" stroke="#7c4dff" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M11 12L26 9" stroke="#7c4dff" stroke-width="3"/><ellipse cx="8" cy="24" rx="5" ry="4" fill="#ff6fae" transform="rotate(-20 8 24)"/><ellipse cx="23" cy="21" rx="5" ry="4" fill="#ff6fae" transform="rotate(-20 23 21)"/></svg>'],
['g9','Estimar','<svg viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="16" r="13" fill="#fff" stroke="#2b2350" stroke-width="2"/><circle cx="16" cy="16" r="10" fill="#e5484d"/><circle cx="16" cy="16" r="7" fill="#fff"/><circle cx="16" cy="16" r="4" fill="#e5484d"/><circle cx="16" cy="16" r="1.5" fill="#fff"/></svg>']];
function initUI(){$('#tabs').innerHTML=NAV.map((n,i)=>`<button data-g="${n[0]}" class="${i?'':'on'}"><b>${n[2]}</b>${n[1]}</button>`).join('');$('#ttl').innerHTML='<svg viewBox="0 0 32 32" width="30" height="30" style="vertical-align:-6px"><path d="M16 3C22 8 22 18 20 24H12C10 18 10 8 16 3Z" fill="#e8ecff" stroke="#3b1fa8" stroke-width="2"/><circle cx="16" cy="14" r="3" fill="#42a5f5" stroke="#3b1fa8"/><path d="M12 20L7 25L12 24ZM20 20L25 25L20 24Z" fill="#ff6fae"/><path d="M13 25Q16 31 19 25Z" fill="#ffa42e"/></svg> Mates Aventura';star(0);setMute()}
$('#tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;const g=b.dataset.g;root.querySelectorAll('.game').forEach(x=>x.classList.toggle('on',x.id==g));root.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x==b));if(g!='g5')stopArcade()};
const cf=h=>cfS(h);

/* 1 PÍXEL */
const ART={cohete:['...rr...','..rwwr..','..rwwr..','..wbbw..','..wwww..','.rwwwwr.','rr.yy.rr','...oo...'],dino:['...ggg..','...gwgg.','...gggg.','g..gg...','gg.ggg..','.gggggg.','..gggg..','..g..g..']};
const PAL={'.':'#26345a',r:'#e53935',w:'#e0e6ee',b:'#42a5f5',y:'#ffd54f',o:'#ff8a3d',g:'#4caf50'};
let P={cells:[],sel:-1,done:0};
function genOp(){const data=config.datos||{},difficulty=String(data.dificultad||'media').toLowerCase(),levels={facil:10,'fácil':10,media:30,medio:30,dificil:100,'difícil':100},max=Number(data.maximoNumero??levels[difficulty]??30),types=Array.isArray(data.tiposOperacion)&&data.tiposOperacion.length?data.tiposOperacion:['+'],raw=String(types[R(0,types.length-1)]).toLowerCase(),op=({'+':'+',suma:'+','sum':'+','-':'−','−':'−',resta:'−',sub:'−','*':'×','×':'×',multiplicacion:'×','multiplicación':'×',mul:'×','/':'÷','÷':'÷',division:'÷','división':'÷'})[raw];let a,b;if(op==='+'){a=R(2,max);b=R(2,max);return[a+' + '+b,a+b]}if(op==='−'){a=R(1,max);b=R(1,a);return[a+' − '+b,a-b]}if(op==='×'){a=R(2,Math.min(12,max));b=R(2,Math.min(12,max));return[a+' × '+b,a*b]}b=R(2,Math.min(12,max));a=b*R(1,Math.max(1,Math.floor(max/b)));return[a+' ÷ '+b,a/b]}
function pNew(){P.cells=[...ART[$('#p-art').value].join('')].map(c=>{const[t,a]=genOp();return{c,t,a,d:false}});P.done=0;$('#grid').innerHTML=P.cells.map((c,i)=>`<div class="cell" data-i="${i}">${c.t}</div>`).join('');say('#pmsg','');pSel(0)}
function pSel(i){P.sel=i;root.querySelectorAll('.cell').forEach((e,k)=>e.classList.toggle('sel',k==i));$('#opbox').textContent=i<0?'Listo':P.cells[i].t+' = ?';$('#ans').value='';$('#pprog').textContent=`Celdas pintadas: ${P.done} de 64`;if(i>=0)$('#ans').focus({preventScroll:true})}
$('#grid').onclick=e=>{const i=e.target.dataset.i;if(i!=null&&!P.cells[i].d)pSel(+i)};
function pCheck(){if(P.sel<0||$('#ans').value==='')return;const c=P.cells[P.sel],el=root.querySelectorAll('.cell')[P.sel];
if(+$('#ans').value===c.a){c.d=true;P.done++;star();el.classList.add('done');el.style.background=PAL[c.c];ok();say('#pmsg','¡Correcto! ','good');const k=P.cells.findIndex((x,j)=>!x.d&&j>P.sel),n=k>=0?k:P.cells.findIndex(x=>!x.d);if(n<0){pSel(-1);say('#pmsg',' ¡Dibujo completo! ¡Eres genial!','good');cf($('#g1'));star(5)}else pSel(n)}
else{bad();el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad');setTimeout(()=>el.classList.remove('bad'),500);$('#ans').value='';say('#pmsg','Casi… ¡prueba otra vez! ','badc');$('#ans').focus()}}
$('#p-ok').onclick=pCheck;$('#ans').onkeydown=e=>{if(e.key=='Enter')pCheck()};$('#p-new').onclick=pNew;$('#p-lvl').onchange=pNew;$('#p-art').onchange=pNew;

/* 2 BALANZA */
let B={lvl:1,lock:false,green:false,t:1,put:[],tray:[]};
const WC=['#e5484d','#f08a24','#d9a500','#2fa84f','#2f7de0','#8a4de0','#d6409f'],wcol=v=>WC[(parseInt(v)||7)%7];
const wtSvg=(l,c)=>`<svg viewBox="0 0 60 60"><path d="M22 14Q22 5 30 5Q38 5 38 14" stroke="#555" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M13 16H47L55 55H5Z" fill="${c}" stroke="#0007" stroke-width="3" stroke-linejoin="round"/><path d="M17 22L11 48" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/><text x="30" y="46" text-anchor="middle" font-size="24" font-weight="800" fill="#fff" stroke="#0005" stroke-width=".8">${l}</text></svg>`;
function chips(a,click){const w=a.map(v=>Math.max(34,16+11*String(v).length)),tot=w.reduce((x,y)=>x+y+5,-5),k=tot>130?130/tot:1;let x=-tot/2,o='';a.forEach((v,i)=>{const col=B.green?'#2fa84f':(B.t==0?wcol(v):'#6a57d6'),cx=x+w[i]/2;o+=`<g ${click?`data-i="${i}" style="cursor:pointer"`:''}><path d="M${cx-7} 28Q${cx-7} 21 ${cx} 21Q${cx+7} 21 ${cx+7} 28" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${x+5} 28H${x+w[i]-5}L${x+w[i]} 58H${x}Z" fill="${col}" stroke="#0007" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x+8} 33L${x+5} 52" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/><text x="${cx}" y="49" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">${v}</text></g>`;x+=w[i]+5});return`<g transform="scale(${k})" style="transform-origin:0 60px">${o}</g>`}
function bowl(a,c){return`<path d="M0 0L-64 60M0 0L64 60" stroke="#8a6a2a" stroke-width="2.5"/><circle r="5" fill="#c9a24a" stroke="#6b4e12" stroke-width="2"/><path d="M-76 60H76Q64 92 0 92Q-64 92 -76 60Z" fill="url(#${B.green?'brassOk':'brass'})" stroke="#6b4e12" stroke-width="3" stroke-linejoin="round"/><ellipse cx="0" cy="60" rx="76" ry="6" fill="#fff" opacity=".35"/>`+chips(a,c)}
function drawB(L,Rr,diff){const a=Math.max(-16,Math.min(16,-diff*4));$('#beam').style.transform=`rotate(${a}deg)`;$('#pl').style.transform=$('#pr').style.transform=`rotate(${-a}deg)`;$('#pl').innerHTML=bowl(L,false);$('#pr').innerHTML=bowl(Rr,B.t==0);$('#bline').setAttribute('fill',B.green?'#2fa84f':'url(#wood)')}
const sum=a=>a.reduce((x,y)=>x+y,0);
function bNew(){B.green=false;B.lock=false;B.t=B.lvl%2;const m=5+B.lvl*2;$('#blvl').textContent=B.lvl;say('#bmsg','');
if(B.t==0){const a=R(1,m),b=R(1,m),T=a+b,x=R(1,T-1);B.L=[a,b];B.T=T;B.tray=sh([T,x,T-x,R(1,T+3),R(1,T+3),R(1,9)].map(v=>({v,u:false})));B.put=[];$('#bgoal').textContent='Equilibra la balanza';$('#bhelp').textContent='Toca las pesas para ponerlas a la derecha; toca una puesta para quitarla.';bTray();drawB(B.L,[],T)}
else{const a=R(1,m),b=R(1,m),c=R(1,m),d=Math.random()<.25&&a+b-c>0?a+b-c:R(1,m);B.ls=a+b;B.rs=c+d;B.Ls=a+'+'+b;B.Rs=c+'+'+d;$('#bgoal').textContent='¿Qué lado pesa más?';$('#bhelp').textContent='Si fallas, la balanza te lo enseña y pasas al siguiente reto.';$('#bctl').innerHTML='<div class="tray">'+['<','=','>'].map(s=>`<button class="w sym" data-s="${s}">${s}</button>`).join('')+'</div>';drawB([B.Ls],[B.Rs],0)}}
function bTray(){$('#bctl').innerHTML='<div class="tray">'+B.tray.map((w,i)=>`<button class="w" data-i="${i}" ${w.u?'disabled':''}>${wtSvg(w.v,wcol(w.v))}</button>`).join('')+'</div>'}
function bUpd(){const r=B.put.map(i=>B.tray[i].v),d=B.T-sum(r);drawB(B.L,r,d);bTray();mech();if(d==0){B.green=true;B.lock=true;drawB(B.L,r,0);say('#bmsg','¡Equilibrio perfecto!','good');star(2);setTimeout(ok,400);setTimeout(()=>cf($('#g2')),400);setTimeout(()=>{B.lvl++;bNew()},2200)}else say('#bmsg',d<0?'Te pasaste: pesa más la derecha':'Aún falta peso a la derecha','')}
$('#bctl').onclick=e=>{if(B.lock)return;const b=e.target.closest('button');if(!b)return;if(b.dataset.s){const sy=b.dataset.s,tr=B.ls>B.rs?'>':B.ls<B.rs?'<':'=';B.lock=true;if(sy==tr){B.green=true;drawB([B.Ls],[B.Rs],B.ls-B.rs);ok();star(2);cf($('#g2'));say('#bmsg',`¡Sí! ${B.ls} ${tr} ${B.rs}`,'good')}else{drawB([B.Ls],[B.Rs],(B.rs-B.ls)||3);mech();bad();say('#bmsg',`Ups, es ${B.ls} ${tr} ${B.rs}. Siguiente reto`,'badc')}setTimeout(()=>{B.lvl++;bNew()},2200)}
else if(b.dataset.i!=null&&!b.disabled){const i=+b.dataset.i;B.tray[i].u=true;B.put.push(i);bUpd()}};
$('#bal').onclick=e=>{if(B.lock||B.t!=0)return;const g=e.target.closest('[data-i]');if(!g)return;const k=+g.dataset.i;B.tray[B.put[k]].u=false;B.put.splice(k,1);bUpd()};

/* 5 ARCADE */
let A={on:false,b:[],hp:3,sc:0,raf:0};
const HEART=f=>`<svg viewBox="0 0 24 22"><path d="M12 20C-3 10 3 0 12 6C21 0 27 10 12 20Z" fill="${f?'#ff4d6d':'none'}" stroke="#ff4d6d" stroke-width="2" ${f?'':'stroke-opacity=".45"'} stroke-linejoin="round"/></svg>`;
const BAL=h=>`<svg viewBox="0 0 70 100"><path d="M35 86q-7 5 0 12" stroke="#555" stroke-width="2" fill="none"/><path d="M35 6C12 6 4 26 6 42C8 62 24 78 35 80C46 78 62 62 64 42C66 26 58 6 35 6Z" fill="hsl(${h},80%,55%)" stroke="hsl(${h},70%,36%)" stroke-width="3"/><path d="M35 80l-6 8h12z" fill="hsl(${h},70%,40%)"/><ellipse cx="22" cy="28" rx="7" ry="13" fill="#fff" opacity=".42" transform="rotate(20 22 28)"/></svg>`;
function genQ(t){if(t=='mix')t=['half','add','mul'][R(0,2)];let q,a;if(t=='half'){if(Math.random()<.5){const n=2*R(2,50);q='Mitad de '+n;a=n/2}else{const n=R(2,40);q='Doble de '+n;a=n*2}}else if(t=='add'){const x=R(5,40),y=R(2,x);if(Math.random()<.5){q=x+' + '+y;a=x+y}else{q=x+' − '+y;a=x-y}}else{const x=R(2,9),y=R(2,9);q=x+' × '+y;a=x*y}return[q,a]}
let motorQuestions=null;
function round(){const ar=$('#arena');A.b.forEach(b=>b.el.remove());A.b=[];const custom=motorQuestions?.[A.sc];let q,a,options;if(custom){q=custom.pregunta||`${custom.a} ${custom.op||'+'} ${custom.b}`;a=Number(custom.correcta??custom.respuesta??(custom.op==='×'?custom.a*custom.b:custom.op==='−'?custom.a-custom.b:custom.op==='÷'?custom.a/custom.b:custom.a+custom.b));options=custom.opciones||[]}else{[q,a]=genQ($('#a-t').value);options=[]}$('#q').textContent=q+' = ?';const o=new Set([a,...options.map(Number)]);while(o.size<5){const d=a+R(-10,10);if(d>=0&&d!=a)o.add(d)}const sp=(ar.clientWidth-62)/4,sl=sh([0,1,2,3,4]),hs=sh([350,8,45,140,200,280]);[...o].slice(0,5).forEach((v,i)=>{const el=documentRef.createElement('button');el.className='bub';el.innerHTML=BAL(hs[i])+`<span>${v}</span>`;ar.appendChild(el);const b={el,v,ok:v==a,x:sl[i]*sp,y:ar.clientHeight+i*60+R(0,30),vy:.6+Math.min(A.sc,25)*.035};el.onclick=()=>pop(b);A.b.push(b)})}
function pop(b){if(!A.on)return;if(b.ok){ok();cfS($('#arena'),b.x+31,b.y+40);A.sc++;star();hud();round()}else{bad();b.el.classList.remove('bo');void b.el.offsetWidth;b.el.classList.add('bo');b.y+=60;hit()}}
function hit(){A.hp--;hud();if(A.hp<=0)end()}
function hud(){$('#a-hud').innerHTML=[0,1,2].map(i=>HEART(i<A.hp)).join('')+`<span style="margin-left:8px">${STAR} ${A.sc}</span>`}
function end(){A.on=false;cancelAnimationFrame(A.raf);$('#ovt').textContent=`¡Fin! ${A.sc} aciertos`;$('#over').style.display='flex';playSound('error',()=>tone(220,.3,'sawtooth',110))}
function loop(){if(!A.on)return;A.b.forEach(b=>{b.y-=b.vy;b.el.style.transform=`translate(${b.x}px,${b.y}px)`});const c=A.b.find(b=>b.ok);if(c&&c.y<-90){bad();hit();if(A.on)round()}A.raf=requestAnimationFrame(loop)}
function startA(){stopArcade();A={on:true,b:[],hp:Number(config.datos?.vidas)||3,sc:0,raf:0};motorQuestions=config.datos?.preguntas||null;$('#over').style.display='none';hud();round();loop()}
function stopArcade(){A.on=false;cancelAnimationFrame(A.raf)}
$('#a-go').onclick=startA;$('#a-re').onclick=startA;$('#a-hud').innerHTML=[0,1,2].map(i=>HEART(1)).join('');

/* 6 RÍO */
let Rv={},RT={ok:0,ko:0},rTm=0;
const FROG=`<svg class="frog" viewBox="0 0 120 90"><ellipse cx="60" cy="85" rx="38" ry="5" fill="#0003"/>
<path d="M30 68Q6 70 10 85Q30 90 46 80Z" fill="#2f9a3c" stroke="#1c6b2a" stroke-width="3" stroke-linejoin="round"/><path d="M90 68Q114 70 110 85Q90 90 74 80Z" fill="#2f9a3c" stroke="#1c6b2a" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="60" cy="58" rx="37" ry="27" fill="url(#frogG)" stroke="#1c6b2a" stroke-width="3.5"/>
<ellipse cx="60" cy="69" rx="23" ry="14" fill="#e3f8b4" opacity=".9"/>
<path d="M38 80q-3 8 5 8h11q3-6-3-8z" fill="#46c04f" stroke="#1c6b2a" stroke-width="2.5" stroke-linejoin="round"/><path d="M82 80q3 8-5 8H66q-3-6 3-8z" fill="#46c04f" stroke="#1c6b2a" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="76" cy="46" r="3.5" fill="#1f7a2c" opacity=".5"/><circle cx="48" cy="44" r="3" fill="#1f7a2c" opacity=".5"/><circle cx="62" cy="40" r="2.5" fill="#1f7a2c" opacity=".5"/>
<circle cx="38" cy="33" r="15" fill="#55cf5f" stroke="#1c6b2a" stroke-width="3.5"/><circle cx="82" cy="33" r="15" fill="#55cf5f" stroke="#1c6b2a" stroke-width="3.5"/>
<circle cx="38" cy="33" r="10" fill="#fff"/><circle cx="82" cy="33" r="10" fill="#fff"/>
<circle cx="40" cy="35" r="5.5" fill="#1b1b2f"/><circle cx="84" cy="35" r="5.5" fill="#1b1b2f"/><circle cx="42" cy="32.5" r="2" fill="#fff"/><circle cx="86" cy="32.5" r="2" fill="#fff"/>
<ellipse class="lid" cx="38" cy="33" rx="11" ry="11" fill="#55cf5f"/><ellipse class="lid" cx="82" cy="33" rx="11" ry="11" fill="#55cf5f"/>
<ellipse cx="30" cy="56" rx="7" ry="4.5" fill="#ff8aa8" opacity=".6"/><ellipse cx="90" cy="56" rx="7" ry="4.5" fill="#ff8aa8" opacity=".6"/>
<path d="M44 55Q60 68 76 55" stroke="#1c4d22" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
const stoneSvg=g=>`<svg class="sk" viewBox="0 0 100 60"><path d="M5 34Q7 11 50 9Q93 11 95 34Q93 55 50 55Q7 55 5 34Z" fill="url(#${g})" stroke="${g=='goldG'?'#a96d1c':'#5d584d'}" stroke-width="3"/><path d="M17 27Q38 15 68 19" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M70 42l8-5 6 4M24 41l7 3" stroke="#000" stroke-opacity=".15" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
const PAD=`<svg viewBox="0 0 100 70"><ellipse cx="50" cy="38" rx="46" ry="28" fill="url(#padG)" stroke="#1e7a30" stroke-width="3"/><g stroke="#1e7a30" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"><path d="M50 38L14 28M50 38L18 54M50 38L50 12M50 38L82 54M50 38L86 28"/></g><ellipse cx="34" cy="24" rx="16" ry="6" fill="#fff" opacity=".28" transform="rotate(-14 34 24)"/></svg>`;
const SPL='<div class="splash"><i></i><i></i><i></i><i></i><i></i><b></b><b></b></div>';
function cfS(host,px,py){const cols=['#ff6fae','#ffd23f','#34b8a0','#6c7bff','#ff8a3d'],x0=px??host.clientWidth/2,y0=py??host.clientHeight/3;for(let i=0;i<28;i++){const e=documentRef.createElement('span'),w=R(7,13);e.style.cssText=`position:absolute;left:${x0}px;top:${y0}px;width:${w}px;height:${w*(i%2?1:.5)}px;background:${cols[i%5]};border-radius:${i%3?'2px':'50%'};z-index:9;pointer-events:none`;host.appendChild(e);const a=Math.random()*6.28,d=70+Math.random()*120;e.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+50}px) rotate(${R(-500,500)}deg)`,opacity:0}],{duration:1200}).onfinish=()=>e.remove()}}
function rNew(){clearTimeout(rTm);let ru=$('#r-rule').value;if(ru=='mix')ru=['5','2','3','10','even'][R(0,4)];const ev=ru=='even',st=+ru;Rv={ev,s:st,seq:ev?[]:[st*R(0,4)],n:0,min:Math.max(1,+$('#r-min').value||8),reached:false,over:false};$('#rrule').textContent=ev?'Salta solo por las piedras con número par':`Salta sumando de ${st} en ${st}. Si te caes, empieza otro reto.`;$('#r-stop').style.display='none';say('#rmsg','');rDraw(true);rChoices()}
function rDraw(land,fell){const sq=Rv.seq.slice(-3);let h='';if(!sq.length)h=`<div class="rk cur">${stoneSvg('goldG')}<span class="num" style="font-size:22px">Inicio</span><div class="frogw">${FROG}</div></div>`;sq.forEach((v,i)=>{const cur=i==sq.length-1;if(i&&!Rv.ev)h+=`<span class="jmp">+${Rv.s}</span>`;h+=`<div class="rk ${cur?'cur':''} ${cur&&fell?'fell':''}">${stoneSvg(cur?'goldG':'stoneG')}<span class="num">${v}</span>${cur?`<div class="frogw ${land?'land':''}">${FROG}</div>${fell?SPL:''}`:''}</div>`});$('#trail').innerHTML=h;$('#bar i').style.width=Math.min(100,Rv.n/Rv.min*100)+'%';$('#rcount').textContent=`${Rv.reached?'Objetivo superado. ':''}Saltos: ${Rv.n}${Rv.reached?'':' de '+Rv.min}  |  Aciertos: ${RT.ok}  |  Caídas: ${RT.ko}`}
function rChoices(){let o=[],c;if(Rv.ev){c=2*R(1,30);o=[c];while(o.length<4){const d=2*R(0,30)+1;if(!o.includes(d))o.push(d)}}else{const st=Rv.s,l=Rv.seq[Rv.seq.length-1];c=l+st;o=[c];while(o.length<4){const d=c+R(-st-3,st+3);if(d>=0&&d%st!=0&&!o.includes(d))o.push(d)}}Rv.c=c;$('#choices').innerHTML=sh(o).map(v=>`<button class="pad" data-v="${v}">${PAD}<span>${v}</span></button>`).join('')}
$('#choices').onclick=e=>{const b=e.target.closest('.pad');if(!b||Rv.over)return;const v=+b.dataset.v,good=Rv.ev?v%2==0:v==Rv.c;
if(good){ok();Rv.seq.push(v);Rv.n++;say('#rmsg','¡Salto perfecto!','good');if(!Rv.reached&&Rv.n>=Rv.min){Rv.reached=true;RT.ok++;star(3);cfS($('#g6'));$('#r-stop').style.display='';say('#rmsg','¡Objetivo conseguido! Sigue tan lejos como quieras','good')}rDraw(true);rChoices()}
else{Rv.over=true;bad();b.classList.add('sink');root.querySelectorAll('.pad').forEach(p=>{p.disabled=true;if(Rv.ev?p.dataset.v%2==0:+p.dataset.v==Rv.c)p.classList.add('right')});if(!Rv.reached)RT.ko++;rDraw(false,true);say('#rmsg',Rv.reached?`¡Plof! Llegaste a ${Rv.n} saltos. Nuevo reto`:'¡Plof! La correcta es la que brilla. Siguiente reto','badc');rTm=setTimeout(rNew,2800)}};
$('#r-stop').onclick=()=>{say('#rmsg',`Llegaste a ${Rv.seq[Rv.seq.length-1]}. Nuevo reto`,'good');$('#r-stop').style.display='none';Rv.over=true;rTm=setTimeout(rNew,1500)};
$('#r-new').onclick=rNew;$('#r-rule').onchange=rNew;$('#r-min').onchange=rNew;

/* 7 MONSTRUO */
let M={t:0,c:0,lock:false},D=null,mT=0;
const face=f=>$('#mon').setAttribute('class',f);
function mNew(){M.t=R(1,+$('#m-max').value);M.c=0;M.lock=false;$('#m-t').textContent=M.t;mBar();face('idle');say('#m-msg','');mCnt()}
function mBar(){$('#m-bar').style.width=Math.min(100,M.c/M.t*100)+'%'}
function mCnt(){if(!M.lock)say('#m-msg',$('#m-cnt').checked&&M.c>0?`Llevas ${M.c}`:'')}
function feed(v){if(M.lock)return;M.c+=v;({100:()=>tone(70,.4,'square',40,.2),10:()=>tone(500,.08,'triangle'),1:()=>tone(1200,.05)})[v]();mBar();clearTimeout(mT);
if(M.c==M.t){M.lock=true;face('happy');say('#m-msg',`¡Delicioso! Exactamente ${M.t} `,'good');ok();cf($('#g7'));star(2);setTimeout(mNew,2600)}
else if(M.c>M.t){M.lock=true;face('chew');mT=setTimeout(()=>{face('sick');say('#m-msg',`¡BUUURP! Te pasaste (${M.c}). ¡Otra vez!`,'badc');tone(90,.7,'sawtooth',50,.15)},500);setTimeout(()=>{M.c=0;M.lock=false;mBar();face('idle');say('#m-msg','')},2600)}
else{face('chew');mCnt();mT=setTimeout(()=>face('idle'),650)}}
function overMon(e){const r=$('#monwrap').getBoundingClientRect(),p=14;return e.clientX>r.left-p&&e.clientX<r.right+p&&e.clientY>r.top-p&&e.clientY<r.bottom+p}
function look(e){const r=$('#mon').getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height*.4),d=Math.hypot(dx,dy)||1,k=Math.min(6,d/12);root.querySelectorAll('#mon .pup').forEach(p=>p.style.transform=`translate(${dx/d*k}px,${dy/d*k}px)`)}
function mv(e){if(!D)return;const g=D.g;g.style.transform=`translate(${e.clientX-g.offsetWidth/2}px,${e.clientY-g.offsetHeight/2}px) scale(1.15)`;if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)>8)D.moved=true;const o=overMon(e);$('#monwrap').classList.toggle('hl',o);if(!M.lock)face(o?'open':'idle');look(e)}
$('#feed').addEventListener('pointerdown',e=>{const b=e.target.closest('.fb');if(!b||M.lock||D)return;e.preventDefault();const g=b.querySelector('.blk').cloneNode();g.style.cssText='position:fixed;left:0;top:0;z-index:50;pointer-events:none;filter:drop-shadow(0 8px 6px #0005)';root.appendChild(g);D={v:+b.dataset.v,g,x0:e.clientX,y0:e.clientY,moved:false};mv(e)});
listen('pointermove',mv);
const mUp=e=>{if(!D)return;const d=D;D=null;$('#monwrap').classList.remove('hl');const o=overMon(e);if(o||!d.moved){const r=$('#mon').getBoundingClientRect(),g=d.g,cx=r.left+r.width/2-g.offsetWidth/2,cy=r.top+r.height*.62-g.offsetHeight/2;g.animate([{transform:g.style.transform},{transform:`translate(${cx}px,${cy}px) scale(.15)`,opacity:.2}],{duration:220}).onfinish=()=>g.remove();feed(d.v)}else{d.g.remove();if(!M.lock)face('idle')}root.querySelectorAll('#mon .pup').forEach(p=>p.style.transform='')};
listen('pointerup',mUp);listen('pointercancel',mUp);
$('#m-clr').onclick=()=>{if(M.lock)return;M.c=0;mBar();face('idle');say('#m-msg','')};$('#m-max').onchange=mNew;$('#m-cnt').onchange=mCnt;

/* 8 FRACCIONES */
const NT=[c=>`<svg viewBox="0 0 40 56"><ellipse cx="20" cy="30" rx="14" ry="9.5" fill="none" stroke="${c}" stroke-width="5" transform="rotate(-20 20 30)"/></svg>`,
c=>`<svg viewBox="0 0 40 56"><ellipse cx="16" cy="42" rx="12" ry="8" fill="none" stroke="${c}" stroke-width="4.5" transform="rotate(-20 16 42)"/><path d="M27 38V6" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`,
c=>`<svg viewBox="0 0 40 56"><ellipse cx="16" cy="42" rx="12" ry="8" fill="${c}" transform="rotate(-20 16 42)"/><path d="M27 38V6" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`,
c=>`<svg viewBox="0 0 40 56"><ellipse cx="14" cy="42" rx="12" ry="8" fill="${c}" transform="rotate(-20 14 42)"/><path d="M25 38V6Q38 12 34 28" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`];
const PIANO=`<svg viewBox="0 0 120 90"><rect x="6" y="20" width="108" height="62" rx="9" fill="#2b2350" stroke="#150f33" stroke-width="3"/><rect x="12" y="27" width="96" height="49" rx="3" fill="#fff"/>${[1,2,3,4,5,6].map(k=>`<path d="M${12+k*96/7} 27V76" stroke="#bbb" stroke-width="1.5"/>`).join('')}${[1,2,4,5,6].map(k=>`<rect x="${12+k*96/7-5}" y="27" width="10" height="30" rx="2" fill="#1b1630"/>`).join('')}<rect x="12" y="27" width="96" height="6" fill="#0002"/></svg>`;
const VIOLIN=`<svg viewBox="0 0 120 90"><g transform="rotate(-28 60 46)"><rect x="56" y="2" width="8" height="40" rx="3" fill="#3a2412"/><circle cx="60" cy="4" r="5" fill="#5a3a1c"/><path d="M60 36C46 36 40 48 49 55C38 61 39 82 60 84C81 82 82 61 71 55C80 48 74 36 60 36Z" fill="url(#woodG)" stroke="#5a2f0e" stroke-width="3"/><path d="M52 62q-2 8 1 12M68 62q2 8-1 12" stroke="#2b1408" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 40V76M63 40V76" stroke="#fff" stroke-opacity=".7" stroke-width="1"/><rect x="52" y="70" width="16" height="3" fill="#2b1408"/></g><path d="M14 76L106 32" stroke="#8a5524" stroke-width="3.5" stroke-linecap="round"/><path d="M18 80L106 36" stroke="#fff" stroke-opacity=".75" stroke-width="1.5"/></svg>`;
const GUITAR=`<svg viewBox="0 0 120 90"><g transform="translate(0 6) scale(.92) rotate(-38 60 50)"><rect x="56.5" y="-8" width="7" height="48" rx="2" fill="#3a2412"/><rect x="53" y="-12" width="14" height="12" rx="3" fill="#5a3a1c"/><ellipse cx="60" cy="40" rx="17" ry="14" fill="url(#woodG)" stroke="#5a2f0e" stroke-width="3"/><ellipse cx="60" cy="62" rx="24" ry="20" fill="url(#woodG)" stroke="#5a2f0e" stroke-width="3"/><circle cx="60" cy="52" r="7.5" fill="#2b1408"/><rect x="50" y="68" width="20" height="4" rx="2" fill="#2b1408"/><path d="M58.5 -4V70M61.5 -4V70" stroke="#fff" stroke-opacity=".7" stroke-width="1"/></g></svg>`;
const TRUMPET=`<svg viewBox="0 0 120 90"><path d="M16 52H84" stroke="#e5a91a" stroke-width="8" stroke-linecap="round"/><path d="M30 52V28H74V52" stroke="#e5a91a" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M82 52L112 30V76Z" fill="url(#brassG)" stroke="#9a6a14" stroke-width="3" stroke-linejoin="round"/>${[40,52,64].map(x=>`<rect x="${x-3}" y="30" width="6" height="22" rx="2" fill="#f7de8a" stroke="#9a6a14" stroke-width="2"/><circle cx="${x}" cy="27" r="4" fill="#f7de8a" stroke="#9a6a14" stroke-width="2"/>`).join('')}<circle cx="11" cy="52" r="6" fill="#f7de8a" stroke="#9a6a14" stroke-width="2.5"/><path d="M20 49H80" stroke="#fff" stroke-opacity=".5" stroke-width="2"/></svg>`;
const LOCK='<svg class="lk" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="12" rx="3" fill="#6b6490"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#6b6490" stroke-width="3" fill="none"/></svg>';
const FR=[['1',8,'#ff6b6b'],['1/2',4,'#ffa42e'],['1/4',2,'#34b8a0'],['1/8',1,'#6c7bff']],GO=[[8,'1'],[8,'1'],[6,'3/4'],[8,'1'],[4,'1/2'],[12,'1 y 1/2']],INS=[['Piano','sine',PIANO],['Violín','triangle',VIOLIN],['Guitarra','sawtooth',GUITAR],['Trompeta','square',TRUMPET]],NOTES=[262,294,330,392,440,523];
let F={l:0,n:[],un:1,ins:0};
function fNew(){const g=GO[F.l%GO.length];F.T=g[0];$('#f-t').textContent=g[1];F.n=[];$('#f-btns').innerHTML=FR.map((f,i)=>`<button class="fn" style="background:${f[2]}" data-i="${i}">${NT[i]('#fff')}${f[0]}</button>`).join('');fIns();fDraw();say('#f-msg','')}
function fIns(){$('#f-big').innerHTML=INS[F.ins][2];$('#f-ins').innerHTML=INS.map((x,i)=>`<button class="tile ${i==F.ins?'on':''} ${i>=F.un?'lock':''}" data-i="${i}" aria-label="${x[0]}"><span class="in">${x[2]}</span>${i>=F.un?LOCK:''}</button>`).join('');$('#f-un').textContent=`${INS[F.ins][0]} | Instrumentos: ${F.un} de 4`}
$('#f-ins').onclick=e=>{const b=e.target.closest('.tile');if(!b||b.classList.contains('lock'))return;F.ins=+b.dataset.i;fIns()};
function fDraw(){const tot=sum(F.n.map(j=>FR[j][1]));$('#staff').innerHTML=F.n.map((i,k)=>`<div class="nt ${tot>F.T?'over':''}" data-k="${k}" style="width:${FR[i][1]/F.T*100}%;background:${FR[i][2]}">${NT[i]('#fff')}${FR[i][0]}</div>`).join('')}
function floatNote(){const h=$('#f-stage'),e=documentRef.createElement('span');e.className='flt';e.innerHTML=NT[R(2,3)]('#fff');e.style.left=R(10,85)+'%';e.style.bottom='40px';h.appendChild(e);e.animate([{transform:'translateY(0)',opacity:1},{transform:`translateY(-110px) rotate(${R(-25,25)}deg)`,opacity:0}],{duration:1100}).onfinish=()=>e.remove()}
$('#f-btns').onclick=e=>{const b=e.target.closest('.fn');if(!b)return;F.n.push(+b.dataset.i);tone(NOTES[R(0,5)],.1,'triangle');fDraw()};
$('#staff').onclick=e=>{const n=e.target.closest('.nt');if(!n)return;F.n.splice(+n.dataset.k,1);fDraw()};
$('#f-clr').onclick=()=>{F.n=[];fDraw()};
$('#f-play').onclick=()=>{const tot=sum(F.n.map(j=>FR[j][1]));if(!F.n.length)return;const w=INS[F.ins][1],good=tot==F.T,big=$('#f-big');let t=0;F.n.forEach((j,k)=>{const d=FR[j][1]*.25,f=NOTES[(k*2+R(0,1))%6]*(good?1:1+(Math.random()-.5)*.25),del=t+(good?0:Math.random()*.35);setTimeout(()=>{good?tone(f,d*.95,w,0,.1):tone(f,d,'sawtooth',f*.6,.08);floatNote()},del*1000);t+=d});
big.className=good?'play':'bad';setTimeout(()=>big.className='',t*1000+400);
if(good){tone(131,F.T*.25,'triangle',0,.12);say('#f-msg','¡Armonía perfecta!','good');setTimeout(()=>{cf($('#g8'));ok();star(3);let m='¡Armonía perfecta!';if(F.un<4){F.un++;F.ins=F.un-1;m='¡Perfecto! Instrumento nuevo: '+INS[F.ins][0];fIns()}say('#f-msg',m,'good');F.l++;setTimeout(fNew,2300)},t*1000+200)}
else say('#f-msg',tot>F.T?`¡Desafinado! Te pasas ${tot-F.T} octavo(s)`:`¡A destiempo! Faltan ${F.T-tot} octavo(s)`,'badc')};

/* 9 ESTIMAR */
const DN=(dx,dy,dart)=>`<svg viewBox="0 0 120 120" class="dn"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#2b2350" stroke-width="3"/><circle cx="60" cy="60" r="46" fill="#e5484d"/><circle cx="60" cy="60" r="36" fill="#fff"/><circle cx="60" cy="60" r="26" fill="#e5484d"/><circle cx="60" cy="60" r="16" fill="#fff"/><circle cx="60" cy="60" r="7" fill="#e5484d"/>${dart?`<g transform="translate(${60+dx} ${60+dy})"><g class="dartin"><path d="M0 0L20 -26" stroke="#333" stroke-width="3.5" stroke-linecap="round"/><path d="M20 -26L26 -36M20 -26L33 -29" stroke="#2f7de0" stroke-width="7" stroke-linecap="round"/></g></g>`:''}</svg>`;
const MPIN='<svg viewBox="0 0 30 40"><path d="M15 38L4 17A13 13 0 1 1 26 17Z" fill="#7c4dff" stroke="#3b1fa8" stroke-width="2.5" stroke-linejoin="round"/><circle cx="15" cy="13" r="5" fill="#fff"/></svg>';
let E={t:0,max:100,tank:false,lock:false,margin:null};
function eNew(){let m=$('#e-m').value;if(m=='mix')m=['10','100','1000','tank'][R(0,3)];E.lock=false;E.tank=m=='tank';E.max=E.tank?100:+m;E.t=E.tank?5*R(1,19):R(1,E.max-1);const sl=$('#e-sl');sl.max=E.max;sl.value=Math.round(E.max/2);say('#e-msg','');$('#e-tg').innerHTML=DN(0,0,false);
if(E.tank){say('#e-q','¿Qué porcentaje del depósito está lleno?');$('#e-vis').innerHTML=`<div class="tankwrap"><div class="scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div class="tank"><i style="height:${E.t}%"></i></div><div class="est" id="est"></div></div>`}
else{say('#e-q',`Coloca el número ${E.t} en la línea`);$('#e-vis').innerHTML=`<div class="nl"><div class="ruler"></div><div class="ticks"></div><div class="pin" id="pg" style="left:50%">${MPIN}</div><span class="lbl" style="left:0">0</span><span class="lbl" style="right:0">${E.max}</span></div>`}eVal()}
function eVal(){const v=+$('#e-sl').value;$('#e-val').textContent=E.tank?v+' %':v;const p=$('#pg');if(p)p.style.left=v/E.max*100+'%';const e=$('#est');if(e)e.style.bottom=(11+v*1.7)+'px'}
$('#e-sl').oninput=()=>{if(!E.lock)eVal()};
$('#e-go').onclick=()=>{if(E.lock)return;E.lock=true;const v=+$('#e-sl').value,tol=E.margin??Math.max(.05*E.max,E.max<=10?1:0),d=Math.abs(v-E.t),r=Math.min(52,d/tol*16),an=Math.random()*6.28;
if(!E.tank)$('#e-vis').querySelector('.nl').insertAdjacentHTML('beforeend',`<div class="pin tg" style="left:${E.t/E.max*100}%">${DN(0,0,false)}<small>${E.t}</small></div>`);
$('#e-tg').innerHTML=DN(Math.cos(an)*r,Math.sin(an)*r,true);
if(d<=tol){ok();star(2);cf($('#g9'));say('#e-msg',d==0?'¡Diana exacta!':`¡En la diana! Solo te separas ${d}`,'good')}else{bad();say('#e-msg',`Casi, estabas a ${d} de distancia${E.tank?'. Era '+E.t+' %':''}. Siguiente reto`,'badc')}setTimeout(eNew,2600)};
$('#e-m').onchange=eNew;

/* ===== NUEVOS JUEGOS ===== */
let GP=0,RP=0;
const DOT=c=>`<svg viewBox="0 0 16 16" width="14" height="14" style="vertical-align:-2px"><circle cx="8" cy="8" r="6.5" fill="${c}" stroke="#0004" stroke-width="1.5"/></svg>`;
const hdr=()=>{$('#stars').innerHTML=STAR+' '+ST+'&nbsp; '+DOT('#1fb86a')+' '+GP+'&nbsp; '+DOT('#ff4d5e')+' '+RP};
const gp=()=>{GP++;star(2)},rp=()=>{RP++;star(0)};
const swish=()=>{tone(1900,.16,'sawtooth',250,.05);setTimeout(()=>tone(900,.1,'triangle',200,.04),40)},splat=()=>{tone(220,.25,'sawtooth',50,.14);setTimeout(()=>tone(120,.2,'square',40,.08),60)};
const NSV='http://www.w3.org/2000/svg';
function mk(parent,x,y,inner){const g=documentRef.createElementNS(NSV,'g');g.setAttribute('transform',`translate(${x} ${y})`);const i=documentRef.createElementNS(NSV,'g');i.innerHTML=inner;g.appendChild(i);parent.appendChild(g);return i}
const spt=(svg,e)=>{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const r=pt.matrixTransform(svg.getScreenCTM().inverse());return[r.x,r.y]};
const tf=(cx,cy,tx,ty,s,r)=>`translate(${tx}px,${ty}px) translate(${cx}px,${cy}px) scale(${s}) rotate(${r}deg) translate(${-cx}px,${-cy}px)`;
const fmtL=n=>n.toFixed(1).replace('.',',');
NAV.push(['g10','Ninja','<svg viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="16" r="12" fill="#f7c948" stroke="#b86a1f" stroke-width="2.5"/><circle cx="12" cy="13" r="2.5" fill="#d6402f"/><circle cx="20" cy="19" r="2.5" fill="#d6402f"/><path d="M3 29L29 3" stroke="#7fd4ff" stroke-width="3.5" stroke-linecap="round"/><path d="M3 29L29 3" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/></svg>'],
['g11','Robots','<svg viewBox="0 0 32 32" width="30" height="30"><polygon points="'+'16,2 19,6 24,5 25,10 30,12 28,17 30,22 25,24 24,29 19,28 16,31 13,28 8,29 7,24 2,22 4,17 2,12 7,10 8,5 13,6'+'" fill="#ffb02e" stroke="#9a5a00" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="16" r="6" fill="#ffd36b" stroke="#9a5a00" stroke-width="2"/></svg>'],
['g12','Slime','<svg viewBox="0 0 32 32" width="30" height="30"><path d="M10 4H22V12L27 26Q28 29 25 29H7Q4 29 5 26L10 12Z" fill="#fff" fill-opacity=".5" stroke="#5b7fa6" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 20H24L27 26Q28 29 25 29H7Q4 29 5 26Z" fill="#6cd24a" stroke="#2a8a1e" stroke-width="1.5"/><circle cx="13" cy="24" r="1.8" fill="#fff"/><circle cx="19" cy="24" r="1.8" fill="#fff"/></svg>'],
['g13','Templo','<svg viewBox="0 0 32 32" width="30" height="30"><polygon points="16,3 28,13 16,29 4,13" fill="#ffe27a" stroke="#e6a800" stroke-width="2.5" stroke-linejoin="round"/><path d="M4 13H28M16 3L11 13L16 29L21 13Z" stroke="#fff" stroke-width="1.5" fill="none" stroke-opacity=".7"/></svg>'],
['g14','Topo','<svg viewBox="0 0 32 32" width="30" height="30"><rect x="4" y="14" width="24" height="14" rx="3" fill="#a8652a" stroke="#5a3010" stroke-width="2"/><path d="M4 14Q4 4 16 4Q28 4 28 14Z" fill="#c27a35" stroke="#5a3010" stroke-width="2"/><rect x="13" y="12" width="6" height="8" rx="1.5" fill="#ffd23f" stroke="#9a6a14" stroke-width="1.5"/></svg>']);

/* ---------- 10 NINJA ---------- */
let N={pts:[],drag:false,busy:false,k:'pizza',t:[1,2],poly:[],id:0};
const circ=(cx,cy,r,n=72)=>Array.from({length:n},(_,i)=>[cx+r*Math.cos(i*6.2832/n),cy+r*Math.sin(i*6.2832/n)]);
const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0))/2;
const cen=p=>[p.reduce((s,a)=>s+a[0],0)/p.length,p.reduce((s,a)=>s+a[1],0)/p.length];
function split(poly,p,q){const sd=pt=>(q[0]-p[0])*(pt[1]-p[1])-(q[1]-p[1])*(pt[0]-p[0]),A=[],B=[];poly.forEach((c,i)=>{const n=poly[(i+1)%poly.length],sc=sd(c),sn=sd(n);if(sc>=0)A.push(c);if(sc<=0)B.push(c);if((sc>0&&sn<0)||(sc<0&&sn>0)){const t=sc/(sc-sn),ip=[c[0]+t*(n[0]-c[0]),c[1]+t*(n[1]-c[1])];A.push(ip);B.push(ip)}});return[A,B]}
const fr=(a,b)=>`<span class="frac"><i>${a}</i><i>${b}</i></span>`;
const NSH={pizza:{poly:()=>circ(140,150,100),t:[[1,2],[1,4],[1,3]],name:'la pizza'},choco:{poly:()=>[[30,95],[250,95],[250,205],[30,205]],t:[[1,6],[1,3],[1,2],[2,3]],name:'la tableta de chocolate'},hexa:{poly:()=>circ(140,150,105,6),t:[[1,2],[1,4],[1,3]],name:'la figura'}};
const DET={pizza:()=>`<rect width="400" height="300" fill="#f7c948"/>${[[110,120],[170,110],[140,165],[100,180],[185,170],[150,130],[120,90],[175,205]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="13" fill="#d6402f" stroke="#a82a1d" stroke-width="2"/><circle cx="${x-3}" cy="${y-3}" r="3" fill="#ff8a7a"/>`).join('')}<circle cx="140" cy="150" r="94" fill="none" stroke="#d68a35" stroke-width="22"/><circle cx="140" cy="150" r="100" fill="none" stroke="#b86a1f" stroke-width="3"/>`,
choco:()=>`<rect width="400" height="300" fill="#4a2312"/>${Array.from({length:12},(_,i)=>{const c=i%6,r=Math.floor(i/6),x=30+c*220/6,y=95+r*55;return`<rect x="${x+3}" y="${y+3}" width="${220/6-6}" height="49" rx="5" fill="#7b4527" stroke="#2f1508" stroke-width="2"/><path d="M${x+7} ${y+8}h${220/6-14}" stroke="#a8683f" stroke-width="3" stroke-linecap="round"/>`}).join('')}`,
hexa:()=>`<rect width="400" height="300" fill="#7c4dff"/><polygon points="${circ(140,150,78,6).map(p=>p.join(',')).join(' ')}" fill="#a58bff" stroke="#fff" stroke-opacity=".5" stroke-width="4"/><circle cx="140" cy="150" r="22" fill="#ffd23f" stroke="#e6a800" stroke-width="3"/>`};
function piece(k,pts,gid){const id='nc'+(++N.id);return`<g id="${gid}"><clipPath id="${id}"><polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}"/></clipPath><g clip-path="url(#${id})">${DET[k]()}</g></g>`}
function ninjaNew(){N.busy=false;N.k=['pizza','choco','hexa'][R(0,2)];const sh0=NSH[N.k];N.t=sh0.t[R(0,sh0.t.length-1)];N.poly=sh0.poly();$('#n-obj').innerHTML=piece(N.k,N.poly,'npw');$('#n-q').innerHTML=`Corta un trozo que sea ${fr(N.t[0],N.t[1])} de ${sh0.name}`;say('#n-msg','')}
const nsvg=$('#n-svg');
function trailDraw(){const s=N.pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');$('#n-t1').setAttribute('points',s);$('#n-t2').setAttribute('points',s)}
function fadeTr(){['#n-t1','#n-t2'].forEach(id=>{const e=$(id);e.animate([{opacity:1},{opacity:0}],{duration:550}).onfinish=()=>e.setAttribute('points','')})}
nsvg.addEventListener('pointerdown',e=>{if(N.busy)return;N.drag=true;N.pts=[spt(nsvg,e)];nsvg.setPointerCapture(e.pointerId);trailDraw()});
nsvg.addEventListener('pointermove',e=>{if(!N.drag)return;N.pts.push(spt(nsvg,e));trailDraw()});
const nUp=()=>{if(!N.drag)return;N.drag=false;ninjaCut()};nsvg.addEventListener('pointerup',nUp);nsvg.addEventListener('pointercancel',nUp);
function ninjaCut(){const P=N.pts,p=P[0],q=P[P.length-1];fadeTr();if(P.length<2||Math.hypot(q[0]-p[0],q[1]-p[1])<35)return;
const[A,B]=split(N.poly,p,q);if(A.length<3||B.length<3||area(A)<20||area(B)<20){say('#n-msg','El corte tiene que atravesar la figura','badc');return}
N.busy=true;const aA=area(A),aB=area(B),f=aA/(aA+aB),tl=N.t[0]/N.t[1],margin=(N.margin??5)/100,okA=Math.abs(f-tl)<=margin,okB=Math.abs(1-f-tl)<=margin,good=okA||okB;
const nx0=-(q[1]-p[1]),ny0=q[0]-p[0],L=Math.hypot(nx0,ny0),nx=nx0/L,ny=ny0/L;
$('#n-obj').innerHTML=piece(N.k,A,'npa')+piece(N.k,B,'npb');swish();const ea=$('#npa'),eb=$('#npb');
if(good){const sg=okA?1:-1,ch=okA?ea:eb,ot=okA?eb:ea,c=cen(okA?A:B);
ch.animate([{transform:`translate(${nx*sg*8}px,${ny*sg*8}px)`},{transform:tf(c[0],c[1],340-c[0],204-c[1],.22,480),opacity:.8}],{duration:800,fill:'forwards',easing:'cubic-bezier(.5,0,.9,.6)'});
ot.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${-nx*sg*40}px,${-ny*sg*40}px)`,opacity:0}],{duration:900,delay:200,fill:'forwards'});
setTimeout(()=>{$('#n-mouth').animate([{transform:'scaleY(1)'},{transform:'scaleY(2.6)'},{transform:'scaleY(1)'}],{duration:260,iterations:4});ok()},700);
say('#n-msg','¡Swish! Corte limpio','good');gp();setTimeout(ninjaNew,2600)}
else{const k=34;ea.animate([{transform:'translate(0,0)'},{transform:`translate(${nx*k}px,${ny*k}px)`,offset:.4},{transform:'translate(0,0)'}],{duration:1000,easing:'cubic-bezier(.3,1.7,.5,1)'});eb.animate([{transform:'translate(0,0)'},{transform:`translate(${-nx*k}px,${-ny*k}px)`,offset:.4},{transform:'translate(0,0)'}],{duration:1000,easing:'cubic-bezier(.3,1.7,.5,1)'});
setTimeout(boing,350);say('#n-msg',`Boing. Ese trozo es el ${Math.round(Math.min(f,1-f)*100)}% y se pedía ${Math.round(tl*100)}%`,'badc');rp();setTimeout(()=>{$('#n-obj').innerHTML=piece(N.k,N.poly,'npw')},1050);setTimeout(ninjaNew,2800)}}

/* ---------- 11 ROBOTS ---------- */
const gearPts=(r1,r2,n)=>{const o=[],w=3.1416/n;for(let i=0;i<n;i++){const a=i*6.2832/n;[[r1,-.55],[r2,-.3],[r2,.3],[r1,.55]].forEach(([r,k])=>o.push([r*Math.cos(a+k*w),r*Math.sin(a+k*w)].map(v=>v.toFixed(1)).join(',')))}return o.join(' ')};
const gearInner=l=>`<polygon points="${gearPts(26,36,8)}" fill="#ffb02e" stroke="#9a5a00" stroke-width="3" stroke-linejoin="round"/><circle r="19" fill="#ffd36b" stroke="#9a5a00" stroke-width="2"/><text y="8" text-anchor="middle" font-size="22" font-weight="800" fill="#5a3200">${l}</text>`;
const gearSvg=l=>`<svg viewBox="-40 -40 80 80">${gearInner(l)}</svg>`;
const ROBOT=(lit,i)=>{const c=lit?['#ff6b6b','#ffa42e','#34b8a0','#6c7bff','#d6409f'][i]:'#aab2c5',e=lit?'#fff':'#6b7488';return`<svg viewBox="0 0 44 52" class="${lit?'lit':''}"><line x1="22" y1="3" x2="22" y2="10" stroke="#555" stroke-width="2.5"/><circle cx="22" cy="3" r="3" fill="${lit?'#ffd23f':'#8a93a8'}"/><rect x="8" y="10" width="28" height="20" rx="6" fill="${c}" stroke="#2b2350" stroke-width="2.5"/><circle cx="16" cy="20" r="4" fill="${e}"/><circle cx="28" cy="20" r="4" fill="${e}"/>${lit?'<circle cx="16" cy="20" r="1.8" fill="#222"/><circle cx="28" cy="20" r="1.8" fill="#222"/>':''}<rect x="10" y="32" width="24" height="16" rx="4" fill="${c}" stroke="#2b2350" stroke-width="2.5"/><rect x="2" y="33" width="6" height="12" rx="3" fill="${c}" stroke="#2b2350" stroke-width="2"/><rect x="36" y="33" width="6" height="12" rx="3" fill="${c}" stroke="#2b2350" stroke-width="2"/></svg>`};
let Rb={x:0,out:0,chips:[],si:-1,busy:false,n:0,goal:5},RD=null;
const rbGen=()=>{const u=R(0,2);if(u==0){const k=R(2,12);return{lab:'+'+k,f:v=>v+k}}if(u==1){const k=R(2,9);return{lab:'×'+k,f:v=>v*k}}const k=R(1,9);return{lab:'−'+k,f:v=>v-k,k}};
function rbRow(){$('#rb-row').innerHTML=Array.from({length:Rb.goal||5},(_,i)=>ROBOT(i<Rb.n,i)).join('')}
function robNew(){if(!$('#rb-gears').innerHTML)$('#rb-gears').innerHTML=[152,248].map(x=>`<g transform="translate(${x} 150)"><g class="gearspin"><polygon points="${gearPts(11,16,8)}" fill="#8aa5d8" stroke="#1d3c78" stroke-width="2"/><circle r="5" fill="#1d3c78"/></g></g>`).join('');
let o=rbGen(),x;if(o.lab[0]=='−')x=R(o.k+1,o.k+12);else x=R(2,12);Rb.x=x;Rb.out=o.f(x);Rb.chips=[o];let g=0;
while(Rb.chips.length<3&&g++<300){const c=rbGen();if(Rb.chips.some(z=>z.lab==c.lab))continue;const r=c.f(x);if(r<0||r==Rb.out)continue;Rb.chips.push(c)}
sh(Rb.chips);Rb.si=-1;Rb.busy=false;$('#rb-int').textContent=Rb.x;$('#rb-gt').textContent=Rb.out;
const tile=$('#rb-in');tile.getAnimations().forEach(a=>a.cancel());$('#rb-res').innerHTML='';$('#rb-sm').innerHTML='';$('#rb-fx').innerHTML='';$('#rb-m').classList.remove('mshake','mshake2');
say('#rb-msg','¿Qué chip hace que el '+Rb.x+' salga como '+Rb.out+'?');robSlot();rbRow()}
function robSlot(){$('#rb-sl').innerHTML=Rb.si>=0?`<g transform="scale(.72)">${gearInner(Rb.chips[Rb.si].lab)}</g>`:'';$('#rb-chips').innerHTML=Rb.chips.map((c,i)=>`<button class="chipb ${i==Rb.si?'sel':''}" data-i="${i}">${gearSvg(c.lab)}</button>`).join('')}
const overSlot=e=>{const r=$('#rb-slot').getBoundingClientRect(),p=30;return e.clientX>r.left-p&&e.clientX<r.right+p&&e.clientY>r.top-p&&e.clientY<r.bottom+p};
$('#rb-chips').addEventListener('pointerdown',e=>{const b=e.target.closest('.chipb');if(!b||Rb.busy||RD)return;e.preventDefault();const g=b.cloneNode(true);g.style.cssText='position:fixed;left:0;top:0;z-index:50;pointer-events:none;width:72px;height:72px;filter:drop-shadow(0 8px 6px #0005)';root.appendChild(g);RD={i:+b.dataset.i,g,x0:e.clientX,y0:e.clientY,m:false};rdMv(e)});
function rdMv(e){if(!RD)return;RD.g.style.transform=`translate(${e.clientX-36}px,${e.clientY-36}px) scale(1.1)`;if(Math.hypot(e.clientX-RD.x0,e.clientY-RD.y0)>8)RD.m=true;$('#rb-slot').style.stroke=overSlot(e)?'#fff':''}
function rdUp(e){if(!RD)return;const d=RD;RD=null;d.g.remove();$('#rb-slot').style.stroke='';if(overSlot(e)||!d.m){Rb.si=d.i;robSlot()}}
listen('pointermove',rdMv);listen('pointerup',rdUp);listen('pointercancel',rdUp);
$('#rb-slot').onclick=()=>{if(!Rb.busy){Rb.si=-1;robSlot()}};
function smoke(){const g=$('#rb-sm'),cols=['#ff6fae','#ffd23f','#6c7bff','#34b8a0','#ff8a3d'];for(let i=0;i<12;i++){const c=mk(g,238,6,`<circle r="${R(5,10)}" fill="${cols[i%5]}" opacity=".9"/>`);c.animate([{transform:'translate(0,0) scale(.4)',opacity:.9},{transform:`translate(${R(-30,40)}px,${-R(10,50)}px) scale(1.8)`,opacity:0}],{duration:1100,delay:i*70}).onfinish=()=>c.parentNode.remove()}}
function nuts(){const g=$('#rb-fx');for(let i=0;i<8;i++){const c=mk(g,200,100,`<polygon points="${gearPts(7,9,3).split(' ').slice(0,6).join(' ')}" fill="#aab2c5" stroke="#444" stroke-width="2"/><circle r="3" fill="#444"/>`);c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${R(-130,130)}px,${R(40,100)}px) rotate(${R(-500,500)}deg)`,opacity:0}],{duration:1300,delay:i*50,easing:'cubic-bezier(.2,.8,.4,1)'}).onfinish=()=>c.parentNode.remove()}}
$('#rb-go').onclick=()=>{if(Rb.busy||Rb.si<0){if(Rb.si<0)say('#rb-msg','Primero pon un chip en la máquina','badc');return}Rb.busy=true;const chip=Rb.chips[Rb.si],res=chip.f(Rb.x),good=res===Rb.out,m=$('#rb-m');
$('#rb-in').animate([{transform:'translate(35px,100px)',opacity:1},{transform:'translate(125px,100px)',opacity:0}],{duration:650,fill:'forwards'});m.classList.add(good?'mshake':'mshake2');smoke();
setTimeout(()=>{m.classList.remove('mshake','mshake2');
if(good){$('#rb-res').innerHTML=`<g transform="translate(305 100)"><g style="transform-box:fill-box;transform-origin:center;animation:pop .7s"><rect width="60" height="50" rx="10" fill="#fff6c9" stroke="#e6a800" stroke-width="4" style="filter:drop-shadow(0 0 8px #ffd23f)"/><text x="30" y="36" text-anchor="middle" font-size="28" font-weight="800" fill="#7a4a00">${res}</text></g></g>`;ok();say('#rb-msg',`¡Funciona! ${Rb.x} ${chip.lab} = ${res}`,'good');Rb.n++;rbRow();gp();if(Rb.n>=Rb.goal){setTimeout(()=>{cf($('#g11'));say('#rb-msg','¡Todos los robots están despiertos!','good');Rb.n=0},900)}}
else{nuts();bad();mech();$('#rb-res').innerHTML=`<g transform="translate(305 100)"><rect width="60" height="50" rx="10" fill="#4a4a4a" stroke="#222" stroke-width="3"/><text x="30" y="36" text-anchor="middle" font-size="28" font-weight="800" fill="#ddd">${Rb.x}</text><circle cx="12" cy="12" r="7" fill="#111" opacity=".6"/><circle cx="46" cy="38" r="9" fill="#111" opacity=".6"/><circle cx="40" cy="10" r="5" fill="#111" opacity=".5"/></g>`;say('#rb-msg',`La máquina tose: ${Rb.x} ${chip.lab} = ${res}, y se pedía ${Rb.out}`,'badc');rp()}
setTimeout(robNew,2800)},800)};

/* ---------- 12 SLIME ---------- */
let S={level:0,target:0,goal:1.5,done:false,amp:1,pour:1,last:0,was:false,bub:[]};
const TAPS=[[1,'Grifo 1 L','<svg viewBox="0 0 60 60"><rect x="6" y="10" width="38" height="16" rx="6" fill="#9aa6bd" stroke="#5b6478" stroke-width="3"/><rect x="34" y="26" width="14" height="14" fill="#7d889f" stroke="#5b6478" stroke-width="2.5"/><circle cx="20" cy="8" r="6" fill="#e5484d" stroke="#8f1d26" stroke-width="2"/><path d="M41 46Q41 54 41 54" stroke="#6cd24a" stroke-width="5" stroke-linecap="round"/></svg>'],
[.5,'Grifo 0,5 L','<svg viewBox="0 0 60 60"><rect x="12" y="12" width="32" height="13" rx="5" fill="#9aa6bd" stroke="#5b6478" stroke-width="3"/><rect x="34" y="25" width="10" height="12" fill="#7d889f" stroke="#5b6478" stroke-width="2.5"/><circle cx="24" cy="10" r="5" fill="#ff9a2e" stroke="#9a5a00" stroke-width="2"/><path d="M39 44V52" stroke="#6cd24a" stroke-width="3.5" stroke-linecap="round"/></svg>'],
[.1,'Probeta 0,1 L','<svg viewBox="0 0 60 60"><path d="M22 6H38V46Q38 54 30 54Q22 54 22 46Z" fill="#cfe9ff" stroke="#5b7fa6" stroke-width="3" stroke-linejoin="round"/><path d="M23 30H37V46Q37 53 30 53Q23 53 23 46Z" fill="#6cd24a"/><path d="M22 16H28M22 24H28M22 32H28" stroke="#5b7fa6" stroke-width="2"/></svg>']];
$('#sl-taps').innerHTML=TAPS.map(t=>`<button class="tapb" data-a="${t[0]}">${t[2]}${t[1]}</button>`).join('');
const ly=l=>308-80*l;
function slimeNew(){S.level=0;S.target=0;S.done=false;S.bub=[];S.goal=[.8,1.2,1.5,1.8,2,2.3,2.5,2.7][R(0,7)];$('#sl-goal').textContent=fmtL(S.goal)+' L';$('#sl-gl').setAttribute('y1',ly(S.goal));$('#sl-gl').setAttribute('y2',ly(S.goal));$('#sl-gt').setAttribute('y',ly(S.goal)+4);$('#sl-face').setAttribute('opacity',0);$('#sl-sp').setAttribute('opacity',0);$('#sl-fx').innerHTML='';say('#sl-msg','Llena el matraz hasta la línea dorada')}
$('#sl-taps').onclick=e=>{const b=e.target.closest('.tapb');if(!b||S.done)return;const a=+b.dataset.a;S.target=+(S.target+a).toFixed(1);S.pour=a;tone(300+a*200,.15,'sine',500,.05)};
$('#sl-clr').onclick=()=>{if(S.done)return;S.level=0;S.target=0;S.bub=[];say('#sl-msg','Matraz vacío')};
function slFace(mood){const surf=ly(Math.min(S.level,3)),mid=Math.max(surf+30,(surf+308)/2),sc=Math.min(1.1,Math.max(.55,(308-surf)/120));$('#sl-face').setAttribute('transform',`translate(150 ${mid}) scale(${sc})`);$('#sl-face').setAttribute('opacity',1);$('#sl-mouth').setAttribute('d',mood=='ok'?'M-20 22Q0 40 20 22':'M-16 28H16')}
function slEval(){if(S.done)return;const d=S.level-S.goal;
if(Math.abs(d)<.05){S.done=true;slFace('ok');$('#sl-lg').classList.remove('slb');void $('#sl-lg').getBoundingClientRect();$('#sl-lg').classList.add('slb');ok();cf($('#g12'));gp();say('#sl-msg','¡El monstruo de slime ha cobrado vida!','good');setTimeout(slimeNew,3300)}
else if(d>0){S.done=true;S.target=3.3;splat();rp();say('#sl-msg',`¡Splat! Te pasaste ${fmtL(d)} L`,'badc');const fx=$('#sl-fx');for(let i=0;i<10;i++){const s=i%2?-1:1,c=mk(fx,150+s*(80+R(0,6)),44,`<ellipse rx="${R(5,9)}" ry="${R(8,14)}" fill="#6cd24a" stroke="#2a8a1e" stroke-width="2"/>`);c.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${s*R(5,30)}px,${R(120,260)}px)`,opacity:0}],{duration:1400,delay:i*90,easing:'ease-in'})}
const card=$('#g12');for(let i=0;i<7;i++){const b=documentRef.createElement('div'),w=R(90,190);b.style.cssText=`position:absolute;left:${R(0,70)}%;top:${R(5,75)}%;width:${w}px;height:${w*.85}px;background:radial-gradient(circle at 35% 30%,#a6ec5e,#38a82a);border-radius:${R(40,60)}% ${R(40,60)}% ${R(40,60)}% ${R(40,60)}%;opacity:.88;pointer-events:none;z-index:9`;card.appendChild(b);b.animate([{opacity:.9,transform:'scale(.2)'},{opacity:.9,transform:'scale(1)',offset:.15},{opacity:.9,offset:.7},{opacity:0}],{duration:2600}).onfinish=()=>b.remove()}
setTimeout(slimeNew,3400)}}
$('#sl-ok').onclick=()=>{if(S.done)return;if(S.level<=0){say('#sl-msg','Primero echa un poco de slime','badc');return}if(S.level<S.goal-.049){S.done=true;slFace('meh');$('#sl-sp').setAttribute('opacity',1);$('#sl-lg').animate([{transform:'translateY(0)'},{transform:'translateY(5px) scale(1,.95)'},{transform:'translateY(0)'}],{duration:700,iterations:2});say('#sl-msg','El monstruo es muy pequeño, se encoge de hombros y pide más','badc');setTimeout(()=>{S.done=false;$('#sl-face').setAttribute('opacity',0);$('#sl-sp').setAttribute('opacity',0)},2200)}else S.target=S.target};
function slLoop(t){requestAnimationFrame(slLoop);const dt=Math.min(.05,(t-S.last)/1000||0);S.last=t;if(!$('#g12').classList.contains('on'))return;
const pouring=S.level<S.target-1e-6;if(pouring){S.level=Math.min(S.target,S.level+.7*dt);if(Math.random()<.55&&S.level>.03)S.bub.push({x:R(78,222),y:304,r:R(2,5),v:R(40,90)})}else if(S.was)slEval();S.was=pouring;
S.amp+=((pouring?4:1)-S.amp)*5*dt;S.ph=(S.ph||0)+dt*5;const surf=ly(S.level);
if(S.level<=.001)$('#sl-liq').setAttribute('d','');else{let d=`M60 ${surf}`;for(let x=60;x<=240;x+=6)d+=`L${x} ${(surf+Math.sin(x*.08+S.ph)*S.amp).toFixed(1)}`;$('#sl-liq').setAttribute('d',d+'L240 330L60 330Z')}
const st=$('#sl-str');if(pouring){const w=S.pour>=1?14:S.pour>=.5?9:5;st.setAttribute('x',150-w/2);st.setAttribute('width',w);st.setAttribute('height',Math.max(0,Math.min(surf,300)-38))}else{st.setAttribute('width',0);st.setAttribute('height',0)}
S.bub.forEach(b=>b.y-=b.v*dt);S.bub=S.bub.filter(b=>b.y>surf+4);$('#sl-bub').innerHTML=S.bub.map(b=>`<circle cx="${b.x}" cy="${b.y.toFixed(1)}" r="${b.r}" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".8"/>`).join('');
$('#sl-cur').textContent=`Llevas ${fmtL(S.level)} L`}
requestAnimationFrame(slLoop);

/* ---------- 13 TEMPLO ---------- */
const DR=Math.PI/180,dirv=a=>[Math.cos(a*DR),-Math.sin(a*DR)],TM=[200,150];
let T={a:0,t:45,phi:0,E:[0,0],G:[0,0],busy:false,drag:false,lit:false,angles:null};
function temploNew(){let t,phi,psi,go=false;while(!go){t=[30,45,60,90,120,135,150][R(0,6)];phi=[0,30,45,60][R(0,3)];psi=((2*t-phi)%360+360)%360;go=Math.abs((((psi-phi-180)%360)+540)%360-180)>=30}
T.t=t;T.phi=phi;const[ex,ey]=dirv(phi),[gx,gy]=dirv(psi);T.E=[TM[0]-110*ex,TM[1]-110*ey];T.G=[TM[0]+105*gx,TM[1]+105*gy];do{T.a=5*R(0,35)}while(T.a===t);T.busy=false;T.lit=false;
$('#t-ray').innerHTML='';$('#t-fx').innerHTML='';$('#t-glow').setAttribute('opacity',0);$('#t-pass').setAttribute('opacity',0);$('#t-door').getAnimations().forEach(a=>a.cancel());
$('#t-q').textContent=`Pon el espejo a ${t}° (ángulo ${t<90?'agudo':t==90?'recto':'obtuso'}) y emite la luz`;say('#t-msg','');tDyn()}
function tDyn(){const[M0,M1]=TM;let h=`<path d="M${T.E[0]} ${T.E[1]}L${M0} ${M1}" stroke="#ffe27a" stroke-opacity=".35" stroke-width="3" stroke-dasharray="6 6"/><circle cx="${M0}" cy="${M1}" r="55" fill="#00000030" stroke="#ffd23f" stroke-opacity=".6" stroke-width="2"/>`;
for(let i=0;i<24;i++){const a=i*15,[x,y]=dirv(a),big=a%45==0;h+=`<path d="M${M0+x*55} ${M1+y*55}L${M0+x*(big?70:63)} ${M1+y*(big?70:63)}" stroke="#ffe9a8" stroke-width="${big?2.5:1.5}"/>`}
[0,45,90,135,180].forEach(a=>{const[x,y]=dirv(a);h+=`<text x="${M0+x*84}" y="${M1+y*84+4}" text-anchor="middle" font-size="12" font-weight="800" fill="#ffe9a8">${a}°</text>`});
const[hx,hy]=dirv(T.a);h+=`<circle cx="${M0+hx*55}" cy="${M1+hy*55}" r="8" fill="#ffd23f" stroke="#9a6a14" stroke-width="2.5"/><circle cx="${M0-hx*55}" cy="${M1-hy*55}" r="5" fill="#ffd23f" opacity=".5"/>`;
h+=`<g transform="translate(${M0} ${M1}) rotate(${-T.a})"><rect x="-40" y="-4" width="80" height="8" rx="4" fill="url(#mirG)" stroke="#9fb4d4" stroke-width="2"/><circle r="6" fill="#4a4a62" stroke="#2b2b45" stroke-width="2"/></g>`;
h+=`<g transform="translate(${T.E[0]} ${T.E[1]}) rotate(${-T.phi})"><rect x="-18" y="-13" width="30" height="26" rx="6" fill="#59597a" stroke="#2b2b45" stroke-width="3"/><circle cx="12" cy="0" r="7" fill="#ffd23f" stroke="#9a6a14" stroke-width="2"/></g>`;
h+=`<g transform="translate(${T.G[0]} ${T.G[1]})"><polygon points="0,-18 16,-4 0,18 -16,-4" fill="${T.lit?'#ffe27a':'#7b7a9c'}" stroke="${T.lit?'#e6a800':'#4a4a6a'}" stroke-width="3" stroke-linejoin="round"${T.lit?' style="filter:drop-shadow(0 0 10px #ffd23f)"':''}/><path d="M-16 -4H16M0 -18L-6 -4L0 18L6 -4Z" stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none"/></g>`;
$('#t-dyn').innerHTML=h;$('#t-ang').textContent=T.a+'°'}
const tsvg=$('#t-svg');
function tAim(x,y){let a=Math.atan2(-(y-TM[1]),x-TM[0])/DR;a=((a%180)+180)%180;a=Math.round(a/5)*5%180;T.a=T.angles?.length?T.angles.reduce((best,value)=>Math.abs(value-a)<Math.abs(best-a)?value:best,T.angles[0]):a;tDyn()}
tsvg.addEventListener('pointerdown',e=>{if(T.busy)return;const[x,y]=spt(tsvg,e);if(Math.hypot(x-TM[0],y-TM[1])>110)return;T.drag=true;tsvg.setPointerCapture(e.pointerId);tAim(x,y)});
tsvg.addEventListener('pointermove',e=>{if(!T.drag)return;const[x,y]=spt(tsvg,e);tAim(x,y)});
['pointerup','pointercancel'].forEach(n=>tsvg.addEventListener(n,()=>T.drag=false));
function tNudge(direction){if(T.busy)return;if(T.angles?.length){const index=T.angles.indexOf(T.a);T.a=T.angles[(index+direction+T.angles.length)%T.angles.length]}else T.a=(T.a+direction*5+180)%180;tDyn()}
$('#t-m').onclick=()=>tNudge(-1);$('#t-p').onclick=()=>tNudge(1);
const BAT=`<ellipse rx="7" ry="9" fill="#3a2a52"/><path d="M-6 -2Q-26 -14 -30 4Q-20 0 -16 8Q-10 2 -6 6Z" fill="#3a2a52"/><path d="M6 -2Q26 -14 30 4Q20 0 16 8Q10 2 6 6Z" fill="#3a2a52"/><path d="M-5 -8L-7 -16L-1 -10M5 -8L7 -16L1 -10" fill="#3a2a52"/><circle cx="-2.5" cy="-2" r="1.8" fill="#fff"/><circle cx="2.5" cy="-2" r="1.8" fill="#fff"/>`;
function wallHit(x,y,dx,dy){let t=1e9;if(dx>1e-6)t=Math.min(t,(388-x)/dx);if(dx<-1e-6)t=Math.min(t,(12-x)/dx);if(dy>1e-6)t=Math.min(t,(288-y)/dy);if(dy<-1e-6)t=Math.min(t,(12-y)/dy);return[x+t*dx,y+t*dy]}
$('#t-go').onclick=()=>{if(T.busy)return;T.busy=true;const good=T.a===T.t,psi=((2*T.a-T.phi)%360+360)%360,[dx,dy]=dirv(psi);const end=good?T.G:wallHit(TM[0],TM[1],dx,dy);
$('#t-ray').innerHTML=`<path id="t-rp" pathLength="100" d="M${T.E[0]} ${T.E[1]}L${TM[0]} ${TM[1]}L${end[0]} ${end[1]}" fill="none" stroke="#ffd23f" stroke-width="10" stroke-opacity=".35" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="100"/><path id="t-rq" pathLength="100" d="M${T.E[0]} ${T.E[1]}L${TM[0]} ${TM[1]}L${end[0]} ${end[1]}" fill="none" stroke="#fffbe0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="100"/>`;
['#t-rp','#t-rq'].forEach(s=>$(s).animate([{strokeDashoffset:100},{strokeDashoffset:0}],{duration:1000,fill:'forwards'}));tone(500,.9,'sawtooth',1500,.04);
setTimeout(()=>{if(good){T.lit=true;tDyn();$('#t-glow').animate([{opacity:0},{opacity:.5}],{duration:900,fill:'forwards'});$('#t-glow').setAttribute('opacity',.5);$('#t-pass').setAttribute('opacity',1);$('#t-door').animate([{transform:'translateY(0)'},{transform:'translateY(-78px)'}],{duration:1100,fill:'forwards',easing:'ease-in-out'});ok();cf($('#g13'));gp();say('#t-msg','¡La joya brilla y se abre la puerta!','good')}
else{const bx=Math.min(372,Math.max(28,end[0])),by=Math.min(272,Math.max(28,end[1])),b=mk($('#t-fx'),bx,by,BAT);b.animate([{transform:'scale(0)'},{transform:'scale(1)'}],{duration:250,fill:'forwards'});
const sp=mk($('#t-fx'),end[0],end[1],'<circle r="10" fill="#ffd23f"/><circle r="5" fill="#fff"/>');sp.animate([{transform:'scale(.3)',opacity:1},{transform:'scale(2.4)',opacity:0}],{duration:700});
setTimeout(()=>{b.animate([{filter:'brightness(1)'},{filter:'brightness(.15)'}],{duration:250,fill:'forwards'});bad()},300);setTimeout(()=>b.animate([{transform:'scale(1) translate(0,0) rotate(0)',opacity:1},{transform:`scale(1) translate(${-dx*260}px,${-dy*100-90}px) rotate(${dx>0?-40:40}deg)`,opacity:0}],{duration:1000,fill:'forwards',easing:'ease-in'}),700);
rp();say('#t-msg',`El rayo rebotó mal y chocó con la pared. ¡Pobre murciélago! (espejo a ${T.a}°)`,'badc')}
setTimeout(temploNew,3600)},1100)};

/* ---------- 14 TOPO PIRATA ---------- */
let TN=6,TR=6,CS=50,RS=50;
const OX=40,OY=40,LET='ABCDEFGHIJ';
let TP={c:0,r:0,busy:false};
const MOLE=`<ellipse cx="0" cy="14" rx="19" ry="15" fill="#7a5238" stroke="#3d2616" stroke-width="2.5"/><ellipse cx="0" cy="0" rx="17" ry="15" fill="#8d6646" stroke="#3d2616" stroke-width="2.5"/><ellipse cx="0" cy="6" rx="7" ry="5" fill="#ff9aa8" stroke="#a8505f" stroke-width="1.5"/><circle cx="-8" cy="-3" r="3.5" fill="#fff"/><circle cx="8" cy="-3" r="3.5" fill="#fff"/><circle cx="-8" cy="-2.5" r="1.8" fill="#222"/><circle cx="8" cy="-2.5" r="1.8" fill="#222"/><path d="M-22 -8Q0 -36 22 -8Q0 -15 -22 -8Z" fill="#26203f" stroke="#0f0b1e" stroke-width="2"/><path d="M-14 -12Q0 -20 14 -12" stroke="#ffd23f" stroke-width="3" fill="none"/><circle cx="0" cy="-19" r="3" fill="#fff"/><ellipse cx="-17" cy="18" rx="6" ry="4" fill="#ff9aa8" stroke="#a8505f" stroke-width="1.5"/><ellipse cx="17" cy="18" rx="6" ry="4" fill="#ff9aa8" stroke="#a8505f" stroke-width="1.5"/>`;
const CHEST=`<circle r="30" fill="#ffd23f" opacity=".4" class="pls"/><rect x="-19" y="-4" width="38" height="23" rx="4" fill="#a8652a" stroke="#5a3010" stroke-width="2.5"/><path d="M-19 -4Q-19 -21 0 -21Q19 -21 19 -4Z" fill="#c27a35" stroke="#5a3010" stroke-width="2.5"/><rect x="-19" y="-7" width="38" height="6" fill="#e5b43a" stroke="#9a6a14" stroke-width="1.5"/><rect x="-4.5" y="-9" width="9" height="13" rx="2" fill="#ffd23f" stroke="#9a6a14" stroke-width="1.5"/><path d="M14 -24l2 -6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#fff" class="pls"/>`;
const BOOT=`<path d="M-9 -20H5V0L17 7Q22 19 9 19H-14Q-17 19 -17 9Z" fill="#7a5a3a" stroke="#3a2412" stroke-width="2.5" stroke-linejoin="round"/><path d="M-9 -12H5" stroke="#3a2412" stroke-width="2.5"/><path d="M-17 14H12" stroke="#3a2412" stroke-width="3"/>`;
const FISH=`<path d="M-20 0H12" stroke="#ececec" stroke-width="4" stroke-linecap="round"/><path d="M-12 -10L-8 0L-12 10M-4 -11L0 0L-4 11M4 -9L7 0L4 9" stroke="#ececec" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="16" cy="0" r="7" fill="#ececec" stroke="#aaa" stroke-width="1.5"/><circle cx="18" cy="-2" r="1.8" fill="#333"/><path d="M-20 0L-28 -9V9Z" fill="#ececec" stroke="#aaa" stroke-width="1.5" stroke-linejoin="round"/>`;
const SIGN=a=>`<rect x="-3" y="-4" width="6" height="24" fill="#7a5a3a" stroke="#3a2412" stroke-width="1.5"/><g transform="translate(0 -10) rotate(${a})"><polygon points="-18,-8 6,-8 6,-14 20,0 6,14 6,8 -18,8" fill="#ffd23f" stroke="#9a6a14" stroke-width="2.5" stroke-linejoin="round"/></g>`;
function topoDraw(){const xy=$('#tp-mode').value=='xy';let h=`<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc3f0"/><stop offset="1" stop-color="#1b78c2"/></linearGradient></defs><rect width="380" height="380" rx="18" fill="url(#sea)"/><path d="M0 40Q20 30 40 40T80 40T120 40T160 40T200 40T240 40T280 40T320 40T360 40" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/><path d="M0 352Q20 342 40 352T80 352T120 352T160 352T200 352T240 352T280 352T320 352T360 352" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/><rect x="${OX-8}" y="${OY-8}" width="${CS*TN+16}" height="${RS*TR+16}" rx="22" fill="#e9cf8f" stroke="#b8923f" stroke-width="4"/>`;
for(let r=0;r<TR;r++)for(let c=0;c<TN;c++)h+=`<rect class="tc" data-c="${c}" data-r="${r}" x="${OX+c*CS+1.5}" y="${OY+r*RS+1.5}" width="${CS-3}" height="${RS-3}" rx="7" fill="${(r+c)%2?'#f4e2ac':'#efd89b'}" stroke="#c9a65a" stroke-width="2"/>`;
for(let c=0;c<TN;c++)h+=`<text x="${OX+c*CS+CS/2}" y="30" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" stroke="#0a4a7a" stroke-width=".6">${c+1}</text>`;
for(let r=0;r<TR;r++)h+=`<text x="22" y="${OY+r*RS+RS/2+6}" text-anchor="middle" font-size="18" font-weight="800" fill="#fff" stroke="#0a4a7a" stroke-width=".6">${xy?TR-r:LET[r]}</text>`;
h+=`<g transform="translate(350 352) scale(.9)"><path d="M0 12V-8" stroke="#7a5a3a" stroke-width="5" stroke-linecap="round"/><path d="M0 -8Q-18 -10 -22 2M0 -8Q-14 -20 -26 -12M0 -8Q16 -12 22 0M0 -8Q12 -20 24 -14" stroke="#2f9a3c" stroke-width="5" fill="none" stroke-linecap="round"/></g><g id="tp-fx"></g>`;
$('#tp-svg').innerHTML=h}
function topoNew(){topoDraw();TP.busy=false;TP.c=R(0,TN-1);TP.r=R(0,TR-1);const xy=$('#tp-mode').value=='xy';$('#tp-q').textContent=xy?`El tesoro está en el punto (${TP.c+1}, ${TR-TP.r}). Primero x (columna), luego y (fila contando desde abajo)`:`El tesoro está en la columna ${TP.c+1}, fila ${LET[TP.r]}`;say('#tp-msg','Toca la casilla exacta')}
$('#tp-mode').onchange=topoNew;
$('#tp-svg').addEventListener('click',e=>{const el=e.target.closest('.tc');if(!el||TP.busy)return;TP.busy=true;const c=+el.dataset.c,r=+el.dataset.r,cx=OX+c*CS+CS/2,cy=OY+r*RS+RS/2,good=c===TP.c&&r===TP.r,fx=$('#tp-fx');
const m=mk(fx,cx,cy,MOLE);m.animate([{transform:'translateY(26px) scale(.2)'},{transform:'translateY(0) scale(1)'}],{duration:350,fill:'forwards',easing:'ease-out'});tone(150,.5,'sawtooth',90,.06);
for(let i=0;i<9;i++){const d=mk(fx,cx,cy+8,`<circle r="${R(2,4)}" fill="#7a5238"/>`);d.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${R(-34,34)}px,${-R(20,50)}px)`,opacity:0}],{duration:700,delay:100+i*30}).onfinish=()=>d.parentNode.remove()}
setTimeout(()=>{fx.innerHTML='';const ang=Math.atan2((TP.r-r),(TP.c-c))/DR;let item=good?CHEST:[BOOT,FISH,SIGN(ang)][R(0,2)];const it=mk(fx,cx,cy,item);it.animate([{transform:'scale(.2)'},{transform:'scale(1.25)',offset:.7},{transform:'scale(1)'}],{duration:450,fill:'forwards'});
if(good){ok();gp();cf($('#g14'));say('#tp-msg','¡Tesoro encontrado!','good')}
else{bad();rp();mk(fx,cx,cy,`<g transform="rotate(${ang})"><path d="M26 0H64M54 -9L66 0L54 9" stroke="#e5484d" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" class="pls"/></g>`);setTimeout(()=>{mk(fx,OX+TP.c*CS+CS/2,OY+TP.r*RS+RS/2,`<rect x="${-CS/2+2}" y="${-RS/2+2}" width="${CS-4}" height="${RS-4}" rx="8" fill="none" stroke="#ffd23f" stroke-width="4" stroke-dasharray="7 5" class="pls"/>`)},900);say('#tp-msg','Casi. Mira la flecha: el tesoro estaba hacia allí','badc')}
setTimeout(topoNew,3600)},850)});

initUI();heading.textContent=config.titulo||'';root.querySelector('#tabs')?.remove();[pNew,bNew,rNew,mNew,fNew,eNew,ninjaNew,robNew,slimeNew,temploNew,topoNew].forEach(f=>{try{f()}catch(e){console.error(e)}});
const soundButton=$('#mute');
const updateSoundButton=()=>{snd=window.pjSonido?!window.pjSonido.isMuted():snd;soundButton.setAttribute('aria-pressed',String(snd));soundButton.title=snd?'Sonido activado':'Sonido silenciado';soundButton.innerHTML=SPK(snd)+' Sonido '+(snd?'activado':'silenciado')};
soundButton.onclick=()=>{snd=window.pjSonido?window.pjSonido.isMuted():!snd;if(window.pjSonido)window.pjSonido.setMuted(!snd);updateSoundButton()};
updateSoundButton();
const settingIds=['p-lvl','p-art','a-t','r-rule','r-min','m-max','m-cnt','e-m','tp-mode'];
settingIds.forEach(id=>{const control=$('#'+id),label=control?.closest('label');if(label)label.hidden=true});
['p-new','r-new'].forEach(id=>{const control=$('#'+id);if(control)control.hidden=true});
$('#e-m').closest('.row')?.querySelector('.mut')?.remove();
root.querySelectorAll('.row').forEach(row=>{const labels=[...row.querySelectorAll('label')];if(labels.length&&labels.every(label=>label.hidden)&&!row.querySelector('button:not([hidden])'))row.hidden=true});

  const data = config.datos;
  let arcadeGoal = 5;
  const number = (value, name, min = -Infinity, max = Infinity) => {
    const result = Number(value);
    if (!Number.isFinite(result) || result < min || result > max) {
      throw new Error(`"${name}" debe ser un número entre ${min} y ${max}`);
    }
    return result;
  };
  const operation = value => ({
    '+': '+', suma: '+', sum: '+',
    '-': '−', '−': '−', resta: '−', sub: '−',
    '*': '×', '×': '×', multiplicacion: '×', multiplicación: '×', mul: '×',
    '/': '÷', '÷': '÷', division: '÷', división: '÷'
  })[String(value || '+').toLowerCase()];
  const resultOf = (a, op, b) => op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;

    $('#tabs').hidden = true;
    root.querySelectorAll('.game').forEach(section => section.classList.toggle('on', section.id === gameSection));

    switch (config.tipo) {
      case 'mates_pixel': {
        if (data.dificultad != null && !['facil','fácil','media','medio','dificil','difícil'].includes(String(data.dificultad).toLowerCase())) throw new Error('"dificultad" debe ser "facil", "media" o "dificil"');
        if (data.maximoNumero != null) {
          const maximum = number(data.maximoNumero, 'maximoNumero', 2, 1000);
          if (!Number.isInteger(maximum)) throw new Error('"maximoNumero" debe ser un número entero');
        }
        if (data.tiposOperacion != null) {
          if (!Array.isArray(data.tiposOperacion) || !data.tiposOperacion.length) throw new Error('"tiposOperacion" debe ser una lista de operadores');
          data.tiposOperacion.forEach(value => { if (!operation(value)) throw new Error(`operador no reconocido: ${value}`); });
        }
        if (data.dibujo) {
          if (!Object.hasOwn(ART, data.dibujo)) throw new Error('"dibujo" debe ser "cohete" o "dino"');
          $('#p-art').value = data.dibujo;
        }
        pNew();
        if (Array.isArray(data.operaciones) && data.operaciones.length) {
          const operations = data.operaciones.map(item => {
            const a = number(item.a, 'operaciones.a');
            const b = number(item.b, 'operaciones.b');
            const op = operation(item.op);
            if (!op) throw new Error(`operador no reconocido: ${item.op}`);
            const answer = item.respuesta == null ? resultOf(a, op, b) : number(item.respuesta, 'operaciones.respuesta');
            return { text: item.pregunta || `${a} ${op} ${b}`, answer };
          });
          P.cells.forEach((cell, index) => {
            const item = operations[index % operations.length];
            cell.t = item.text;
            cell.a = item.answer;
          });
          root.querySelectorAll('#grid .cell').forEach((cell, index) => { cell.textContent = P.cells[index].t; });
          pSel(0);
        }
        break;
      }
      case 'mates_balanza': {
        bNew();
        if (Array.isArray(data.pesosIzquierda) && data.pesosIzquierda.length) {
          B.t = 0;
          B.lvl = 1;
          B.green = false;
          B.lock = false;
          B.L = data.pesosIzquierda.map(value => number(value, 'pesosIzquierda', 1, 999));
          B.T = sum(B.L);
          const options = Array.isArray(data.opciones) ? data.opciones.map(value => number(value, 'opciones', 1, 999)) : [];
          B.tray = sh([...new Set([...options, B.T])].map(v => ({ v, u: false })));
          B.put = [];
          $('#blvl').textContent = '1';
          $('#bgoal').textContent = 'Equilibra la balanza';
          $('#bhelp').textContent = 'Toca las pesas para ponerlas a la derecha; toca una puesta para quitarla.';
          bTray();
          drawB(B.L, [], B.T);
        }
        break;
      }
      case 'mates_arcade': {
        if (data.tipoReto != null) {
          if (!['mix', 'half', 'add', 'mul'].includes(data.tipoReto)) throw new Error('"tipoReto" debe ser "mix", "half", "add" o "mul"');
          $('#a-t').value = data.tipoReto;
        }
        if (data.vidas != null) number(data.vidas, 'vidas', 1, 10);
        if (Array.isArray(data.preguntas) && data.preguntas.length) {
          data.preguntas = data.preguntas.map((item, index) => {
            if (!item || typeof item !== 'object') throw new Error(`preguntas[${index}] debe ser un objeto`);
            const text = item.pregunta || item.enunciado;
            let answer;
            if (text) answer = number(item.correcta ?? item.respuesta, `preguntas[${index}].correcta`);
            else {
              const op = operation(item.op);
              if (!op) throw new Error(`operador no reconocido en preguntas[${index}]`);
              const a = number(item.a, `preguntas[${index}].a`);
              const b = number(item.b, `preguntas[${index}].b`);
              answer = number(item.correcta ?? item.respuesta ?? resultOf(a, op, b), `preguntas[${index}].correcta`);
            }
            const options = Array.isArray(item.opciones) ? item.opciones.map((value, optionIndex) => number(value, `preguntas[${index}].opciones[${optionIndex}]`)) : [];
            return { ...item, pregunta: text || `${item.a} ${operation(item.op)} ${item.b}`, correcta: answer, opciones: options };
          });
        }
        arcadeGoal = data.objetivoAciertos == null ? data.preguntas?.length || 5 : number(data.objetivoAciertos, 'objetivoAciertos', 1, 100);
        $('#a-go').hidden = true;
        startA();
        break;
      }
      case 'mates_rio': {
        const start = data.inicio == null ? 0 : number(data.inicio, 'inicio');
        const step = data.salto == null ? 5 : data.salto;
        const hops = data.saltos == null ? 8 : number(data.saltos, 'saltos', 1, 50);
        if (step !== 'even') number(step, 'salto', 1, 100);
        $('#r-rule').value = step === 'even' ? 'even' : ['2', '3', '5', '10'].includes(String(step)) ? String(step) : 'mix';
        $('#r-min').value = hops;
        rNew();
        Rv.ev = step === 'even';
        Rv.s = Number(step) || 0;
        Rv.seq = Rv.ev ? [] : [start];
        Rv.n = 0;
        Rv.min = hops;
        $('#rrule').textContent = Rv.ev ? 'Salta solo por las piedras con número par' : `Salta sumando de ${Rv.s} en ${Rv.s}.`;
        rDraw(true);
        rChoices();
        break;
      }
      case 'mates_monstruo': {
        if (data.maximo != null) $('#m-max').value = String(number(data.maximo, 'maximo', 1, 999));
        if (data.contador != null) {
          if (typeof data.contador !== 'boolean') throw new Error('"contador" debe ser true o false');
          $('#m-cnt').checked = data.contador;
        }
        mNew();
        if (data.objetivo != null) {
          M.t = number(data.objetivo, 'objetivo', 1, 999);
          M.c = 0;
          M.lock = false;
          $('#m-t').textContent = M.t;
          mBar();
          mCnt();
        }
        break;
      }
      case 'mates_fracciones': {
        fNew();
        if (data.numerador != null || data.denominador != null) {
          const numerator = number(data.numerador, 'numerador', 1, 32);
          const denominator = number(data.denominador, 'denominador', 1, 32);
          const target = numerator * 8 / denominator;
          if (!Number.isInteger(target)) throw new Error('la fracción objetivo debe poder representarse en octavos');
          if (Array.isArray(data.piezas) && data.piezas.length) {
            if (data.piezas.length > NT.length) throw new Error('se permiten como máximo cuatro tipos de pieza');
            const colors = ['#ff6b6b', '#ffa42e', '#34b8a0', '#6c7bff'];
            FR.splice(0, FR.length, ...data.piezas.map((piece, index) => {
              const n = number(piece.n, `piezas[${index}].n`, 1, 32);
              const d = number(piece.d, `piezas[${index}].d`, 1, 32);
              const eighths = n * 8 / d;
              if (!Number.isInteger(eighths)) throw new Error(`piezas[${index}] no puede representarse en octavos`);
              return [`${n}/${d}`, eighths, colors[index]];
            }));
          }
          F.T = target;
          $('#f-t').textContent = `${numerator}/${denominator}`;
          F.n = [];
          $('#f-btns').innerHTML = FR.map((piece, index) => `<button class="fn" style="background:${piece[2]}" data-i="${index}">${NT[index]('#fff')}${piece[0]}</button>`).join('');
          fDraw();
          say('#f-msg', '');
        }
        break;
      }
      case 'mates_estimacion': {
        const maximum = data.maximo == null ? 100 : number(data.maximo, 'maximo', 10, 1000);
        const selectValue = maximum <= 10 ? '10' : maximum <= 100 ? '100' : '1000';
        $('#e-m').value = selectValue;
        eNew();
        E.max = maximum;
        E.t = data.objetivo == null ? E.t : number(data.objetivo, 'objetivo', 0, maximum);
        E.margin = data.margen == null ? null : number(data.margen, 'margen', 0.01, maximum);
        $('#e-m').value = selectValue;
        $('#e-sl').max = maximum;
        $('#e-sl').value = Math.round(maximum / 2);
        $('#e-q').textContent = `Coloca el número ${E.t} en la línea`;
        $('#e-vis').innerHTML = `<div class="nl"><div class="ruler"></div><div class="ticks"></div><div class="pin" id="pg" style="left:50%">${MPIN}</div><span class="lbl" style="left:0">0</span><span class="lbl" style="right:0">${E.max}</span></div>`;
        root.querySelector('#g9 .row .mut').textContent = E.margin == null ? 'Margen: ±5%' : `Margen: ±${E.margin}`;
        eVal();
        break;
      }
      case 'mates_ninja': {
        ninjaNew();
        if (data.numerador != null || data.denominador != null) {
          N.t = [number(data.numerador, 'numerador', 1, 32), number(data.denominador, 'denominador', 1, 32)];
          N.margin = data.margenPorcentaje == null ? 5 : number(data.margenPorcentaje, 'margenPorcentaje', 0.1, 50);
          const shape = data.figura && Object.hasOwn(NSH, data.figura) ? data.figura : N.k;
          N.k = shape;
          N.poly = NSH[shape].poly();
          $('#n-obj').innerHTML = piece(N.k, N.poly, 'npw');
          $('#n-q').innerHTML = `Corta un trozo que sea ${fr(N.t[0], N.t[1])} de ${NSH[N.k].name}`;
        }
        break;
      }
      case 'mates_robots': {
        robNew();
        if (data.entrada != null || data.salida != null) {
          const input = number(data.entrada, 'entrada', 0, 999);
          const output = number(data.salida, 'salida', 0, 9999);
          const chips = Array.isArray(data.chips) ? data.chips.slice(0, 4).map((chip, index) => {
            const n = number(chip.n, `chips[${index}].n`, 0, 9999);
            const op = operation(chip.op);
            if (!op) throw new Error(`operador no reconocido en chips[${index}]`);
            return { lab: String(chip.label || `${op}${n}`).replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]), f: value => resultOf(value, op, n) };
          }) : [];
          if (!chips.some(chip => chip.f(input) === output)) {
            let solution;
            if (output > input) solution = { lab: `+${output - input}`, f: value => value + output - input };
            else if (output < input) solution = { lab: `−${input - output}`, f: value => value - (input - output) };
            else solution = { lab: '+0', f: value => value };
            if (output % input === 0 && input !== 0) solution = { lab: `×${output / input}`, f: value => value * (output / input) };
            if (!solution) throw new Error('no se puede construir un chip que transforme la entrada en la salida');
            chips.push(solution);
          }
          let distractor = 1;
          const results = new Set(chips.map(chip => chip.f(input)));
          while (chips.length < 3) {
            const value = input + distractor;
            if (!results.has(value)) {
              chips.push({ lab: `+${distractor}`, f: x => x + distractor });
              results.add(value);
            }
            distractor++;
          }
          Rb.x = input;
          Rb.out = output;
          Rb.chips = sh(chips.slice(0, 5));
          Rb.si = -1;
          Rb.busy = false;
          Rb.n = 0;
          Rb.goal = 5;
          $('#rb-int').textContent = input;
          $('#rb-gt').textContent = output;
          $('#rb-res').innerHTML = '';
          $('#rb-sm').innerHTML = '';
          $('#rb-fx').innerHTML = '';
          say('#rb-msg', `¿Qué chip hace que el ${input} salga como ${output}?`);
          robSlot();
          rbRow();
        }
        break;
      }
      case 'mates_slime': {
        slimeNew();
        if (data.objetivoLitros != null) {
          S.goal = number(data.objetivoLitros, 'objetivoLitros', 0.1, 3);
          $('#sl-goal').textContent = fmtL(S.goal) + ' L';
          $('#sl-gl').setAttribute('y1', ly(S.goal));
          $('#sl-gl').setAttribute('y2', ly(S.goal));
          $('#sl-gt').setAttribute('y', ly(S.goal) + 4);
        }
        break;
      }
      case 'mates_templo': {
        temploNew();
        if (Array.isArray(data.angulos) && data.angulos.length) {
          T.angles = [...new Set(data.angulos.map((angle, index) => {
            const value = number(angle, `angulos[${index}]`, 0, 175);
            if (value % 5 !== 0) throw new Error(`angulos[${index}] debe ser múltiplo de cinco`);
            return value;
          }))].sort((a, b) => a - b);
        }
        if (data.anguloObjetivo != null) {
          const target = number(data.anguloObjetivo, 'anguloObjetivo', 0, 175);
          if (target % 5 !== 0) throw new Error('"anguloObjetivo" debe ser múltiplo de cinco');
          if (T.angles?.length && !T.angles.includes(target)) throw new Error('"angulos" debe incluir "anguloObjetivo"');
          T.t = target;
          T.phi = 0;
          T.a = T.angles?.[0] ?? 0;
          const [ex, ey] = dirv(T.phi);
          const [gx, gy] = dirv(2 * target);
          T.E = [TM[0] - 110 * ex, TM[1] - 110 * ey];
          T.G = [TM[0] + 105 * gx, TM[1] + 105 * gy];
          $('#t-q').textContent = `Pon el espejo a ${target}° (ángulo ${target < 90 ? 'agudo' : target === 90 ? 'recto' : 'obtuso'}) y emite la luz`;
          tDyn();
        }
        break;
      }
      case 'mates_topo': {
        const mode = data.modo == null ? 'xy' : data.modo;
        if (!['xy', 'cf'].includes(mode)) throw new Error('"modo" debe ser "xy" o "cf"');
        TN = data.columnas == null ? 6 : number(data.columnas, 'columnas', 1, 10);
        TR = data.filas == null ? 6 : number(data.filas, 'filas', 1, 10);
        CS = 300 / TN;
        RS = 300 / TR;
        $('#tp-mode').value = mode;
        topoNew();
        if (data.columna != null || data.fila != null) {
          TP.c = data.columna == null ? R(1, TN) - 1 : number(data.columna, 'columna', 1, TN) - 1;
          TP.r = data.fila == null ? R(1, TR) - 1 : TR - number(data.fila, 'fila', 1, TR);
          $('#tp-q').textContent = `El tesoro está en el punto (${TP.c + 1}, ${TR - TP.r}). Primero x (columna), luego y (fila contando desde abajo)`;
        }
        break;
      }
    }

    let completed = false;
    let completionStartedAt = 0;
    const completion = {
      mates_pixel: () => P.done >= 64,
      mates_balanza: () => B.green,
      mates_arcade: () => A.sc >= arcadeGoal,
      mates_rio: () => Rv.reached,
      mates_monstruo: () => M.lock && M.c === M.t,
      mates_fracciones: () => F.l > 0,
      mates_estimacion: () => E.lock && $('#e-msg').classList.contains('good'),
      mates_ninja: () => $('#n-msg').classList.contains('good'),
      mates_robots: () => Rb.n >= Rb.goal,
      mates_slime: () => S.done && Math.abs(S.level - S.goal) < 0.05,
      mates_templo: () => T.lit,
      mates_topo: () => $('#tp-msg').classList.contains('good')
    }[config.tipo];
    const checkCompletion = () => {
      if (completed) return;
      if (!completionStartedAt && completion()) completionStartedAt = Date.now();
      if (completionStartedAt && Date.now() - completionStartedAt >= 1100) {
        completed = true;
        stopArcade();
        onComplete();
        return;
      }
      requestAnimationFrame(checkCompletion);
    };
    requestAnimationFrame(checkCompletion);

    return cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}

class MatesAventuraMotorGame extends HTMLElement {
  connectedCallback() {
    if (this._cleanup) return;
    const root = this.attachShadow({ mode: 'open' });
    try {
      const config = JSON.parse(this.getAttribute('data-config'));
      this._cleanup = inicializarJuegoMates(root, config, () => this.dispatchEvent(new CustomEvent('pj-mates-complete', {
        bubbles: true,
        composed: true,
        detail: { activityType: config.tipo }
      })));
    } catch (error) {
      console.error('No se pudo iniciar Mates Aventura en el motor:', error);
      root.innerHTML = '<style>:host{display:block;padding:20px;color:#7b1d2a;font:700 16px/1.5 system-ui}</style><p role="alert"></p>';
      const prefix = window.MATES_AVENTURA?.translate
        ? window.MATES_AVENTURA.translate('No se pudo configurar esta actividad')
        : 'No se pudo configurar esta actividad';
      root.querySelector('[role="alert"]').textContent = `${prefix}: ${error.message}`;
    }
  }

  disconnectedCallback() {
    this._cleanup?.();
    this._cleanup = null;
  }
}

customElements.define('pj-mates-aventura', MatesAventuraMotorGame);
