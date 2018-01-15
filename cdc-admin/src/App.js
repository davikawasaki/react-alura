import React, { Component } from 'react';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery';
import CustomizedInput from './components/CustomizedInput';
import CustomizedSubmitButton from './components/CustomizedSubmitButton';

class App extends Component {
  constructor() {
    super();
    this.state = {list: [], name: '', email: '', password: ''};
    this.sendForm = this.sendForm.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: "http://localhost:8080/api/autores",
      dataType: 'json',
      success: function(ans) {
        console.log("Received async answer");
        this.setState({list:ans});
      }.bind(this)
    });
  }

  sendForm(event) {
    event.preventDefault();
    $.ajax({
      url: "http://localhost:8080/api/autores",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({nome: this.state.name, email: this.state.email, senha: this.state.password}),
      success: function(ans) {
        this.setState({list: ans});
      }.bind(this),
      error: function(err) {
        console.error("Error at sending new author");
      }
    });
  }

  setName(event) {
    this.setState({name: event.target.value});
  }

  setEmail(event) {
    this.setState({email: event.target.value});
  }

  setPassword(event) {
    this.setState({password: event.target.value});
  }

  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
            <span></span>
        </a>

        <div id="menu">
            <div className="pure-menu">
                <a className="pure-menu-heading" href="#">Company</a>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livro</a></li>
                </ul>
            </div>
        </div>

        <div id="main">
          <div className="header">
            <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <div className="pure-form pure-form-aligned">
              {/* Synthetic event: map DOM real events
                  @see: https://reactjs.org/docs/events.html */}
              <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} method="post">
                <CustomizedInput id="name" type="text" name="name" value={this.state.name} onChange={this.setName} label="Nome"/>
                <CustomizedInput id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email"/>
                <CustomizedInput id="password" type="password" name="password" value={this.state.password} onChange={this.setPassword} label="Senha"/>
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
                    this.state.list.map(function(author) {
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
          </div>
        </div>            
      </div>
    );
  }
}

export default App;
