const express = require("express");
const router = express.Router();
const linkController = require("../controllers/linkController");

router.post("/crawl-sitemap", linkController.crawlSitemap);
router.post("/incoming", linkController.getIncomingLinks);
router.post("/outgoing", linkController.getOutgoingLinks);
router.post("/top-linked", linkController.getTopLinkedPages);

module.exports = router;
