import React, { useState, useEffect, useRef } from "react";
import { getUserPubKey } from "../utils";
import { Alert } from "reactstrap";

function Follow({ gun, user }) {
  const [followed, setFollowed] = useState([]);
  const followInputRef = useRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });

  useEffect(() => {
    gun
      .get(`~${user.is.pub}`)
      .get("followed")
      .on((data) => {
        const values = Object.values(data)
          .filter((item) => item !== null)
          .map((item) => {
            const val = Object.values(item);
            return val.length === 1 ? val[0] : "";
          })
          .filter((item) => item !== "");

        let value;
        let alias;

        const new_followed = values.map((item) => {
          gun.get(item, (ack) => {
            value = ack.put.value;
            alias = ack.put.alias;
          });
          return { value, alias };
        });

        setFollowed(new_followed);
      });
  }, []);

  const add = () => {
    const alias = followInputRef.current.value;
    console.log(followed.filter((item) => item.alias === alias).length);
    if (alias !== gun.user().is.alias) {
      if (followed.filter((item) => item.alias === alias).length === 0) {
        gun.get("users/" + alias, (ack) => {
          console.log(ack);
          if (ack.put === undefined) {
            setAlert({
              active: true,
              message: "Could't find user",
              type: "danger",
            });
          } else {
            setAlert({ active: false, message: "", type: "" });
            const value = ack.put.pubKey;
            gun
              .get(`~${user.is.pub}`)
              .get("followed")
              .get(alias)
              .put({ value, alias });
          }
        });
      } else {
        setAlert({
          active: true,
          message: "You already follow that user",
          type: "danger",
        });
      }
    } else {
      setAlert({
        active: true,
        message: "Can't follow yourself",
        type: "danger",
      });
    }
    followInputRef.current.value = "";
  };

  const handleDelete = (alias) => {
    gun.get(`~${user.is.pub}`).get("followed").get(alias).put(null);
  };

  return (
    <>
      <div>
        {alert.active ? (
          <Alert color={`${alert.type}`}>{alert.message}</Alert>
        ) : null}
        <label>Followed</label>
        <input ref={followInputRef} />
        <button onClick={add}>Add</button>
      </div>
      <br />
      <ul>
        {followed.map((item) => (
          <li key={item.value}>
            {item.alias} ({item.value})
            <button onClick={() => handleDelete(item.alias)}>Del</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Follow;
