require("dotenv").config();

const express = require("express");
const aws = require("aws4");
const app = express();

app.use(express.json());

app.post("/sign", (req, res) => {
  // ✅ ① Make.com から受け取った内容を表示
  console.log("📥 リクエストボディ:", JSON.stringify(req.body, null, 2));

  const { params, partnerTag, Marketplace, PartnerType } = req.body;

  const opts = {
    host: "webservices.amazon.co.jp",
    path: "/paapi5/searchitems",
    service: "ProductAdvertisingAPI",
    method: "POST",
    body: JSON.stringify({
      Keywords: params.Keywords,
      SearchIndex: params.SearchIndex,
      Resources: params.Resources,
      PartnerTag: partnerTag,
      PartnerType: PartnerType,
      Marketplace: Marketplace
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Amz-Target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems"
    }
  };

  // ✅ ② Amazon署名前の状態を表示
  console.log("🛠 リクエスト構築前のopts:", opts);

  aws.sign(opts, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  // ✅ ③ 署名後のヘッダーを確認
  console.log("🔐 署名後ヘッダー:", opts.headers);

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