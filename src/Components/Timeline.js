import React, { useState, useEffect, useRef } from "react";

function Timeline({ gun }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef()

  useEffect(() => {
    gun.get('todos').on((data) => {
      const ids = Object.keys(data).filter((item) => item !== '_');
      console.log(ids);
      let value;
      let time;
      
      const new_items = ids.map((item) => {
        gun.get("todos/"+item, (ack) => {
          console.log(ack.put);
          value = ack.put.value;
          time = ack.put.time;
        });
        return ({'value': value, 'time': time});
      });
      
      console.log(new_items);
      
      setItems(new_items);
    });
    
    return () => {
      gun.get('todos').off();
    }
  }, [])

  const add = () => {
    const value = inputRef.current.value;
    const time = Date.now();
    gun.get("todos").get(time.toString()).put({value, time})
    inputRef.current.value = "";
  }

  const handleDelete = (id) => {
    gun.get("todos").get(id).put(null)
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
