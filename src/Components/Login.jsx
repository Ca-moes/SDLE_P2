import React, { useState, useEffect } from "react";

import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';

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
        return navigate("/profile");
      }
    });
  };

  useEffect(() => {
    if (user.is) {
      navigate("/profile");
    }
  }, [])

  return (
    <div className="container mt-4">
      <h1>Login</h1>
      {alert.active ? (
        <Alert variant={`${alert.type}`}>{alert.message}</Alert>
      ) : null}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label for="exampleEmail">Username</Form.Label>
          <Form.Control
            id="alias"
            onChange={(input) => setAlias(input.target.value)}
            placeholder="username"
            name="alias"
            type="text"
          />
        </Form.Group >
        <Form.Group className="mb-3">
          <Form.Label for="examplePassword">Password</Form.Label>
          <Form.Control
            id="pass"
            onChange={(input) => setPassword(input.target.value)}
            type="password"
            placeholder="passphrase"
            name="password"
          />
        </Form.Group>
        <Button onClick={login}>Sign In</Button>
        <Link className="m-2 btn btn-secondary" to="/signup">
          Sign Up
        </Link>
      </Form>
    </div>
  );
}
