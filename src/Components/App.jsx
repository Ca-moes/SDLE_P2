import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import Profile from './Profile';


import GUN from 'gun/gun';
import 'gun/sea';

class App extends Component {
  constructor() {
    super();
    this.gun = GUN({file:'db/data.json', peers: ['https://sdle-relay.herokuapp.com/gun']});
    //this.gun = GUN({file:'db/data.json', peers: [`http://localhost:8765/gun`,});
    //this.gun = GUN({file:'db/data.json'});
    this.user = this.gun.user().recall({sessionStorage: true});
    window.gun = this.gun; //To have access to gun object in browser console
    window.user = this.user
  }
  
  render() {
    return (
      <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Login gun={this.gun} user={this.user}/>} />
          <Route path="/profile" element={<Profile gun={this.gun} user={this.user}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
  }
}

export default App;