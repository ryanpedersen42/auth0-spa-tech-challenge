import React from "react";
import { Container } from "reactstrap";
import { Button } from "reactstrap";

import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";

const OrderPage = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  const alertThis = () => {
    alert('one large cheese pizza coming right up')
  }

  return (
    <Container className="mb-5">
        {
          user.email_verified ? 
          (
          <Button color="primary" className="mt-5" onClick={alertThis}>
            Order Pizza
          </Button>
          ) : 
          (
          <p>
            sorry, you need to confirm your email address before you can order
          </p>
          )
        }
    </Container>
  );
};

export default OrderPage;