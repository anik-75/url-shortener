require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const bodyParser = require("body-parser");
const shortId = require("short-unique-id");
const DB = require("./config/mongoose");
const Shorturl = require("./model/urlSchema");
const validUrl = require("valid-url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async function (req, res) {
  let originalUrl = req.body.url;
  try {
    if (!validUrl.isWebUri(originalUrl)) {
      res.json({
        error: "invalid url",
      });
      return;
    }

    let url = await Shorturl.findOne({ original_url: originalUrl });
    if (url) {
      res.json({
        original_url: url.original_url,
        short_url: url.short_url,
      });
      return;
    } else {
      let uid = new shortId({ length: 5 });
      let short_url = uid();
      let url = new Shorturl({
        original_url: originalUrl,
        short_url,
      });
      await url.save();
      res.json({
        original_url: originalUrl,
        short_url,
      });
      return;
    }
  } catch (err) {
    res.json({
      err,
    });
  }
});

// @route     /api/shorturl/:short
app.get("/api/shorturl/:short", async function (req, res) {
  let shortId = req.params.short;
  try {
    let url = await Shorturl.findOne({ short_url: shortId });
    if (url) {
      res.redirect(url.original_url);
      return;
    } else {
      res.json({
        error: "URL not found",
      });
    }
  } catch (err) {
    res.json({
      err,
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
