/* const fs = require("fs").promises;
const path = require("path");

const fileOps = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "files", "newFile.txt"),
      "utf8"
    );

    await fs.unlink(path.join(__dirname, "files", "newFile.txt"));

    await fs.writeFile(
      path.join(__dirname, "files", "starter.txt"),
      "\n\nWritten text content"
    );

    await fs.appendFile(
      path.join(__dirname, "files", "starter.txt"),
      "\n\nAppended text content"
    );

    await fs.rename(
      path.join(__dirname, "files", "starter.txt"),
      path.join(__dirname, "files", "newStarter.txt")
    );

    const newData = await fs.readFile(
      path.join(__dirname, "files", "newStarter.txt"),
      "utf8"
    );

    console.log(newData);
  } catch (err) {
    console.log(err);
  }
};

fileOps();

/* const readFile = (file) => {
  fs.readFile(path.join(__dirname, "files", file), "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
};

const writeFile = (file, content) => {
  fs.writeFile(path.join(__dirname, "files", file), content, (err, data) => {
    if (err) throw err;
    console.log(content);
  });
};

const appendFile = (file, content) => {
  fs.appendFile(path.join(__dirname, "files", file), content, (err, data) => {
    if (err) throw err;
    console.log(content);
  });
};

const renameFile = (oldFilename, newFilename) => {
  fs.rename(
    path.join(__dirname, "files", oldFilename),
    path.join(__dirname, "files", newFilename),
    (err, data) => {
      if (err) throw err;
      console.log("Rename complete!");
    }
  );
};

readFile("starter.txt");
renameFile("starter.txt", "newFile.txt"); */

const logEvents = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// add event listener for log event
myEmitter.on("log", (msg) => logEvents(msg));

setTimeout(() => {
  myEmitter.emit("log", "log event emitted!");
}, 2000);
