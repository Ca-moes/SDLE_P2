import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router";

export default function Login({ user, gun }) {
  const alias = React.createRef();
  const password = React.createRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    
    user.auth(alias.current.value, password.current.value, (ack) => {
      if ("err" in ack) {
        setAlert({ active: true, message: ack.err, type: "danger" });
      } else {
        return navigate("/profile");
      }
    });
  };

  const signUp = () => {
    user.create(alias.current.value, password.current.value, (ack) => {
      if ("err" in ack) {
        setAlert({ active: true, message: ack.err, type: "danger" });
      } else if (ack.ok === 0) {
        setAlert({
          active: true,
          message: "User created sucessfully!",
          type: "success",
        });

        gun.get("users").get(alias.current.value).put(ack.pub);

        login();
      } else {
        console.error("Something went wrong in user.create()");
      }
    });
  };

  useEffect(() => {
    if (user.is) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="w-100 min-h-vh d-flex jusitify-content-center align-items-center">
      <div className="m-auto col-sm-10 col-md-4 col-xl-3">
        <h1 className="text-center mb-4">
          <FontAwesomeIcon icon={faDotCircle} /> Dot
        </h1>
        {alert.active ? (
          <Alert variant={`${alert.type}`}>{alert.message}</Alert>
        ) : null}
        <Form onSubmit={login}>
          <Form.Group className="mb-3">
            <Form.Label for="exampleEmail">Username</Form.Label>
            <Form.Control
              id="alias"
              ref={alias}
              placeholder="username"
              name="alias"
              type="text"
            />
          </Form.Group>
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
          <Button type="submit">Sign In</Button>
          <Button variant="secondary" className="m-2" onClick={signUp}>
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
}
