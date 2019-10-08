import React from "react";
import { Container, Row, Col } from "reactstrap";
import config from "../auth_config.json";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";
var request = require("request");

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  if (user) {
    console.log(getGender(user))
  }

  async function getGender(user, context, callback) {
      const FULLCONTACT_KEY = `${config.fullContact_token}`;
    
      // skip if no email
      if (!user.email) return console.log('first', null, user, context);
    
      // skip if fullcontact metadata is already there
      if (user.user_metadata && user.user_metadata.fullcontact) return callback(null, user, context);

      // const fullContactBodyObject
      const response2 = await fetch("https://api.fullcontact.com/v3/person.enrich", {
        method: 'post',
        headers : { 
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${FULLCONTACT_KEY}`
        }, 
        body: {
          email: user.email
        }
        })

        console.log(response2)
      // request.get('https://api.fullcontact.com/v2/person.json', {
      //   qs: {
      //     email:  user.email,
      //     apiKey: FULLCONTACT_KEY
      //   },
      //   json: true,
      //   mode: 'no-cors',
      // }, (error, response, body) => {
      //   if (error || (response && response.statusCode !== 200)) {
      //     // swallow fullcontact api errors and just continue login
      //     return console.log('second', null, response, context, error);
      //   }
    
      //   // if we reach here, it means fullcontact returned info and we'll add it to the metadata
      //   user.user_metadata = user.user_metadata || {};
      //   user.user_metadata.fullcontact = body;
    
      //   // auth0.users.updateUserMetadata(user.user_id, user.user_metadata);
      //   context.idToken['https://example.com/fullcontact'] = user.user_metadata.fullcontact;
      //   return console.log( 'third', null, user, context);
      // });
    }
    // if (user.gender) {
    //     return user.gender;
    // }

//     var fullContactInfo = user.user_metadata.fullContactInfo || user.app_metadata.fullContactInfo;

//     if (fullContactInfo && fullContactInfo.gender) {
//         console.log (fullContactInfo.gender);
//     }
//     return null;
// }

  // if (user) {
  //   getGender(user)
  // }

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
        <Col md>
          <p className="lead text-muted">{user.email_verified && (
            <span>✔️ verified account</span>)
            }</p>
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

export default Profile;
