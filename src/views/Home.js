import React, { Fragment } from "react";

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Fragment>
      <h3>Welcome to Pizza 42's website.</h3>
      {!isAuthenticated && (
        <p>Log in and verify your email to place an order.</p>
      )}
    </Fragment>
  );
};

export default Home;
