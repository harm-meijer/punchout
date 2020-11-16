const userProfile = require("./userProfile").userProfile;
const parseString = require("xml2js").parseString;
const products = require("./products").products;

const asPromise = (fn) => (...args) =>
  new Promise((resolve, reject) =>
    fn(
      ...args.concat((err, result) =>
        err ? reject(err) : resolve(result)
      )
    )
  );
const parse = asPromise(parseString);
const tokenFromBody = (body) =>
  body.cXML.Header[0].Sender[0].Credential[0]
    .SharedSecret[0];
exports.compose = (functions) => (arg) =>
  functions.reduce(
    (result, fn) => result.then(fn),
    Promise.resolve(arg)
  );
exports.withUserProfile = (arg) =>
  userProfile(tokenFromBody(arg.body)).then(
    (userProfile) => ({
      ...arg,
      userProfile,
    })
  );
exports.withParsedRequest = (arg) =>
  parse(arg.body, { trim: true }).then((body) => ({
    ...arg,
    body,
  }));
exports.withProducsts = (arg) =>
  products({
    access_token: tokenFromBody(arg.body),
  }).then((products) => ({
    ...arg,
    products,
  }));
