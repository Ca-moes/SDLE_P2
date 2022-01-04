import React, { useState, useEffect, useRef } from "react";

function Auth({ gun, user }) {
  const inputAlias = useRef();
  const inputPass = useRef();

  useEffect(() => {
    user = gun.user().recall({ sessionStorage: true });
  }, []);

  const login = () => {
    user.auth(inputAlias.current.value, inputPass.current.value);
  };

  const handleUp = () => {
    user.create(inputAlias.current.value, inputPass.current.value, login);
  };

  return (
    <>
      {user.is ? <p>Logged in</p> : <p>Not Logged in</p>}
      <form id="sign">
        <input id="alias" ref={inputAlias} placeholder="username" />
        <input
          id="pass"
          ref={inputPass}
          type="password"
          placeholder="passphrase"
        />
        <input id="in" type="button" value="sign in" />
        <input id="up" type="button" value="sign up" onClick={handleUp} />
        <input id="mask" type="button" value="Identifi Login" />
      </form>

      <ul></ul>

      <form id="said">
        <input id="say" />
        <input id="speak" type="submit" value="speak" />
      </form>
    </>
  );
}

export default Auth;

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
