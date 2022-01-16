import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';

function SignUp({ gun, user }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleUp = () => {
    user.create(alias, password, (ack) => {
      if ("err" in ack) {
        setAlert({ active: true, message: ack.err, type: "danger" });
      } else if (ack.ok === 0) {
        setAlert({
          active: true,
          message: "User created sucessfully!",
          type: "success",
        });

        gun.get("users").get(alias).put(ack.pub);

        user.auth(alias, password, (ack_2) => {
          if ("err" in ack_2) {
            setAlert({ active: true, message: ack_2.err, type: "danger" });
          } else {
            console.log("Logged in: ", ack_2);
            return navigate("/profile");
          }
        });
      } else {
        console.error("Something went wrong in user.create()");
      }
    });
  };

  useEffect(() => {
    if (user.is)
      navigate("/profile");
  }, [])

  return (
    <div className="container mt-4">
      <h1>Create an account</h1>
      {alert.active ? (
        <Alert variant={`${alert.type}`}>{alert.message}</Alert>
      ) : null}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label for="exampleEmail">Username</Form.Label>
          <Form.Control
            id="alias"
            placeholder="username"
            name="alias"
            type="text"
            onChange={(input) => setAlias(input.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label for="examplePassword">Password</Form.Label>
          <Form.Control
            id="pass"
            type="password"
            placeholder="passphrase"
            name="password"
            onChange={(input) => setPassword(input.target.value)}
          />
        </Form.Group>
        <Button onClick={handleUp}>Sign Up</Button>
      </Form>
    </div>
  );
}

export default SignUp;
