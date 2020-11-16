const keys = {};
const EXIT = require("./const").EXIT;
const EXPIRE_TIME = require("./const").EXPIRE_TIME;
const REMOVE_TIME = require("./const").REMOVE_TIME;
const EXPIRED = require("./const").EXPIRED;
process.on("message", (rawMessage) => {
  const [id, message] = rawMessage.split(",");
  if (message === EXIT) {
    process.exit(0);
  }
  if (!keys[message]) {
    //key does not exist, create it
    keys[message] = Date.now();
  }
  if (Date.now() - keys[message] >= EXPIRE_TIME) {
    //key too old, is expired
    process.send(`${id},${EXPIRED}`);
  } else {
    //reset last used to now
    keys[message] = Date.now();
    process.send(`${id},${message}`);
  }
});
//clean up keys that were not used for a while
setInterval(() => {
  Object.entries(keys)
    .filter(([, value]) => Date.now() - value > REMOVE_TIME)
    .forEach(([key]) => delete keys[key]);
}, 60000);
