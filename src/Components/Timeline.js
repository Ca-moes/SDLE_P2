import React, { useState, useEffect, useRef } from "react";
import Follow from "./Follow";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";

function Timeline({ gun, user }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    async function get_items(nodes) {
      let items = [];
      for (let node_id of nodes) {
        let node = await gun
          .get(`~${user.is.pub}`)
          .get("timeline")
          .get(node_id, (ack) => ack.put);
        if (node != null)
          items.push({ value: node.value, time: node.time });
      }
      setItems(items);
    }

    gun
      .get(`~${user.is.pub}`)
      .get("timeline")
      .on((data) => {
        let nodes = Object.entries(data)
          .filter((item) => item[0] != "_")
          .map((item) => item[0]);

        get_items(nodes);
      });

    return () => {
      gun.get(`~${user.is.pub}`).get("timeline").off();
    };
  }, []);

  const add = () => {
    const value = inputRef.current.value;
    const time = Date.now();
    gun.get(`~${user.is.pub}`).get("timeline").get(time).put({ value, time });
    inputRef.current.value = "";
  };

  const handleDelete = (time) => {
    gun.get(`~${user.is.pub}`).get("timeline").get(time).put(null);
  };

  const logout = () => {
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
              {items.map((item) => (
                <li key={item.time}>
                  {item.value} ({item.time})
                  <button onClick={() => handleDelete(item.time)}>Del</button>
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
