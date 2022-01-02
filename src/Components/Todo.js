import React, { useState, useEffect, useRef } from "react";
import "gun/lib/open";

function Todo({ gun }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef()

  useEffect(() => {
    gun.get('todos').open((data) => {
      const initial_items = Object.values(data)
        .filter((item) => !!item);

      setItems(initial_items);
    });

    return () => {
      gun.get('todos').off();
    }
  }, [])

  const add = () => {
    const name = inputRef.current.value;
    const randomId = `id_${Date.now()}`;
    gun.get("todos").get(randomId).put({ name, id: randomId });
    inputRef.current.value = "";
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
          <li key={item.id}>
            {item.name} ({item.id})
          </li>
        ))}
      </ul>
    </>
  );
}

export default Todo;
