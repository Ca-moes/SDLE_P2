import React, { useState, useEffect, useRef } from "react";
import { Button, Alert } from "reactstrap";
import { useNavigate } from "react-router";

export default function Profile({ gun, user }) {
  const [currAlias, setCurrAlias] = useState("");
  const [items, setItems] = useState({});
  const [followed, setFollowed] = useState([]);
  const [followTimelines, setFollowTimelines] = useState({})
  const followTimelinesRef = useRef()
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });

  const timelineInputRef = useRef();
  const followInputRef = useRef();

  const navigate = useNavigate();

  let ev_own = null;
  let ev_followList = null;
  followTimelinesRef.current = followTimelines

  // Tratará de adicionar ou retirar subscrições a quem está followed
  const handlerFollowList = (value, key, _msg, _ev) => {
    ev_followList = _ev;
    let followList = {};
    Object.entries(value)
      .filter((item) => item[0] != "_")
      .forEach((item) => {
        if (item[1] != null) followList[item[0]] = item[1];
      });
    setFollowed(followList);
    
    let currentFollowTimelines = {...followTimelinesRef.current}
    // todo por cada follow em followTimelines, vê se está em new Follow
    // se estiver deixa estar 
    // se não estiver, remove a subscrição
    for (let alias in currentFollowTimelines){
      if (!(alias in followList)){
        currentFollowTimelines[alias].ev.off()
        gun.get(`~${followList[alias]}`).get("timeline").off()
        delete currentFollowTimelines[alias]
        setFollowTimelines(currentFollowTimelines)
      }
    }

    // Por cada follower em newFollow, vê se tem uma entrada em followTimeLines
    // se tiver, não faz nada
    // se não tiver, adiciona uma subscrição à timeline
    for (let alias in followList){
      if (!(alias in currentFollowTimelines)){
        gun.get(`~${followList[alias]}`).get("timeline").on(
          (value, key, _msg, _ev) => {
            let new_items = {};
            Object.entries(value)
              .filter((item) => item[0] != "_")
              .forEach((item) => {
                if (item[1] != null)
                  new_items[item[0]] = item[1]
              });
            let newFollowTimelines = {...followTimelinesRef.current, ...{[alias]: {ev: _ev, items: new_items}}}
            setFollowTimelines(newFollowTimelines)
          }
        )
      }
    }
  };

  const handlerTimeline = (value, key, _msg, _ev) => {
    ev_own = _ev;
    let new_items = {};
    Object.entries(value)
      .filter((item) => item[0] != "_")
      .forEach((item) => {
        if (item[1] != null) new_items[item[0]] = item[1];
      });

    setItems(new_items);
  };

  const addFollower = () => {
    const alias = followInputRef.current.value;
    if (alias == currAlias) {
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

  const addItem = () => {
    const value = timelineInputRef.current.value;
    const time = Date.now();
    gun.get(`~${user.is.pub}`).get("timeline").get(time).put(value);
    timelineInputRef.current.value = "";
  };

  const deleteItem = (time) => {
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

  useEffect(() => {
    gun.user().once((data) => setCurrAlias(data.alias));
    gun.get(`~${user.is.pub}`).get("timeline").on(handlerTimeline); // get current messages and sub to updates
    gun.get(`~${user.is.pub}`).get("follows").on(handlerFollowList);
    return () => {
      ev_own.off();
      ev_followList.off();
      Object.values(followTimelines).forEach(item => item.ev.off())
    };
  }, []);

  return (
    <>
      <h1>Hello {currAlias}</h1>

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

      <div className="container mt-4">
        <h1>Items list</h1>
        <div className="d-flex flex-row justify-content-between align-items-start">
          <div>
            <div>
              <input ref={timelineInputRef} />
              <button onClick={addItem}>Add</button>
            </div>
            <ul>
              {Object.keys(items).map((key) => (
                <li key={key}>
                  {items[key]} ({key})
                  <button onClick={() => deleteItem(key)}>Del</button>
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
