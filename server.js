const express = require("express");
const app = express();

app.get("/callback", (req, res) => {
  const code = req.query.code;

  // Redirect back to mobile app
  res.redirect(`myapp://callback?code=${code}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(10000, () => console.log("Server running on port 10000"));
