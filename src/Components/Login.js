import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

function Login({ gun, user }) {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    user = gun.user().recall({ sessionStorage: true });
  }, []);

  const login = () => {
    user.auth(alias, password);
    if(user.is) console.log('logged in');
  };

  return (
    <div className="container mt-4">
      <h1>Login</h1>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">
            Username
          </Label>
          <Input
            id="alias" 
            innerRef={(input) => setAlias(input)}
            placeholder="username"
            name="alias"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">
            Password
          </Label>
          <Input
            id="pass"
            innerRef={(input) => setPassword(input)}
            type="password"
            placeholder="passphrase"
            name="password"
          />
        </FormGroup>
        <Button onClick={login}>
          Sign In
        </Button>
        <Link className="m-2 btn btn-primary" to="/signup">
          Sign Up
        </Link>
      </Form>
    </div>
);

}

export default Login;

// ToDo Pôr o que está abaixo para React
{
  /* <script>
var gun = gun = GUN(location.origin + '/gun');
var user = gun.user().recall({sessionStorage: true});

$('#up').on('click', function(e){
  user.create($('#alias').val(), $('#pass').val(), login);
});
function login(e){
  user.auth($('#alias').val(), $('#pass').val());
  return false; // e.preventDefault();
};
$('#sign').on('submit', login);
$('#mask').on('click', login);

gun.on('auth', function(){
  $('#sign').hide();
  user.get('said').map().on(UI);
});

$('#said').on('submit', function(e){
  e.preventDefault();
  //if(!user.is){ return }
  user.get('said').set($('#say').val());
  $('#say').val("");
});

function UI(say, id){
  var li = $('#' + id).get(0) || $('<li>').attr('id', id).appendTo('ul');
  $(li).text(say);
};
</script> */
}

{/*<form id="sign">
        <input id="alias" ref={inputAlias} placeholder="username" />
        <input
          id="pass"
          ref={inputPass}
          type="password"
          placeholder="passphrase"
        />
        <input id="up" type="button" value="sign up" onClick={handleUp} />
        <input id="mask" type="button" value="Identifi Login" />
      </form>

      <ul></ul>

      <form id="said">
        <input id="say" />
        <input id="speak" type="submit" value="speak" />
      </form>
    </div>*/}
