const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// add cookieParser to middleware stack
app.use(cookieParser());

app.get("/", (req, res) => {
  const styledAlready = req.cookies["inline-cacher"] === "true";
  res.send(`
    <html>
      <head>
        <title>Proof of concept</title>
        ${
          styledAlready
            ? ""
            : `
            <style>
              ${fs.readFileSync(path.resolve(__dirname, "./example.css"))}
            </style>
            <style>
              ${fs.readFileSync(path.resolve(__dirname, "./example2.css"))}
            </style>
            <style>
              ${fs.readFileSync(path.resolve(__dirname, "./example3.css"))}
            </style>
        `
        }
      </head>
      <body>
        <h1>Proof of concept</h1>
        <p>This paragraph has inline styles applied to it.</p>
        <button>Reset cookies</button>
        <script src="../dist/inline-cacher.min.js"></script>
        <script>
          (function () {
            // run InlineCacher
            InlineCacher.init();

            // give the demo a chance to reset the cookie easily
            document.querySelector("button").addEventListener("click", function() {
              // delete the cookie and clear local storage
              InlineCacher.reset();
              // refresh to see inline styles again
              window.location.href = window.location.href;
            });
          })();
        </script>
      </body>
    </html>
  `);
});

app.get("/dist/:jsFile", (req, res) => {
  res.type("text/javascript");
  res.send(
    fs.readFileSync(path.resolve(__dirname, `../dist/${req.params.jsFile}`), {
      encoding: "UTF-8"
    })
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
