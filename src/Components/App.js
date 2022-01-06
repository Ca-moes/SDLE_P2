import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import Timeline from './Timeline'


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
      <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Login gun={this.gun} user={this.user}/>} />
          <Route path="/signup" element={<SignUp gun={this.gun} user={this.user}/>} />
          <Route path="/timeline" element={<Timeline gun={this.gun} user={this.user}/>} />
        </Route>
      </Routes>
    </BrowserRouter>

    );
  }
}

export default App;