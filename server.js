const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const authConfig = require("./src/auth_config.json");
const cors = require("cors");
const bodyParser = require("body-parser");
var request = require("request");

const { google } = require("googleapis");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const port = 3005;

//check config
if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

//set up JWT check
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

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
      body: `{"client_id":"${authConfig.client_id}","client_secret":"${authConfig.client_secret}","audience":"${authConfig.server_audience}","grant_type":"client_credentials"}`
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
      headers: { authorization: `Bearer ${access_token}` ,
      connection_scope:[]
    }
    };

    try {
      //find the right object with the oauth instead of taking the first..
      const response = await doRequest(options);
      console.log(response.identities[0])
      //res.locals.googleToken = 
      readConnections(response.identities[0].access_token)
      next();
    } catch (err) {
      console.log("err: ", err);
      res.status(500);
    }

    return res.status(200).send(res.locals);
  },
  async (req, res, next) => {
    const { googleToken } = res.locals;

    const { access_token, user } = res.locals;

    //!!!!! DO THIS !!!!!
    //If a user signs in with Google, use Auth0 to call the Google People API to fetch the total
    // number of Google connections a user has and store that count in their user profile.

    try {
      console.log(googleToken);
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

app.post("/api/test", checkJwt, async (req, res, next) => {
  const { email } = req.body.bodyObject;

  var fullContactOptions = {
    method: "POST",
    url: `https://api.fullcontact.com/v3/person.enrich`,
    headers: {
      authorization: `Bearer ${authConfig.fullContact_token}`,
    }, body: JSON.stringify({"email": email})
  };

  try {
    const fullContact = await doRequest(fullContactOptions)

    return res.status(200).send(fullContact)

  } catch(err) {
    console.log('final', err)
  }
  return res.status(200).send('test working');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
