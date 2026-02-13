const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const CLIENT_ID = "22aeddbe-a202-4277-a6ea-0fcebff5266c";
const CLIENT_SECRET = "dmu5h7rj3e";
const REDIRECT_URI = "https://myapp-backend-lyx2.onrender.com/callback";

app.get("/callback", async (req, res) => {
  console.log("Callback hit");
  console.log("Query:", req.query);

  const code = req.query.code;

  console.log("Received code:", code);

  if (!code) {
    return res.send("No code received");
  }

  try {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", REDIRECT_URI);

    console.log("Exchanging code for token...",params.toString());
    if (params.toString().length > 1000) {
      console.log("Params too long, truncating for log");
      console.log(params.toString().substring(0, 1000) + "...");
    } else {
      console.log(params.toString());
    }
    const response = await axios.post(
      "https://api.upstox.com/v2/login/authorization/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
  res.send(`
  <html>
    <body>
      <script>
        window.ReactNativeWebView.postMessage("${accessToken}");
      </script>
    </body>
  </html>
`);
    // Redirect back to mobile app with token
    // res.redirect(`myapp://callback?access_token=${accessToken}`);

  } catch (error) {
    console.log(error.response?.data);
    res.send("Token exchange failed");
  }
});

app.listen(3000, () => console.log("Server running"));
