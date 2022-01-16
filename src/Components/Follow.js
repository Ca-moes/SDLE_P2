import React, { useState, useEffect, useRef } from "react";
import { getUserPubKey } from "../utils";
import { Alert } from "reactstrap";

function Follow({ gun, user }) {
  const [followed, setFollowed] = useState([]);
  const followInputRef = useRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  let ev_followList = null;

  const followsListHandler = (value, key, _msg, _ev) => {
    ev_followList = _ev;
    let new_follow = {};
    Object.entries(value)
      .filter((item) => item[0] != "_")
      .forEach((item) => {
        if (item[1] != null) new_follow[item[0]] = item[1];
      });
    setFollowed(new_follow);
  };

  useEffect(() => {
    gun.get(`~${user.is.pub}`).get("follows").on(followsListHandler);
    return () => {
      ev_followList.off();
    };
  }, []);

  const addFollower = () => {
    const alias = followInputRef.current.value;
    if (alias == user.is.alias) {
      setAlert({
        active: true,
        message: "Can't follow yourself",
        type: "danger",
      });
    } else if (Object.keys(followed).includes(alias)) {
      setAlert({
        active: true,
        message: "You already follow that user",
        type: "danger",
      });
    } else {
      gun.get("users").get(alias, (ack) => {
        if (ack.put === undefined) {
          setAlert({
            active: true,
            message: "Could't find user",
            type: "danger",
          });
        } else {
          setAlert({ active: false, message: "", type: "" });
          gun.get(`~${user.is.pub}`).get("follows").get(alias).put(ack.put);
        }
      });
    }
    followInputRef.current.value = "";
  };

  const deleteFollower = (alias) => {
    gun.get(`~${user.is.pub}`).get("follows").get(alias).put(null);
  };

  return (
    <>
      <div>
        {alert.active ? (
          <Alert color={`${alert.type}`}>{alert.message}</Alert>
        ) : null}
        <label>Followed</label>
        <input ref={followInputRef} />
        <button onClick={addFollower}>Add</button>
      </div>
      <br />
      <ul>
        {Object.keys(followed).map((key) => (
          <li key={followed[key]}>
            {key} ({followed[key]})
            <button onClick={() => deleteFollower(key)}>Del</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Follow;
