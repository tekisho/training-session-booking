var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
	res.render("index", { title: "TSB" });
});

/* GET about us page. */
router.get("/about-us", (req, res, next) => {
	res.render("pages/about-us.ejs", { title: "TSB: About Us" });
});

/* GET help page. */
router.get("/support", (req, res, next) => {
	res.render("pages/support", { title: "TSB: Support" });
});

module.exports = router;
