const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "logs", fileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;
