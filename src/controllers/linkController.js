const Page = require("../models/Pages");
const fetchSitemapUrls = require("../services/sitemapCrawler");
const { crawlInBatches } = require("../services/batchServices");


/**
 * POST: Crawl sitemap and store pages
 * Input: none (Edzy sitemap is fixed)
 */
exports.crawlSitemap = async (req, res) => {
  try {
    const urls = await fetchSitemapUrls();

    await crawlInBatches(urls);

    res.json({
      message: "Sitemap crawled successfully",
      totalPages: urls.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST: Get all pages linking INTO a page
 * Input: { url }
 */
exports.getIncomingLinks = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "url is required" });
    }

    const page = await Page.findOne({ url }, { incomingLinks: 1 });

    res.json({
      url,
      incomingLinks: page?.incomingLinks || []
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST: Get all pages a page links OUT TO
 * Input: { url }
 */
exports.getOutgoingLinks = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "url is required" });
    }

    const page = await Page.findOne(
      { url },
      { outgoingLinks: 1 }
    );

    res.json({
      url,
      outgoingLinks: page?.outgoingLinks || []
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST: Get top N most linked pages
 * Input: { n }
 */
exports.getTopLinkedPages = async (req, res) => {
  try {
    const { n } = req.body;

    if (!n || n <= 0) {
      return res.status(400).json({ message: "valid n is required" });
    }

    const pages = await Page.aggregate([
      {
        $project: {
          url: 1,
          incomingCount: {
            $size: { $ifNull: ["$incomingLinks", []] }
          }
        }
      },
      { $sort: { incomingCount: -1 } },
      { $limit: n }
    ]);

    res.json(pages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
