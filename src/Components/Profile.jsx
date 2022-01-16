import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import Navbar  from "react-bootstrap/Navbar";
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast'
import ToastBody from 'react-bootstrap/ToastBody'
import  ToastHeader  from "react-bootstrap/ToastHeader";
import { Form } from "react-bootstrap";

export default function Profile({ gun, user }) {
  const [currAlias, setCurrAlias] = useState("");
  const [items, setItems] = useState({}); // {1234: 'item1', 5678: 'item2'}
  const [followed, setFollowed] = useState([]);
  const [followTimelines, setFollowTimelines] = useState({}); // {alias : { ev: _ev, items: {1234: 'item1', 5678: 'item2'}}}
  const followTimelinesRef = useRef();
  const [alert, setAlert] = useState({ active: false, message: "", type: "" });

  const timelineInputRef = useRef();
  const followInputRef = useRef();

  const navigate = useNavigate();

  let ev_own = null;
  let ev_followList = null;
  followTimelinesRef.current = followTimelines;

  const handlerFollowList = (value, key, _msg, _ev) => {
    console.log("Em callback handlerFollowList");
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
    console.log("Em callback handlerFollowListMessages", value);
    if (value === undefined)
      return

    let followList = {};
    Object.entries(value)
      .filter((item) => item[0] !== "_")
      .forEach((item) => {
        if (item[1] !== null) followList[item[0]] = item[1];
      });

    // With once, might not need to use ref
    console.log("followList:", followList);

    // Adds a subscription if new alias appears in followList
    for (let alias in followList) {
      console.log("Criou subscribe para:", alias);
      gun
        .get(`~${followList[alias]}`)
        .get("timeline")
        .on((value, key, _msg, _ev) => {
          console.log("Value em sub", value);
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

  const addFollower = () => {
    const alias = followInputRef.current.value;
    if (alias === currAlias) {
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
          // add subscription
          gun
            .get(`~${ack.put}`)
            .get("timeline")
            .on((value, key, _msg, _ev) => {
              console.log("Value em sub???", value);
              let new_items = {};
              console.log("Value em sub 2", value);
              Object.entries(value)
                .filter((item) => item[0] !== "_")
                .forEach((item) => {
                  if (item[1] !== null) new_items[item[0]] = item[1];
                });
              console.log("alive?"); 
              let newFollowTimelines = {
                ...followTimelinesRef.current,
                [alias]: { ev: _ev, items: new_items },
              };
              console.log("setFollowTimelines com ", newFollowTimelines);
              setFollowTimelines(newFollowTimelines);
            });
        }
      });
    }
    followInputRef.current.value = "";
  };

  const deleteFollower = (alias) => {
    gun.get(`~${user.is.pub}`).get("follows").get(alias).put(null);
    // remove subscription
    followTimelines[alias].ev.off();
    let tempState = { ...followTimelines };
    delete tempState[alias];
    setFollowTimelines(tempState);
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

  const organizeFollows = (timelines) => {
    let followItems = []
    Object.keys(followTimelines).map((alias)=>{
      Object.keys(followTimelines[alias].items).map((key)=>{
        followItems.push({alias, key, value: followTimelines[alias].items[key]})
      })
    })
    return followItems
  }


  useEffect(() => {
    console.log("useEffect de followTimelines", followTimelines)
  }, [followTimelines])

  useEffect(() => {
    console.log("Start of useEffect()");
    gun.user().once((data) => setCurrAlias(data.alias));
    gun.get(`~${user.is.pub}`).get("timeline").on(handlerTimeline); // get current messages and sub to updates
    gun.get(`~${user.is.pub}`).get("follows").once(handlerFollowListMessages);
    gun.get(`~${user.is.pub}`).get("follows").on(handlerFollowList);
    return () => {
      ev_own.off();
      ev_followList.off();
      Object.values(followTimelines).forEach((item) => item.ev.off());
    };
  }, []);

  return (
    <>
     
     <Navbar bg="dark" variant="dark">

     <Container className="d-flex justify-content-between">
     <Navbar.Brand href="#home">DOT</Navbar.Brand>
      <Dropdown as={ButtonGroup} onSelect={console.log('ola')}>
        <Button variant="success">{currAlias}</Button>

        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

        <Dropdown.Menu >
          <Dropdown.Item >About</Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item >Logout</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    </Container>
  </Navbar>
  <div className="container mt-4">
      <div className="d-flex justify-content-center gap-2">
      {/* <div>
        {alert.active ? (
          <Alert variant={`${alert.type}`}>{alert.message}</Alert>
        ) : null}
        <Form>
          <Form.Group>
            <Form.Label>Followed</Form.Label>
            <Form.Control ref={followInputRef} />
            <Button onClick={addFollower}>Add</Button>
          </Form.Group>
        </Form>
        
        
      </div> */}
      {/* <br /> */}
      {/* <ul>
        {Object.keys(followed).map((key) => (
          <li key={followed[key]}>
            {key} ({followed[key]})
            <Button onClick={() => deleteFollower(key)}>Del</Button>
          </li>
        ))}
      </ul> */}
        <div className="col-3 bg-dark p-4 rounded justify-content-between">

        </div>

        <div className="col-6 bg-dark p-4 rounded justify-content-between">
          <Form>
            <ButtonGroup className="w-100">
            <Form.Control
            ref={timelineInputRef}
                placeholder="Write what you think..." 
            />

              <Button onClick={addItem}>Add</Button>
            </ButtonGroup>
          </Form>
            <ul>
              {Object.keys(items).map((key) => (
                <Toast key={key}>
                <ToastHeader 
                closeButton="true"
                closeLabel="Close"
                >
                  {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
                  <strong className="me-auto">Bootstrap</strong>
                  <small>{key}</small>
                </ToastHeader>
                <ToastBody>{items[key]} </ToastBody>
              
              </Toast>
              ))}
            </ul>
            <ul>
              {organizeFollows(followTimelines).map((entry) => (
                <li key={entry.key}>
                  {entry.alias} : {entry.value} ({entry.key})
                </li>
              ))}

            </ul>
          </div>
          <div className="col-3 bg-dark p-4 rounded justify-content-between">
          
        </div>
          
        </div>

      </div>
  
    </>

  );
}
