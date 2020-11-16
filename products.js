require("dotenv").config();
const fetch = require("node-fetch");

exports.products = ({
  currency = "EUR",
  country = "DE",
  access_token = "EXDL1m0liWKPH-NOaCTPwzJbXgV48hXv",
}) =>
  fetch(
    `https://${process.env.API_URL}/` +
      `${process.env.PROJECT_KEY}/` +
      `product-projections/search` +
      `?sort=lastModifiedAt+desc` +
      // `&priceCurrency=${currency}` +
      // `&priceCountry=${country}` +
      // "&filter.query=variants.scopedPrice.value.centAmount%3A+range+%280+to+*%29" +
      `&limit=2` +
      `&offset=0`,
    {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7,de;q=0.6",
        authorization: `Bearer ${access_token}`,
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors",
    }
  )
    .then((r) => r.json())
    .then((resolve) => resolve.results);

exports.products({});
