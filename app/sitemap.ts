export default async function sitemap() {
  const routes = ['', '/work', '/bot'].map((route) => ({
    url: `https://nikhilsnayak.dev${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return routes;
}
