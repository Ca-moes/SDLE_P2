import React, { useState, useEffect, useRef } from "react";

function Todo({ gun }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef()


  const qlq = async () => {
    let tempItems = []
    await gun.get('todos').map().once((data) => {
      if (data !== null) tempItems.push({time: data.time, value: data.value})
    });
    console.log("tempItems", [...tempItems])
    setItems(tempItems);
    console.log("items in useEffect", [...items])
  }
  
  useEffect(() => {
    qlq()

    gun.get('todos').off();
  }, [])

  const add = () => {
    const curr_time = Date.now()
    gun.get("todos").get(`${curr_time}`)
    .put({ value: inputRef.current.value, time: curr_time });
    inputRef.current.value = "";
  }

  const handleDelete = (id) => {
    gun.get("todos").get(id).put(null)
  }

  console.log("items", [...items])

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

export default Todo;
