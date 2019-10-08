require('dotenv').config();

module.exports = {
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID_FRONT,
  audience: process.env.AUDIENCE,
  client_id: process.env.CLIENT_ID_BACK,
  client_secret: process.env.CLIENT_SECRET,
  server_audience: process.env.SERVER_AUDIENCE,
  fullContact_token: process.env.FULLCONTACT_TOKEN,
}