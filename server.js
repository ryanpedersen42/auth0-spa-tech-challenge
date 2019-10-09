require('dotenv').config();

const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
//const authConfig = require("./src/auth_config.json");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const { join } = require("path");
var request = require("request");

const {REACT_APP_DOMAIN, CLIENT_ID_BACK, REACT_APP_AUDIENCE, CLIENT_SECRET, SERVER_AUDIENCE, FULLCONTACT_TOKEN} = process.env;

const app = express();

const port = process.env.PORT || 3005;

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "build")));

//check config
// if (!REACT_APP_DOMAIN || !REACT_APP_AUDIENCE) {
//   throw new Error(
//     "Please make sure that auth_config.json is in place and populated"
//   );
// }

//set up JWT check
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${REACT_APP_DOMAIN}/.well-known/jwks.json`
  }),
  // audience: REACT_APP_AUDIENCE,
  // issuer: `https://${REACT_APP_DOMAIN}/`,
  algorithm: ["RS256"]
});

//request call to be used for api tokens below
function doRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, function(error, body) {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(body.body));
    });
  });
}

//main post request
app.post(
  "/api/external",
  checkJwt,
  async (req, res, next) => {
    const { user, token } = req.body.bodyObject;

    //initial token options to call for users oauth token
    var getTokenOptions = {
      method: "POST",
      url: "https://dev-irmh6clw.auth0.com/oauth/token",
      headers: { "content-type": "application/json" },
      body: `{"client_id":"${CLIENT_ID_BACK}","client_secret":"${CLIENT_SECRET}","audience":"${SERVER_AUDIENCE}","grant_type":"client_credentials"}`
    };

    //pass through user that was in initial post header
    res.locals.user = user;
    res.locals.token = token;
    try {
      const response = await doRequest(getTokenOptions);

      //pass through access token
      res.locals.access_token = response.access_token;
      next();
    } catch (err) {
      console.log("err: ", err);
      res.status(500);
    }
  },
  async (req, res, next) => {
    const { access_token, user, token } = res.locals;

    //next set of options to get user info from mgmt API with token
    var options = {
      method: "GET",
      url: `https://dev-irmh6clw.auth0.com/api/v2/users/${user}`,
      headers: { authorization: `Bearer ${access_token}` }
    };

    try {
      //find the right object with the oauth instead of taking the first..
      const response = await doRequest(options);

      res.locals.googleToken = response.identities[0].access_token;
      next();
    } catch (err) {
      console.log("err: ", err);
      res.status(500);
    }
    // console.log(res.locals);
    return res.status(200).send("got through it!");
  },
  async (req, res, next) => {
    const { googleToken } = res.locals;

    const { access_token, user } = res.locals;

    try {
      // console.log(googleToken);
    } catch (err) {
      console.log("err", err);
    }
  }
);

const readConnections = googleToken => {
  const serviceUrl =
    "https://people.googleapis.com/v1/people/me/connections?personFields=relations";

  var config = {
    method: "GET",
    url: serviceUrl,
    headers: {
      Authorization: `Bearer ${googleToken}`,
      Accept: "application/json"
    }
  };

  request(config, (err, res, body) => {
    if (err) console.log(err);
    else console.log(body);
  });
};

app.post(
  "/api/test",
  // checkJwt,
  async (req, res, next) => {
    const { token, userEmail, user } = req.body.bodyObject;

    //initial token options to call for users oauth token
    var getTokenOptions = {
      method: "POST",
      url: "https://dev-irmh6clw.auth0.com/oauth/token",
      headers: { "content-type": "application/json" },
      body: `{"client_id":"${CLIENT_ID_BACK}","client_secret":"${CLIENT_SECRET}","audience":"${SERVER_AUDIENCE}","grant_type":"client_credentials"}`
    };

    //pass through user that was in initial post header
    res.locals.token = token;
    res.locals.email = userEmail;
    res.locals.user = user;

    try {
      const response = await doRequest(getTokenOptions);
      res.locals.access_token = response.access_token;

      next();
    } catch (err) {
      console.log("err: ", err);
      res.status(500);
    }
  },
  async (req, res, next) => {
    const { access_token, user, token } = res.locals;

    //next set of options to get user info from mgmt API with token
    var userInfoOptions = {
      method: "GET",
      url: `https://dev-irmh6clw.auth0.com/api/v2/users/${user}`,
      headers: { authorization: `Bearer ${access_token}` }
    };

    try {
      //see if they already have metadata
      const response = await doRequest(userInfoOptions);
      if (!response.user_metadata.gender) {
        return next();
      }
      return res.status(200).send(response.user_metadata);
    } catch (err) {
      console.log("err: ", err);
      res.status(500);
    }
  },
  async (req, res, next) => {
    const { email } = res.locals;

    var fullContactOptions = {
      method: "POST",
      url: `https://api.fullcontact.com/v3/person.enrich`,
      headers: {
        authorization: `Bearer ${FULLCONTACT_TOKEN}`
      },
      body: JSON.stringify({ email: email })
    };

    try {
      const fullContact = await doRequest(fullContactOptions);
      res.locals.gender = fullContact.gender;
      console.log(fullContact);
      next();
    } catch (err) {
      console.log("final", err);
    }
  },
  async (req, res, next) => {
    const { user, access_token, gender } = res.locals;

    var metadataOptions = {
      method: "PATCH",
      url: `https://dev-irmh6clw.auth0.com/api/v2/users/${user}`,
      headers: {
        authorization: `Bearer ${access_token}`,
        "content-type": "application/json"
      },
      body: { user_metadata: { gender: gender } },
      json: true
    };

    try {
      request(metadataOptions, function(error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
      });
    } catch (err) {
      console.log("final", err);
    }
    return res.status(200).send("just added the metadata");
  }
);

// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname, "build/index.html"));
// })

app.listen(port, () => console.log(`Server listening on port ${port}`));
