const axios = require("axios");
const cheerio = require("cheerio");
const Page = require("../models/Pages");

const crawlPage = async (url, domain) => {
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);
  const links = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || !href.startsWith("http")) return;

    const type = href.includes(domain) ? "internal" : "external";
    links.push({ url: href, type });
  });

  return { html, links };
};

module.exports = crawlPage;
