const axios = require("axios");
const cheerio = require("cheerio");

const SITEMAP_URL = "https://www.edzy.ai/sitemap.xml";

const fetchSitemapUrls = async () => {
  const { data } = await axios.get(SITEMAP_URL);
  const $ = cheerio.load(data, { xmlMode: true });

  const urls = [];
  $("loc").each((_, el) => {
    urls.push($(el).text().trim());
  });

  return urls;
};

module.exports = fetchSitemapUrls;
