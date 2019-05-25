const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

// add cookieParser to middleware stack
app.use(cookieParser());

app.get("/", (req, res) => {
  const styledAlready = req.cookies["style-cookies"] === "true";
  res.send(`
    <html>
      <head>
        <title>Proof of concept</title>
        ${
          styledAlready
            ? ""
            : `<style>
              p { color: red }
            </style>`
        }
      </head>
      <body>
        <h1>Proof of concept</h1>
        <p>This paragraph has inline styles applied to it.</p>
        <button>Reset cookies</button>
        <script src="./index.js"></script>
      </body>
    </html>
  `);
});

app.use(express.static("public"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
