import React, { useEffect, useState } from 'react';
import './App.scss';
import Register from './components/Register/Register';
import Nav from "./components/Navigation/Nav"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './components/Login/Login';
import { ToastContainer, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Users from './components/ManageUsers/Users';
import _ from "lodash";
function App() {
  const [account, setAccount] = useState({});
  useEffect(() => {
    let session = sessionStorage.getItem("account");
    if (session) {
      setAccount(JSON.parse(session));
    }
  }, []);
  return (
    <>
      <Router>
        <div className='app-container'>
          {account && !_.isEmpty(account) && account.isAuthenticated && <Nav />}
          {/*  */}
          <Switch>
            <Route path="/news">
              news
            </Route>
            <Route path="/contact">
              contact
            </Route>
            <Route path="/about">
              about
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/users">
              < Users />
            </Route>
            <Route path="/" exact>
              home
            </Route>
            <Route path="*">
              404 not found
            </Route>
          </Switch>

        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </Router>
    </>
  );
}

export default App;
