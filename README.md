# Auth0 Technical Challenge

## Running the application

Create an auth_config.json in your src directory, and then include it in your .gitignore. It should include the following: 
```
REACT_APP_DOMAIN=[YOUR_AUTH0_DOMAIN]
REACT_APP_CLIENT_ID_FRONT=[YOUR_AUTH0_CLIENT_ID]
REACT_APP_AUDIENCE=[YOUR_AUDIENCE]
CLIENT_ID_BACK=[YOUR_AUTH0_MGMT_API_CLIENT_ID]
CLIENT_SECRET=[YOUR_AUTH0_MGMT_API_CLIENT_SECRET]
SERVER_AUDIENCE=https://[YOUR_AUTH0_DOMAIN]/api/v2/
FULLCONTACT_TOKEN=[YOUR_FULLCONTACT_TOKEN]

```

### `npm install`

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The server will be running on [http://localhost:3005](http://localhost:3005)

The page will reload if you make edits to the src directory.<br>
Nodemon will restart the server if you make any edits to the APIs <br>
You will also see any lint errors in the console.

## Usage 
You can log in with email or password or Google. <br>
If you log in with email / password, you will receive an email to verify. You can click the order button once you have verified. <br>
You can see if you are verified on your profile page.<br>
<br>
You can test out the APIs on the External API tab.<br>
The Google Connections button queries the Google People API and returns the number of connections that you have. <br>
The Get Gender button queries FullContact and tries to get the gender of the user; if it returns one, it stores it to metadata.