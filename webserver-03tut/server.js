const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");

const PORT = process.env.PORT || 3500;

// custom middleware
app.use(logger);

// cross origin resource sharing
const whitelist = [
  "https://www.yoursite.com/",
  "http://127.0.0.1:3500",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// built in middleware to handle urlencoded data
// in other words : form data
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// built in middleware for handling static files inside the public folder
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
