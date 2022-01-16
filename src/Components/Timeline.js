import React, { useState, useEffect, useRef } from "react";
import Follow from "./Follow";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";

function Timeline({ gun, user }) {
  const [currAlias, setCurrAlias] = useState('');
  const [items, setItems] = useState({});
  const [followTimelines, setFollowTimelines] = useState({})
  const inputRef = useRef();
  const navigate = useNavigate();
  let ev_own = null;

  const handler_own = (value, key, _msg, _ev) => {
    ev_own = _ev;
    let new_items = {};
    Object.entries(value)
      .filter((item) => item[0] != "_")
      .forEach((item) => {
        if (item[1] != null)
          new_items[item[0]] = item[1]
      });

    setItems(new_items);
  };


  const handler_initial_follow = async (value, key) => {
    delete value._
    for (const [alias, pubkey] of Object.entries(value)) {

      gun.get(`~${pubkey}`).get("timeline").on((value, key, _msg, _ev) => {
        let new_items = {};
        Object.entries(value)
          .filter((item) => item[0] != "_")
          .forEach((item) => {
            if (item[1] != null)
              new_items[item[0]] = item[1]
          });

        console.log('following:', new_items)
        console.log('followTimelines:', followTimelines)
        if (alias in followTimelines) {
          // update existing record
          console.log("alias in followTimelines")
        } else {
          // add new record
          // this should append to existing state, otherwise a copy of the current state needs to be made
          // and the copy should be changed and sent to setState https://stackoverflow.com/a/38528513

          const newState = Object.assign({}, followTimelines, {
            [alias]: {
              ev: _ev,
              items: new_items
            }
          })

          setFollowTimelines(newState)
          console.log("new followTimeLines ", followTimelines)
        }
      })

    }
  }

  const handler_follows = (value, key, _msg, _ev) => {
    console.log(value)
  }

  useEffect(() => {
    gun.user().once(data => setCurrAlias(data.alias))
    gun.get(`~${user.is.pub}`).get("timeline").on(handler_own);  // get current messages and sub to updates
    gun.get(`~${user.is.pub}`).get("follows").once(handler_initial_follow);  // get current messages of follows, subs to their timelines
    gun.get(`~${user.is.pub}`).get("follows").on(handler_follows, true);  // subscribes to changes on list of following
    return () => {
      ev_own.off();
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
      <h1>Hello {currAlias}</h1>
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
