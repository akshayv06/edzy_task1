const axios = require("axios");
const cheerio = require("cheerio");
const Page = require("../models/Pages");

const DOMAIN = "edzy.ai";
const BATCH_SIZE = 5;
const DELAY_MS = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Crawl a single page
 */
const crawlSinglePage = async (url) => {
  try {
    const { data: html } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(html);

    const linkSet = new Set();

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (!href || !href.startsWith("http")) return;
      linkSet.add(href);
    });

    const outgoingLinks = [...linkSet].map(link => {
      const hostname = new URL(link).hostname;
      return {
        url: link,
        type: hostname.includes(DOMAIN) ? "internal" : "external"
      };
    });

    // Save current page
    await Page.updateOne(
      { url },
      {
        $set: {
          url,
          html,
          outgoingLinks,
          crawledAt: new Date()
        },
        $setOnInsert: {
          incomingLinks: []
        }
      },
      { upsert: true }
    );

    // Update incoming links
    for (const link of outgoingLinks) {
      if (link.type === "internal") {
        await Page.updateOne(
          { url: link.url },
          { $addToSet: { incomingLinks: url } },
          { upsert: true }
        );
      }
    }

    return { url, status: "success", links: outgoingLinks.length };

  } catch (error) {
    console.error(`❌ Failed to crawl ${url}`);
    return { url, status: "failed", error: error.message };
  }
};

/**
 * Crawl URLs in batches
 */
const crawlInBatches = async (urls) => {
  const results = [];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(` Crawling batch ${i / BATCH_SIZE + 1}`);

    const batchResults = await Promise.all(
      batch.map(crawlSinglePage)
    );

    results.push(...batchResults);
    await sleep(DELAY_MS);
  }

  return results;
};

module.exports = { crawlInBatches };
