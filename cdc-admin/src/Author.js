import React, { Component } from 'react';
import $ from 'jquery';
import CustomizedInput from './components/CustomizedInput';
import CustomizedSubmitButton from './components/CustomizedSubmitButton';
// Publisher-Subscriber - Act as Middleware
// @see: https://github.com/mroderick/PubSubJS
import PubSub from 'pubsub-js';
import ErrorHandler from './ErrorHandler';

class AuthorForm extends Component {
    constructor() {
        super();
        this.state = {name: '', email: '', password: ''};
        this.sendForm = this.sendForm.bind(this);
        // this.setName = this.setName.bind(this);
        // this.setEmail = this.setEmail.bind(this);
        // this.setPassword = this.setPassword.bind(this);
    }

    sendForm(event) {
        event.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({nome: this.state.name, email: this.state.email, senha: this.state.password}),
            success: function(newList) {
                // Callback from high-order component
                // this.props.callbackUpdateList(newList);
                PubSub.publish('update-authors-list', newList);
                this.setState({name: '', email: '', password: ''});
            }.bind(this),
            error: function(err) {
                if(err.status === 400) new ErrorHandler().publishErrors(err.responseJSON);
                console.error("Error at sending new author");
            },
            beforeSend: function() {
                PubSub.publish('clear-errors', {});
            }
        });
    }

    // setName(event) {
    //     this.setState({name: event.target.value});
    // }

    // setEmail(event) {
    //     this.setState({email: event.target.value});
    // }

    // setPassword(event) {
    //     this.setState({password: event.target.value});
    // }

    saveInputUpdate(inputName, event) {
        let changedField = {};
        changedField[inputName] = event.target.value;
        this.setState(changedField);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
              {/* Synthetic event: map DOM real events
                  @see: https://reactjs.org/docs/events.html */}
              <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} method="post">
                <CustomizedInput id="name" type="text" name="nome" value={this.state.name} onChange={this.saveInputUpdate.bind(this,'name')} label="Nome"/>
                <CustomizedInput id="email" type="email" name="email" value={this.state.email} onChange={this.saveInputUpdate.bind(this,'email')} label="Email"/>
                <CustomizedInput id="password" type="password" name="senha" value={this.state.password} onChange={this.saveInputUpdate.bind(this,'password')} label="Senha"/>
                {/* <div className="pure-control-group">
                  <label htmlFor="nome">Nome</label> 
                  <input id="nome" type="text" name="nome" value=""  />                  
                </div>
                <div className="pure-control-group">
                  <label htmlFor="email">Email</label> 
                  <input id="email" type="email" name="email" value=""  />                  
                </div>
                <div className="pure-control-group">
                  <label htmlFor="senha">Senha</label> 
                  <input id="senha" type="password" name="senha"  />                                      
                </div> */}
                <CustomizedSubmitButton label="Gravar"/>
              </form>             
            </div>
        );
    }
}

class AuthorsTable extends Component {
    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.list.map(function(author) {
                      return (
                        <tr key={author.id}>
                          <td>{author.nome}</td>
                          <td>{author.email}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table> 
            </div>
        );
    }
}

/**
 * High-Order Component
 * Wrapper that encapsulate shared state, isolating interface from inner components.
 * @see: https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e
 */
export default class AuthorBox extends Component {
    constructor() {
        super();    
        this.state = {list: []};
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function(ans) {
                console.log("Received async answer");
                this.setState({list: ans});
            }.bind(this)
        });

        PubSub.subscribe('update-authors-list', function(topic, newList) {
            this.setState({list: newList});
        }.bind(this));
    }

    updateList(newList) {
        this.setState({list: newList});
    }

    render() {
        return (
          <div>
            <div className="header">
                <h1>Cadastro de autores</h1>
            </div>
            <div className="content" id="content">     
                {/* High-order component with callback method */}
                {/* <AuthorForm callbackUpdateList={this.updateList} /> */}
                <AuthorForm />
                <AuthorsTable list={this.state.list} />
            </div>
          </div>
        );
    }
}