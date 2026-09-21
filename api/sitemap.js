const API_BASE = 'https://rsp.laplaceta.org/api/junior';
const SITE = 'https://junior.laplaceta.org';

function slugify(value) {
  return String(value || 'actividad')
    .toLocaleLowerCase('es')
    .replace(/ñ/g, '__enie__')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/__enie__/g, 'ñ')
    .replace(/[^a-z0-9ñ]+/g, '-')
    .replace(/^-|-$/g, '') || 'actividad';
}

function actividadUrl(activity) {
  return `${SITE}/actividades/${slugify(activity.titulo)}--${encodeURIComponent(activity.id)}`;
}

function xml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));
}
function lastmod(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

module.exports = async function sitemap(request, response) {
  try {
    const result = await fetch(`${API_BASE}/actividades?solo_publicas=1`, { headers: { Accept: 'application/json' } });
    if (!result.ok) throw new Error(`Catalog HTTP ${result.status}`);
    const data = await result.json();
    const activities = Array.isArray(data.actividades) ? data.actividades : [];
    const categories = [...new Map(activities.filter((activity) => activity.categoria).map((activity) => [slugify(activity.categoria), activity.categoria])).entries()];
    const urls = [
      { loc: `${SITE}/`, priority: '1.0' },
      { loc: `${SITE}/info`, priority: '0.7' },
      { loc: `${SITE}/categorias`, priority: '0.8' },
      ...categories.map(([slug]) => ({ loc: `${SITE}/categorias/${slug}`, priority: '0.7' })),
      ...activities.map((activity) => ({
        loc: actividadUrl(activity),
        lastmod: lastmod(activity.updated_at || activity.updatedAt || activity.fecha_publicacion || activity.fechaPublicacion || activity.created_at || activity.createdAt),
        priority: '0.8'
      }))
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${xml(url.loc)}</loc>${url.lastmod ? `<lastmod>${xml(new Date(url.lastmod).toISOString())}</lastmod>` : ''}<changefreq>${url.loc.includes('/actividades/') ? 'weekly' : 'monthly'}</changefreq><priority>${url.priority}</priority></url>`).join('')}</urlset>`;
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    response.end(body);
  } catch (error) {
    response.statusCode = 503;
    response.setHeader('Content-Type', 'application/xml; charset=utf-8');
    response.end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};