const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const EventEmitter = require("events");
const logEvents = require("./logEvents");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(`${req.url}\t${req.method}`);

  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text.html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExits = fs.existsSync(filePath);

  if (fileExits) {
    // serve the file
  } else {
    // 404 error
    // 301 redirect
    console.log(path.parse(filePath));
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// add event listener for log event
/* myEmitter.on("log", (msg) => logEvents(msg));
myEmitter.emit("log", "log event emitted!"); */
