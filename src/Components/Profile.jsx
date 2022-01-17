import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import Navbar from "react-bootstrap/Navbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastBody from "react-bootstrap/ToastBody";
import ToastHeader from "react-bootstrap/ToastHeader";
import { Form, Badge, ListGroup } from "react-bootstrap";
import holder from "../../src/Assets/holder.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faDotCircle,
  faPaperPlane,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Profile({ gun, user }) {
  const [currAlias, setCurrAlias] = useState("");
  const [items, setItems] = useState({}); // {1234: 'item1', 5678: 'item2'}
  const [followed, setFollowed] = useState({});
  const [toFollow, setToFollow] = useState({});
  const [followTimelines, setFollowTimelines] = useState({}); // {alias : { ev: _ev, items: {1234: 'item1', 5678: 'item2'}}}
  const followTimelinesRef = useRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });
  const [newItemCounter, setNewItemCounter] = useState(0);

  const timelineInputRef = useRef();
  const followInputRef = useRef();

  const navigate = useNavigate();

  let ev_own = null;
  let ev_followList = null;
  let ev_toFollowList = null;
  followTimelinesRef.current = followTimelines;

  const handlerToFollowList = (value, key, _msg, _ev) => {
    let toFollowList = {};
    ev_toFollowList = _ev;

    Object.entries(value).forEach((item) => {
      if (
        item[1] !== null &&
        item[0] !== "_" &&
        item[1] !== user.is.pub &&
        !(item[0] in followed)
      )
        toFollowList[item[0]] = item[1];
    });


    setToFollow(toFollowList);
  };

  const handlerFollowList = (value, key, _msg, _ev) => {
    ev_followList = _ev;
    let followList = {};
    let valueCopy = { ...value };
    Object.entries(valueCopy)
      .filter((item) => item[0] !== "_")
      .forEach((item) => {
        if (item[1] !== null) followList[item[0]] = item[1];
      });
    setFollowed(followList);
  };

  // Adds subscriptions at beginning
  const handlerFollowListMessages = (value) => {
    if (value === undefined) return;

    let followList = {};
    Object.entries(value)
      .filter((item) => item[0] !== "_")
      .forEach((item) => {
        if (item[1] !== null) followList[item[0]] = item[1];
      });

    // Adds a subscription if new alias appears in followList
    for (let alias in followList) {
      gun
        .get(`~${followList[alias]}`)
        .get("timeline")
        .on((value, key, _msg, _ev) => {
          let new_items = {};
          Object.entries(value)
            .filter((item) => item[0] !== "_")
            .forEach((item) => {
              if (item[1] !== null) new_items[item[0]] = item[1];
            });
          let newFollowTimelines = {
            ...followTimelinesRef.current,
            [alias]: { ev: _ev, items: new_items },
          };
          setFollowTimelines(newFollowTimelines);
        });
    }
  };

  const handlerTimeline = (value, key, _msg, _ev) => {
    ev_own = _ev;
    let new_items = {};
    Object.entries(value)
      .filter((item) => item[0] !== "_")
      .forEach((item) => {
        if (item[1] !== null) new_items[item[0]] = item[1];
      });

    setItems(new_items);
  };

  const addFollower = (alias) => {
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
        // add subscription
        gun
          .get(`~${ack.put}`)
          .get("timeline")
          .on((value, key, _msg, _ev) => {
            let new_items = {};

            Object.entries(value)
              .filter((item) => item[0] !== "_")
              .forEach((item) => {
                if (item[1] !== null) new_items[item[0]] = item[1];
              });

            let newFollowTimelines = {
              ...followTimelinesRef.current,
              [alias]: { ev: _ev, items: new_items },
            };

            setFollowTimelines(newFollowTimelines);
          });
      }
    });
  };

  const deleteFollower = (alias) => {
    gun.get(`~${user.is.pub}`).get("follows").get(alias).put(null);
    // remove subscription
    followTimelines[alias].ev.off();
    let tempState = { ...followTimelines };
    delete tempState[alias];
    setFollowTimelines(tempState);
  };

  const addItem = (e) => {

    e.preventDefault();
    const value = timelineInputRef.current.value;

    if (value != "" && newItemCounter <=150) {
      const time = Date.now();
      gun.get(`~${user.is.pub}`).get("timeline").get(time).put(value);
      timelineInputRef.current.value = "";

      setNewItemCounter(0);
    }

    
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

  const organizeFollows = () => {
    let followItems = [];
    Object.keys(followTimelines).map((alias) => {
      Object.keys(followTimelines[alias].items).map((key) => {
        followItems.push({
          alias,
          key,
          value: followTimelines[alias].items[key],
        });
      });
    });

    //add current user timeline
    Object.entries(items).map((item) =>
      followItems.push({ alias: currAlias, key: item[0], value: item[1] })
    );

    followItems.sort((a, b) => {
      return b["key"] - a["key"];
    });

    return followItems;
  };

  const organizeToFollow = (newFollowed, newToFollow) => {
    let toFollowItems = [];

    Object.keys(newToFollow).forEach((alias) => {
      if(!(alias in Object.keys(newFollowed))){
        toFollowItems.push(alias)
      }
    })
    console.log(newFollowed, newToFollow)
    return toFollowItems;
  }

  useEffect(() => {
    gun.user().once((data) => setCurrAlias(data.alias));
    gun.get(`~${user.is.pub}`).get("timeline").on(handlerTimeline); // get current messages and sub to updates
    gun.get(`~${user.is.pub}`).get("follows").once(handlerFollowListMessages);
    gun.get(`~${user.is.pub}`).get("follows").on(handlerFollowList);
    gun.get("users").on(handlerToFollowList);
    return () => {
      ev_own.off();
      ev_followList.off();
      ev_toFollowList.off();
      Object.values(followTimelines).forEach((item) => item.ev.off());
    };
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand href="/">
            <h1><FontAwesomeIcon icon={faDotCircle} /> Dot</h1>
          </Navbar.Brand>
          <Button onClick={logout} variant="danger">
            Logout
          </Button>
        </Container>
      </Navbar>
      <div className="container mt-4">
        <div className="h-100 d-flex justify-content-center gap-2">
          <div className="col-3 bg-dark p-4 rounded justify-content-between">
            <h3 className="text-white">@{currAlias}</h3>
            <Button className="mt-2" variant="light">
              Followed&nbsp;
              <Badge bg="dark text-light">{Object.keys(followed).length}</Badge>
            </Button>

            <ListGroup className="mt-2">
              {Object.keys(followed).map((key) => (
                <ListGroup.Item
                  key={followed[key]}
                  className="d-flex justify-content-between align-items-center"
                >
                  {key}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteFollower(key)}
                  >
                    <FontAwesomeIcon icon={faUserTimes} />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="col-6 bg-dark p-4 rounded justify-content-between">
            <Form onSubmit={addItem}>
              <ButtonGroup className="w-100">
                <Form.Control
                  ref={timelineInputRef}
                  placeholder="Write what you think..."
                  onChange={()=>setNewItemCounter(timelineInputRef.current.value.length)}
                />
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </ButtonGroup>
              <span className={`${newItemCounter>150?'text-danger':'text-secondary'} mt-4 `}>{newItemCounter}/150</span>
            </Form>
            <div>
              {organizeFollows().map((entry) => (
                <Toast
                  className="w-100 mt-3"
                  key={entry["key"]}
                  onClose={() => deleteItem(entry["key"])}
                >
                  <ToastHeader
                    closeButton={currAlias === entry["alias"] ? true : false}
                    closeLabel="Close"
                  >
                    {/* <img src={holder} className="rounded me-2" alt="" /> */}
                    <strong className="me-auto">{entry["alias"]}</strong>
                    <small>
                      {new Date(entry["key"] * 1).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </small>
                  </ToastHeader>
                  <ToastBody>{entry["value"]} </ToastBody>
                </Toast>
              ))}
            </div>
          </div>
          <div className="col-3 bg-dark p-4 rounded justify-content-between">
            <div>
              {alert.active ? (
                <Alert variant={`${alert.type}`}>{alert.message}</Alert>
              ) : null}
              <ListGroup className="mt-2">
                {organizeToFollow(followed, toFollow).map((key) => 
                  <ListGroup.Item
                      key={key}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {key}
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => addFollower(key)}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                      </Button>
                    </ListGroup.Item>
                  
                )}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
