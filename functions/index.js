const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const fs = require("fs");
const app = express();
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
const getTheme = theme => {
  try {
    return require(__dirname + "/node_modules/jsonresume-theme-" + theme);
  } catch (e) {
    return {
      error:
        "Theme not supported please visit -> https://github.com/jsonresume/theme-manager/issues/48"
    };
  }
};
app.get("/theme/:theme", (req, res) => {
  const resumeJson = JSON.parse(fs.readFileSync(__dirname + "/resume.json"));
  const themeRenderer = getTheme(req.params.theme);
  if (themeRenderer.error) {
    return res.send(themeRenderer.error);
  }
  const resumeHTML = themeRenderer.render(resumeJson, {});
  res.send(resumeHTML);
});
app.post("/theme/:theme", (req, res) => {
  const resumeJson = req.body.resume;
  const themeRenderer = getTheme(req.params.theme);
  if (themeRenderer.error) {
    return res.send(themeRenderer.error);
  }
  const resumeHTML = themeRenderer.render(resumeJson, {});
  res.send(resumeHTML);
});
// app.post("/", (req, res) => res.send(Widgets.create()));
// app.put("/:id", (req, res) =>
//   res.send(Widgets.update(req.params.id, req.body))
// );
// app.get("/", (req, res) => res.send(Widgets.list()));

// Expose Express API as a single Cloud Function:
exports.theme = functions.https.onRequest(app);
