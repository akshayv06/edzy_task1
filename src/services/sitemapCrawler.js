const axios = require("axios");
const cheerio = require("cheerio");

const SITEMAP_URL = "https://www.edzy.ai/sitemap.xml";

/**
 * Fetch and parse sitemap.xml
 * @returns {Promise<string[]>} List of valid URLs
 */
const fetchSitemapUrls = async () => {
  try {
    const response = await axios.get(SITEMAP_URL, {
      timeout: 10000
    });

    const $ = cheerio.load(response.data, { xmlMode: true });
    const urls = [];

    $("loc").each((_, el) => {
      const url = $(el).text().trim();

      // ✅ Validate URL before pushing
      if (isValidUrl(url)) {
        urls.push(url);
      }
    });

    console.log(` Sitemap loaded: ${urls.length} URLs found`);
    return urls;

  } catch (error) {
    console.error(" Failed to fetch sitemap:", error.message);
    throw new Error("Unable to fetch sitemap URLs");
  }
};

/**
 * URL validation helper
 */
const isValidUrl = (url) => {
  return (
    typeof url === "string" &&
    url.length > 0 &&
    url.startsWith("http")
  );
};

module.exports = fetchSitemapUrls;
