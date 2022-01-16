import React, { useState, useEffect, useRef } from "react";

import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function Login({ user }) {
  const alias = React.createRef();
  const password = React.createRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const navigate = useNavigate();

  const login = () => {
    user.auth(alias.current.value, password.current.value, (ack) => {
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
    <div className="w-100 min-h-vh d-flex jusitify-content-center align-items-center">
      <div className="m-auto col-sm-10 col-md-4 col-xl-3">
      <h1>Login</h1>
      {alert.active ? (
        <Alert variant={`${alert.type}`}>{alert.message}</Alert>
      ) : null}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label for="exampleEmail">Username</Form.Label>
          <Form.Control
            id="alias"
            ref={alias}
            placeholder="username"
            name="alias"
            type="text"
          />
        </Form.Group >
        <Form.Group className="mb-3">
          <Form.Label for="examplePassword">Password</Form.Label>
          <Form.Control
            id="pass"
            ref={password}
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
      
    
    </div>
  );
}
