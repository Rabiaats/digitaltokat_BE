"use strict";

const morgan = require("morgan");
const fs = require("node:fs");
const path = require("node:path");

const now = new Date();
const today = now.toISOString().split("T")[0];

const rootDirectory = path.resolve(__dirname, "../..");
const logDirectory = path.join(rootDirectory, "logs");

if (!fs.existsSync(logDirectory)) {
  console.log("Logs folder has been created ");
  fs.mkdirSync(logDirectory, { recursive: true });
} else {
  console.log("Logs folder is exist");
}

const logStream = fs.createWriteStream(
  path.join(logDirectory, `${today}.log`),
  { flags: "a+" },
);

// Custom morgan format with log type prefix
morgan.token("type", (req, res) => {
  const status = res.statusCode;

  if (status >= 500) return "[ERROR]";
  else if (status >= 400) return "[WARNING]";
  else return "[INFO]";
});

const formatWithType = ":type :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"";

module.exports = morgan(formatWithType, { stream: logStream });
