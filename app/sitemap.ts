export default async function sitemap() {
  const routes = ["", "/blogs", "/work"].map((route) => ({
    url: `https://nikhilsnayak3473.vercel.app${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return routes;
}
