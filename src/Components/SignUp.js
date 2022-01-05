import {React, useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router';


function SignUp({ gun, user }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const [alert, setAlert] = useState({active:false, message:'', type:''});

  const navigate = useNavigate();

  useEffect(() => {
    user = gun.user().recall({ sessionStorage: true });
  }, []);

  const handleUp = () => {

    user.create(alias, password, (ack)=>{
        if(ack.ok == 0){
            setAlert({active:true, message:'User created sucessfully!', type:"success"})
            gun.user().auth(alias, password);
            if(gun.user().is) {
              console.log('logged in');
              return navigate("/timeline");
            } else {
              console.log("Couldn't log in");
            }
        }
        else if(ack.err != null){
            setAlert({active:true, message:ack.err, type:"danger"})
        }else{
            console.log('nada')
        }
            
    });
  };

  return (
    <div className="container mt-4">
      <h1>Create an account</h1>
        {   
            alert.active ? <Alert color={`${alert.type}`}>
            {alert.message}
            </Alert> : null
        }
      <Form>
        <FormGroup>
          <Label for="exampleEmail">
            Username
          </Label>
          <Input
            id="alias" 
            placeholder="username"
            name="alias"
            type="text"
            onChange={(input) => setAlias(input.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">
            Password
          </Label>
          <Input
            id="pass"
            type="password"
            placeholder="passphrase"
            name="password"
            onChange={(input) => setPassword(input.target.value)}
          />
        </FormGroup>
        <Button onClick={handleUp}>
          Sign Up
        </Button>
      </Form>
    </div>
);

}

export default SignUp;