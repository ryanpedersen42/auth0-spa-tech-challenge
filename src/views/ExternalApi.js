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

      const bodyObject = {
        token: token,
        user: user,
      }
      const response = await fetch("/api/external", {
        method: 'post',
        headers : { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({bodyObject})
        })

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const getMetadata = async () => {
    const token = await getTokenSilently();
    const fullUser = await getUser();
    const user = fullUser.sub;
    const userEmail = fullUser.email

    const bodyObject = {
      token: token,
      email: userEmail,
    }

    try {

      const response2 = await fetch("/api/test", {
        method: 'post',
        headers : { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }, body: JSON.stringify({bodyObject})
        })
      const responseData2 = await response2.json();

      setShowResult(true);
      setApiMessage(responseData2);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="mb-5">
        <h1>External API</h1>

        <Button color="primary" className="mt-5" onClick={callApi}>
          Ping API
        </Button>
        <Button color="primary" className="mt-5" onClick={getMetadata}>
          Get Metadata
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
