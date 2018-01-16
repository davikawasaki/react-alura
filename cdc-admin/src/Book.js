import React, { Component } from 'react';
import $ from 'jquery';
import CustomizedInput from './components/CustomizedInput';
import CustomizedSubmitButton from './components/CustomizedSubmitButton';
import PubSub from 'pubsub-js';
import ErrorHandler from './ErrorHandler';

class BookForm extends Component {
    constructor() {
        super();
        this.state = {title: '', price: '', authorId: ''};
        this.sendForm = this.sendForm.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setAuthorId = this.setAuthorId.bind(this);
    }

    sendForm(event) {
        event.preventDefault();
        $.ajax({
            url: "http://localhost:8080/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo: this.state.title, preco: this.state.price, autorId: this.state.authorId}),
            success: function(newList) {
                // Callback from high-order component
                // this.props.callbackUpdateList(newList);
                PubSub.publish('update-books-list', newList);
                this.setState({title: '', price: '', authorId: ''});
            }.bind(this),
            error: function(err) {
                if(err.status === 400) new ErrorHandler().publishErrors(err.responseJSON);
                console.error("Error at sending new book");
            },
            beforeSend: function() {
                PubSub.publish('clear-errors', {});
            }
        });
    }

    setTitle(event) {
        this.setState({title: event.target.value});
    }

    setPrice(event) {
        this.setState({price: event.target.value});
    }

    setAuthorId(event) {
        this.setState({authorId: event.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
              {/* Synthetic event: map DOM real events
                  @see: https://reactjs.org/docs/events.html */}
              <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} method="post">
                <CustomizedInput id="title" type="text" name="titulo" value={this.state.title} onChange={this.setTitle} label="Título"/>
                <CustomizedInput id="price" type="text" name="preco" value={this.state.price} onChange={this.setPrice} label="Preço"/>
                <div className="pure-control-group">
                    <label htmlFor="autorId">Autor</label> 
                    <select value={this.state.authorId} name="autorId" id="autorId" onChange={this.setAuthorId}>
                        <option value="">Selecione Autor</option>
                        {
                            this.props.authors.map(function(author) {
                                return <option key={author.id} value={author.id}>{author.nome}</option>
                            })
                        }
                    </select>
                </div>
                <CustomizedSubmitButton label="Gravar"/>
              </form>             
            </div>
        );
    }
}

class BooksTable extends Component {
    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Preço</th>
                    <th>Autor</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.list.map(function(book) {
                      return (
                        <tr key={book.id}>
                          <td>{book.titulo}</td>
                          <td>{book.preco}</td>
                          <td>{book.autor.nome}</td>
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
export default class BookBox extends Component {
    constructor() {
        super();    
        this.state = {list: [], authors: []};
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: function(ans) {
                console.log("Received async answer");
                this.setState({list: ans});
            }.bind(this)
        });

        PubSub.subscribe('update-books-list', function(topic, newList) {
            this.setState({list: newList});
        }.bind(this));

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: function(ans) {
                console.log("Received async answer");
                this.setState({authors: ans});
            }.bind(this)
        });
    }

    updateList(newList) {
        this.setState({list: newList});
    }

    render() {
        return (
          <div>
            <div className="header">
                <h1>Cadastro de livros</h1>
            </div>
            <div className="content" id="content">     
                {/* High-order component with callback method */}
                {/* <AuthorForm callbackUpdateList={this.updateList} /> */}
                <BookForm authors={this.state.authors}/>
                <BooksTable list={this.state.list} />
            </div>
          </div>
        );
    }
}