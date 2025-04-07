// index.js
const express = require("express");
const aws = require("aws4");
const app = express();

app.use(express.json());

app.post("/sign", (req, res) => {
  const { params, accessKey, secretKey, partnerTag } = req.body;

  const opts = {
    host: "webservices.amazon.co.jp",
    path: "/paapi5/searchitems",
    service: "ProductAdvertisingAPI",
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"
    }
  };

  require('dotenv').config(); // .env 読み込み

  aws.sign(opts, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  

  res.json({
    headers: opts.headers,
    host: opts.host,
    path: opts.path,
    body: opts.body
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Signature server is running!");
});
