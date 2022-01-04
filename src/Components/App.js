import React, { Component } from 'react'
// import Todo from './Todo'
// import Timeline from './Timeline';
// import Auth from './Auth';

import GUN from 'gun/gun';
import 'gun/sea';

class App extends Component {
  constructor() {
    super();
    this.gun = GUN({file:'db/data.json'})
    this.user = this.gun.user()
    window.gun = this.gun; //To have access to gun object in browser console
    window.user = this.user
  }
  
  render() {
    return (
      <>
        <h1>Todo</h1>
        {/* <Todo gun={this.gun}/> */}
        <hr />
        {/* <h1>Timeline</h1>
        <Timeline gun={this.gun}/> */}
        {/* <hr />
        <h1>Auth</h1>
        <Auth gun={this.gun} user={this.user}/> */}
      </>
    );
  }
}

export default App;