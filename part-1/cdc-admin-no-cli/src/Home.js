import React, { Component } from './lib/react.js';

export default class Home extends Component {
    render() {
        return (
            <div>        
              <div className="header">
                <h1>Bem vindo ao sistema</h1>
              </div>
              <div className="content" id="content">                              
              </div>
            </div>
        );
    }
}