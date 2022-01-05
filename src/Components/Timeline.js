import React, { useState, useEffect, useRef } from "react";

function Timeline({ gun }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef()

  useEffect(() => {
    gun.get('todos').on((data) => {
      const values = Object.values(data).filter((item) => item !== null).map((item) => {
        const val = Object.values(item);
        return val.length === 1 ? val[0] : '';
      }).filter((item) => item !== '');
      
      let value;
      let time;
      
      const new_items = values.map((item) => {
        gun.get(item, (ack) => {
          value = ack.put.value;
          time = ack.put.time;
        });
        return ({'value': value, 'time': time});
      });
      
      setItems(new_items);
    });
    
    return () => {
      gun.get('todos').off();
    }
  }, [])

  const add = () => {
    const value = inputRef.current.value;
    const time = Date.now();
    gun.get("todos").get(time).put({value, time})
    inputRef.current.value = "";
  }

  const handleDelete = (time) => {
    gun.get("todos").get(time).put(null);
  }

  return (
    <>
      <div>
        <input ref={inputRef} />
        <button onClick={add}>Add</button>
      </div>
      <br />
      <ul>
        {items.map((item) => (
          <li key={item.time}>
            {item.value} ({item.time})
            <button onClick={() => handleDelete(item.time)}>Del</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Timeline;
