require("dotenv").config();
const fetch = require("node-fetch");

exports.userProfile = (
  access_token = "EXDL1m0liWKPH-NOaCTPwzJbXgV48hXv"
) => {
  //this results in 404
  return fetch(
    `https://${process.env.API_URL}/` +
      `${process.env.PROJECT_KEY}/me`,
    {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7,de;q=0.6",
        authorization: `Bearer ${access_token}`,
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
      referrerPolicy: "no-referrer-when-downgrade",
      method: "GET",
      mode: "cors",
    }
  ).then((r) => r.json());
};
