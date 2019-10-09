import React, { useState } from "react";
import { Button } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently, getUser } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      const fullUser = await getUser();
      const user = fullUser.sub;
      console.log(token)
      console.log(fullUser)

      const bodyObject = {
        token: token,
        user: user,
      }

      const theURL = "https://auth0-apis.herokuapp.com/api/external"
      const response = await fetch('/api/external', {
        method: 'post',
        headers : { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        }, 
        body: JSON.stringify({bodyObject})
        })

      const responseData = await response.text();
      setShowResult(true);
      setApiMessage(responseData);

      } catch (error) {
        console.error(error);
      }
  };

  const checkMetadata = async () => {
    const token = await getTokenSilently();
    const fullUser = await getUser();
    const userEmail = fullUser.email;
    const user = fullUser.sub;

    const bodyObject = {
      token: token,
      userEmail: userEmail,
      user: user,
    }

    try {
      const metadataFetch = await fetch("/api/test", {
        method: 'post',
        headers : { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        }, body: JSON.stringify({bodyObject})
        })

      const responseData2 = await metadataFetch.json();

      setShowResult(true);
      setApiMessage(responseData2);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="mb-5">
        <h1>Call the APIs</h1>

        <Button color="primary" className="mt-5" onClick={callApi}>
          Get Connections
        </Button>
        <Button color="primary" className="mt-5" onClick={checkMetadata}>
          Get Gender
        </Button>
      </div>

      <div className="result-block-container">
        <div className={`result-block ${showResult && "show"}`}>
          <h6 className="muted">Result</h6>
          <Highlight>{JSON.stringify(apiMessage, null, 2)}</Highlight>
        </div>
      </div>
    </>
  );
};

export default ExternalApi;
