require('dotenv').config();
const express = require('express');
const axios = require('axios');

const clientID = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const redirectURI = "http://localhost:3000/auth/linkedin/callback";

const app = express();

app.get("/", (req, res) => {
    if (req.user) {
      const name = req.user.name.givenName;
      const family = req.user.name.familyName;
      const photo = req.user.photos[0].value;
      const email = req.user.emails[0].value;
      res.send(
        `<center style="font-size:140%"> <p>User is Logged In </p>
        <p>Name: ${name} ${family} </p>
        <p> Linkedn Email: ${email} </p>
        <img src="${photo}"/>
        </center>
        `
      )
    } else {
      res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
      <p>User is not Logged In</p>
      <img style="cursor:pointer;"  onclick="window.location='/auth/linkedIn'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/>
      </center>
      `);
    }
  });

app.get('/auth/linkedin', (req, res) => {
    const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientID}&redirect_uri=${redirectURI}&scope=profile%20email`;
  
    res.redirect(authURL);
  });
  
  app.get('/auth/linkedin/callback', async (req, res) => {
    const { code } = req.query;
    console.log(req);
    // return res.json(code);
  
    const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        `grant_type=authorization_code&code=${code}&redirect_uri=${redirectURI}&client_id=${clientID}&client_secret=${clientSecret}`
    );
  
    // const result = JSON.stringify(tokenResponse);
    // console.log(code);
    // console.log(tokenResponse);

    const accessToken = tokenResponse.data.access_token;
    const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/me',
        {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      }
    );
  
    
    const userData = profileResponse.data;
    res.json(userData);
  });

  app.listen(3000, () => {
    console.log("Server started listening on port 3000");
  })