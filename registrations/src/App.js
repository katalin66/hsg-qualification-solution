import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./App.scss";
import Admin from "./Admin";
import RegisterForm from "./components/RegisterForm";
import EditForm from "./components/EditForm"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/users/new">
          <RegisterForm />
        </Route>
        <Route path="/users/edit/:id">
          <EditForm />
        </Route>
        <Route path="/">
          <Admin />
        </Route>
      </Switch>
    </Router>)
}

export default App
