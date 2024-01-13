const http = require("http");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const logEvents = require("./logEvents");
const EventEmitter = require("events");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

// create a serve
const PORT = process.env.PORT || 3500;

myEmitter.on("logs", (msg, fileName) => logEvents(msg, fileName));

const serverFile = async (contentType, filePath, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit("logs", `${err.name}: ${err.message}`, "errorLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(`${req.url} ${req.method}`);
  myEmitter.emit("logs", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "application/javascript";
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
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // handle if req.url contains no extension
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  // check if the filepath exists
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    serverFile(contentType, filePath, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        response.writeHead(301, { Location: "new-page.html" });
        response.end();
        break;
      case "www-page.html":
        response.writeHead(301, { Location: "/" });
        response.end();
        break;
      default:
        serverFile("text/html", path.join(__dirname, "views", "404.html"), res);
    }
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
