import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Timeline from './components/Timeline';
import Login from './components/Login';
import Logout from './components/Logout';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';

function isAuthenticated(nextState, replace) {
    return localStorage.getItem('auth-token') === null;

    // React Router V3 version, which has location.query.msg
    // if(localStorage.getItem('auth-token') === null){
    //     replace('/?msg=você precisa estar logado para acessar o endereço');
    // }
}

ReactDOM.render(
    (<Router>
        <Switch>
            <Route exact path="/" component={Login} />
            {/* React Router V3 Version */}
            {/* <Route path="/timeline" component={App} onEnter={isAuthenticated}/> */}

            {/* React Router V4 Version */}
            {/* @see: https://reacttraining.com/react-router/web/example/auth-workflow */}
            <Route path="/timeline" render={() => (
                isAuthenticated() ? (
                    <App />
                ) : (
                    <Redirect to="/?msg=Você precisa estar logado para acessar o endereço!" />
                )
            )} />
            <Route path="/logout" component={Logout} />
        </Switch>
    </Router>),
    document.getElementById('root')
);
registerServiceWorker();
