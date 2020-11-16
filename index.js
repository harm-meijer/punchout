require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParse = require("body-parser");
const xmlparser = require("express-xml-bodyparser");
const lib = require("./lib");
const o2x = require("object-to-xml");
const { EXIT } = require("./const");

router.use(xmlparser());

router.use(bodyParse.json());
router.use(bodyParse.urlencoded({ extended: true }));

const response = (res, object) => {
  res.write(JSON.stringify(object, null, 2));
  res.end();
};
router.post("/catalog", (req, res) => {
  lib
    .compose([
      lib.withParsedRequest,
      lib.withUserProfile,
      lib.withProducsts,
      ({ products }) =>
        products.map((product) => ({
          IndexItem: {
            IndexItemPunchout: {
              ItemID: {
                SupplierPartID: product.id,
              },
              PunchoutDetail: {
                "@": {
                  punchoutLevel: "product",
                },
                Description: Object.entries(
                  product.name
                ).map(([key, value]) => ({
                  "@": {
                    "xml:lang": key,
                  },
                  "#": value,
                })),
                URL: `${process.env.URL}product/${product.id}`,
                Classification: {
                  "@": {
                    domain: "some domain",
                  },
                  "#": "cassificationvalue",
                },
              },
            },
          },
        })),
    ])({
      body: req.body.catalog,
    })
    .then((result) => {
      res.set("Content-Type", "text/xml");
      res.send(
        o2x({
          '?xml version="1.0" encoding="UTF-8"?': null,
          // '!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.012/cXML.dtd"': null,
          Index: {
            SupplierID: {
              "@": {
                domain: "some domain??",
              },
              "#": "supplier id",
            },
            "#": result,
          },
        })
      );
    })
    .catch((err) => {
      console.log(err);
      response(res, { error: true, ...err });
    });
});
router.post("/:where", (req, res) => {
  parse(req.body[req.params.where], { trim: true })
    .then((result) => response(res, { ok: true, result }))
    .catch((err) => {
      console.log(err);
      response(res, { error: true, ...err });
    });
});

const app = express();
app.use("/", router);
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT})`);
});

// const createSendPromise = (child) => {
//   const createId = ((id) => () => {
//     if (id > 999999999999) {
//       id = 0;
//     }
//     return id++;
//   })(0);
//   child.on("message", (rawMessage) => {
//     const [id, message] = rawMessage.split(",");
//     promises[id](message);
//   });
//   const promises = {};
//   return (message) => {
//     const id = createId();
//     const promise = new Promise(
//       (resolve) => (promises[id] = resolve)
//     );
//     child.send(`${id},${message}`);
//     return promise.then((message) => {
//       delete promises[id];
//       return message;
//     });
//   };
// };
// const startKeyManager = () => {
//   const path = require("path");
//   const fork = require("child_process").fork;
//   const EXIT = require("./const").EXIT;
//   const program = path.resolve("keyManager.js");
//   const parameters = [];
//   const options = {
//     stdio: [null, null, null, "ipc"],
//   };
//   const child = fork(program, parameters, options);
//   const sendPromise = createSendPromise(child);
//   process.on("exit", function () {
//     console.log("exit main process");
//     sendPromise(EXIT);
//   });
//   return [sendPromise];
// };
// const [sendPromise] = startKeyManager();
