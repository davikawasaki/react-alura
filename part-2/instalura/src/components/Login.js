import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class Login extends Component {
    constructor(props) {
        super(props);
        // Using 3rd-party library
        this.state = {msg: queryString.parse(this.props.location.search).msg}

        // Using URLSearchParams
        // let msg = '';
        // const queryParams = new URLSearchParams(props.location.search);
        // const queryMsg = queryParams.get('msg');
        // if(queryMsg) msg = queryMsg;
        // this.state = {msg: msg};
    }

    send(event) {
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({login: this.login.value, senha: this.password.value}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch('http://localhost:8080/api/public/login', requestInfo)
            .then(response => {
                if(response.ok) return response.text();
                else throw new Error('Não foi possível fazer o login com esses dados.');
            })
            .then(token => {
                localStorage.setItem('auth-token', token);
                // React Router V3 Version
                // browserHistory.push('/timeline');
                // React Router V4 Version
                this.props.history.push('/timeline');
            })
            .catch(err => this.setState({msg: err.message}));
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.send.bind(this)}>
                    <input type="text" ref={input => this.login = input}/>
                    <input type="password" ref={input => this.password = input}/>
                    <input type="submit" value="login"/>
                </form>
            </div>
        );
    }
}

export default withRouter(Login);