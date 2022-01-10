import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function Login({ user }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const navigate = useNavigate();

  const login = () => {
    user.auth(alias, password, (ack) => {
      if ("err" in ack) {
        setAlert({ active: true, message: ack.err, type: "danger" });
      } else {
        console.log("Logged in: ", ack);
        return navigate("/timeline");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h1>Login</h1>
      {alert.active ? (
        <Alert color={`${alert.type}`}>{alert.message}</Alert>
      ) : null}
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Username</Label>
          <Input
            id="alias"
            onChange={(input) => setAlias(input.target.value)}
            placeholder="username"
            name="alias"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            id="pass"
            onChange={(input) => setPassword(input.target.value)}
            type="password"
            placeholder="passphrase"
            name="password"
          />
        </FormGroup>
        <Button onClick={login}>Sign In</Button>
        <Link className="m-2 btn btn-primary" to="/signup">
          Sign Up
        </Link>
      </Form>
    </div>
  );
}
