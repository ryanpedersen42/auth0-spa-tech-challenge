import React, { useState } from "react";
import { Button } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { getTokenSilently, getUser } = useAuth0();

  const getGoogleContactNumber = async () => {
    const token = await getTokenSilently();
    const fullUser = await getUser();
    const user = fullUser.sub;

    const bodyObject = {
      token: token,
      user: user
    };

    const googleFetch = await fetch("/api/google", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bodyObject })
    });

    try {
      const googleResponseData = await googleFetch.json();

      setShowResult(true);
      setApiMessage(googleResponseData);
    } catch (error) {
      console.error(error);
    }
  };

  const getMetadata = async () => {
    const token = await getTokenSilently();
    const fullUser = await getUser();
    const userEmail = fullUser.email;
    const user = fullUser.sub;

    const bodyObject = {
      token: token,
      userEmail: userEmail,
      user: user
    };

    const metadataFetch = await fetch("/api/gender", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bodyObject })
    });

    try {
      const genderResponseData = await metadataFetch.json();

      setShowResult(true);
      setApiMessage(genderResponseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mb-5">
        <h1>Call the APIs</h1>

        <Button
          color="primary"
          className="mt-5"
          onClick={getGoogleContactNumber}
        >
          Get Google Connections
        </Button>
        <Button color="primary" className="mt-5" onClick={getMetadata}>
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