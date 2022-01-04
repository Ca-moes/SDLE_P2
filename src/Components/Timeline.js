import React, { useState, useEffect, useRef } from "react";

function Timeline({ gun }) {
  const [items, setItems] = useState([]);
  const inputRef = useRef()

  useEffect(() => {
    gun.get('todos_set').open((data) => {
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
    gun.get("todos").set({ name, id: randomId });
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
          <li key={item.id}>
            {item.name} ({item.id})
            <button onClick={() => handleDelete(item.id)}>Del</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Timeline;
