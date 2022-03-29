import "./App.css";
import { useEffect, useState, useRef } from "react";

const ENDPOINT = "https://tc-todo-2022.herokuapp.com/todos";

//afegir todos
function AfegirToDo({ onToDoAdded }) {
  const titleRef = useRef();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        console.log(title);
        titleRef.current.value = "";
        fetch(ENDPOINT, {
          method: "POST",
          body: JSON.stringify({ title }), //{title: title}
          // headers: {
          //   "Content-type": "application/json; charset-UTF-8",
          // }, con los headers no reconoce el title????
        })
          .then((response) => response.json())
          .then((json) => onToDoAdded(json)); //actualitza la llista de ToDo's
      }}
    >
      <input ref={titleRef} />
      <input type="submit" value="Afegir ToDo" />
    </form>
  );
}

//llistar todos i marcar com completats quan fem click
function TodoItem({ todo, onUpdated }) {
  return (
    <li
      className={todo.completed ? "completed" : "pending"}
      onClick={() => {
        fetch(`${ENDPOINT}/${todo.id}`, {
          method: "POST",
          body: JSON.stringify({ completed: !todo.completed }), //????TENDRIA QUE SER COMPLETED TRUE
          // headers: {
          //   "Content-type": "application/json; charset-UTF-8",
          // }, con los headers no reconoce el title????
        })
          .then((response) => response.json())
          .then((json) => onUpdated(json));
      }}
    >
      {todo.title}
    </li>
  );
}

function getTodos() {
  return fetch(ENDPOINT).then((response) => response.json());
}

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos().then(setTodos);

    const intervalID = setInterval(() => {
      getTodos().then(setTodos);
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="App">
      <h1>Llistat de ToDo's</h1>
      <button onClick={() => getTodos().then(setTodos)}>Refresh</button>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdated={(updatedTodo) =>
              setTodos(
                todos.map((currentTodo) =>
                  currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo
                )
              )
            }
          />
        ))}
      </ul>
      <AfegirToDo onToDoAdded={(todo) => setTodos([...todos, todo])} />
      <pre>{JSON.stringify(todos, null, 2)}</pre>
    </div>
  );
}
