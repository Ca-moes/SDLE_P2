import React, { Component } from 'react'
// import Gun from 'gun/gun'
import Todos from './Todos'
import Chat from './Chat'
import Json from './Json'
import Todo from './Todo'

const GUN = require('gun');


class App extends Component {
  constructor() {
    super();
    // 
    this.gun = GUN({file:'db/data.json'})
    window.gun = this.gun; //To have access to gun object in browser console
  }
  
  render() {
    return (
      <div>
        <h1>React Examples</h1>
        {/* <h2>Todo</h2>
        <Todos gun={this.gun} />
        <br />
        <hr /> 
        <h2>Chat</h2>
        <Chat gun={this.gun} />
        <br />
        <hr />
        <h2>Json</h2>
        <Json gun={this.gun} />
        <br />
        <hr /> */}
        <h2>Todo v2</h2>
        <Todo gun={this.gun}/>
      </div>
    );
  }
}

export default App;