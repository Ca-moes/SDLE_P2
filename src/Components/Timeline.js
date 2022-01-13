import React, { useState, useEffect, useRef } from "react";
import Follow from "./Follow";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";

function Timeline({ gun, user }) {
  const [items, setItems] = useState({});
  const inputRef = useRef();
  const navigate = useNavigate();
  let ev = null;

  const handler = (value, key, _msg, _ev) => {
    let new_items = {};
    Object.entries(value)
      .filter((item) => item[0] != "_")
      .forEach((item) => {
        if (item[1] != null)
          new_items[item[0]] = item[1]
      });

    ev = _ev;
    console.log("newitems", new_items)
    setItems(new_items);
  };

  useEffect(() => {
    console.log("Em use effect, subscreveu");
    gun.get(`~${user.is.pub}`).get("timeline").on(handler);

    return () => {
      console.log("Off no return do useEffect");
      ev.off();
    };
  }, []);

  const add = () => {
    const value = inputRef.current.value;
    const time = Date.now();
    gun.get(`~${user.is.pub}`).get("timeline").get(time).put(value);
    inputRef.current.value = "";
  };

  const handleDelete = (time) => {
    gun.get(`~${user.is.pub}`).get("timeline").get(time).put(null);
  };

  const logout = () => {
    console.log("Off no logout");
    gun.get(`~${user.is.pub}`).get("timeline").off();
    user.leave();
    if (user._.sea) {
      // Check Unexpected behavior in https://gun.eco/docs/User#user-leave
      window.sessionStorage.removeItem("pair");
    }
    return navigate("/");
  };

  return (
    <>
      <Follow gun={gun} user={user} />
      <div className="container mt-4">
        <h1>Items list</h1>
        <div className="d-flex flex-row justify-content-between align-items-start">
          <div>
            <div>
              <input ref={inputRef} />
              <button onClick={add}>Add</button>
            </div>
            <ul>
              {Object.keys(items).map((key) => (
                <li key={key}>
                  {items[key]} ({key})
                  <button onClick={() => handleDelete(key)}>Del</button>
                </li>
              ))}
            </ul>
          </div>
          <Button color="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}

export default Timeline;
