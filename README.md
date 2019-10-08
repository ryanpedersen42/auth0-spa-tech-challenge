# Auth0 Technical Challenge

## Running the application

Create an auth_config.json in your src directory, and then include it in your .gitignore. It should include the following: 
```
{
  "domain": "[YOUR_AUTH0_DOMAIN]",
  "clientId": [YOUR_AUTH0_CLIENT_ID]",
  "audience": "[YOUR_AUDIENCE]",
  "client_id": "[YOUR_AUTH0_MGMT_API_CLIENT_ID]",
  "client_secret": "[YOUR_AUTH0_MGMT_API_CLIENT_SECRET]",
  "server_audience": "https://[YOUR_AUTH0_DOMAIN]/api/v2/",
  "fullContact_token": "[YOUR_FULLCONTACT_TOKEN]"
}
```

### `npm install`

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Usage 
You can log in with email or password or Google. If you log in with email / password, you will receive an email 