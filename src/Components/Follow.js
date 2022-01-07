import React, { useState, useEffect, useRef } from "react";
import { getUserPubKey, getOwnPubKey } from "../utils";

function Follow({ gun }) {
  const [followed, setFollowed] = useState([]);
  const followInputRef = useRef();

  useEffect(() => {    
    gun.get(getOwnPubKey(gun)).get('followed').on((data) => {
        const values = Object.values(data).filter((item) => item !== null).map((item) => {
            const val = Object.values(item);
            return val.length === 1 ? val[0] : '';
        }).filter((item) => item !== '');
        let value;
        let alias;
        
        const new_followed = values.map((item) => {
            gun.get(item, (ack) => {
                value = ack.put.value;
                alias = ack.put.alias;
            });
            return ({value, alias});
        });
        
        setFollowed(new_followed);
    });
    
    return () => {
      gun.get(getOwnPubKey(gun)).get('followed').off();
    }
  }, [])

  const add = () => {
    const alias = followInputRef.current.value;
    const value = getUserPubKey(gun, alias);
    gun.get(getOwnPubKey(gun)).get('followed').get(alias).put({value, alias});
    followInputRef.current.value = "";
  }

  const handleDelete = (alias) => {
    gun.get(getOwnPubKey(gun)).get('followed').get(alias).put(null);
  }

  return (
    <>
      <div>
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
