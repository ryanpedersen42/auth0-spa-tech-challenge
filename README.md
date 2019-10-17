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

### APIs
In addition to Auth0, this project makes use of the Google People and FullContact APIs. <br>
OF NOTE: To use the Google People API to access contacts, you need to select that option inside of Auth0 (Dashboard > Connections > Social > Google > Permissions). Google requires production apps to be verified, but testing is OK. End users will need to accept that the Pizza 42 will access their contacts and to acknowledge that they know Google hasn't verified the app.

## Usage 
### Authentication
You can log in with email/password or Google. <br>

### Verification
If you log in with email/password, you will receive an email to verify your email address. <br>
Once the profile has been verified, a verification checkmark is added to the profile page, and you can click the order button.<br>

### API Calls
The API tests are under the External API tab.<br>
If you are authenticated with Google, the Google Connections button queries the Google People API. If this is the first time you are making the call, it will store the results in your Auth0 metadata. If you have already stored it in your metadata, it returns the number of connections that you have. <br>
The Get Gender button queries the FullContact API and tries to get the gender of the user. If FullContact successfully returns a result, it will be stored in your Auth0 metadata. Once this is stored in your metadata, the call will return the result. 

Using Pizza 42
![Authentication](/src/assets/Auth_Process.gif)
![Confirming Verification](/src/assets/Verified_Account.gif)
![API Calls](/src/assets/API_Calls.gif)