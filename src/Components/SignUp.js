import { React, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { useNavigate } from "react-router";
import { getUserPubKey } from "../utils";

function SignUp({ gun, user }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleUp = () => {
    user.create(alias, password, (ack) => {
      if ("err" in ack) {
        setAlert({ active: true, message: ack.err, type: "danger" });
      } else if (ack.ok == 0) {
        setAlert({
          active: true,
          message: "User created sucessfully!",
          type: "success",
        });

        gun.get("users").get(alias).put({ alias, pubKey: ack.pub });

        user.auth(alias, password, (ack_2) => {
          if ("err" in ack_2) {
            setAlert({ active: true, message: ack_2.err, type: "danger" });
          } else {
            console.log("Logged in: ", ack_2);
            return navigate("/timeline");
          }
        });
      } else {
        console.error("Something went wrong in user.create()");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h1>Create an account</h1>
      {alert.active ? (
        <Alert color={`${alert.type}`}>{alert.message}</Alert>
      ) : null}
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Username</Label>
          <Input
            id="alias"
            placeholder="username"
            name="alias"
            type="text"
            onChange={(input) => setAlias(input.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            id="pass"
            type="password"
            placeholder="passphrase"
            name="password"
            onChange={(input) => setPassword(input.target.value)}
          />
        </FormGroup>
        <Button onClick={handleUp}>Sign Up</Button>
      </Form>
    </div>
  );
}

export default SignUp;
