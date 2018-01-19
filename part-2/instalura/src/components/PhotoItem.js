import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

class PhotoUpdates extends Component {

  constructor(props) {
    super(props);    
    this.state = {liked: this.props.photo.likeada};    
  }

  toLike(event) {
    event.preventDefault();
    fetch(`http://localhost:8080/api/fotos/${this.props.photo.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
      .then(response => {
        if(response.ok) return response.json();
        else throw new Error("Não foi possível realizar o like da foto!");
      })
      .then(liker => {
        this.setState({liked: !this.state.liked});
        // Property shorthand
        // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
        PubSub.publish('update-liker', {photoId: this.props.photo.id, liker});
      });
  }

  toComment(event) {
    event.preventDefault();

    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({texto: this.comment.value}),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    };

    fetch(`http://localhost:8080/api/fotos/${this.props.photo.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
      .then(response => {
        if(response.ok) return response.json();
        else throw new Error("Não foi possível comentar nessa foto!");
      })
      .then(newComment => {
        PubSub.publish('new-comments', {photoId: this.props.photo.id, newComment});
        this.comment.value = '';
      });
  }
  
  render() {
      return (
          <section className="fotoAtualizacoes">
            <a onClick={this.toLike.bind(this)} className={this.state.liked ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
            <form className="fotoAtualizacoes-form" onSubmit={this.toComment.bind(this)}>
              <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comment = input}/>
              <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
            </form>

          </section>            
      );
  }
}

class PhotoInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {likers: this.props.photo.likers, comments: this.props.photo.comentarios, label: ''};
  }

  changeQuantityLabel() {
    if(this.state.likers.length === 1) this.setState({label: 'curtiu'});
    else if(this.state.likers.length > 1) this.setState({label: 'curtiram'});
    else this.setState({label: ''});
  }

  componentWillMount() {
    PubSub.subscribe('update-liker', (topic, likerInfo) => {      
      if(this.props.photo.photoId === likerInfo.id) {
        const possibleLiker = this.state.likers.find(liker => liker.login === likerInfo.liker.login);
        if(possibleLiker === undefined) {
          const newLikers = this.state.likers.concat(likerInfo.liker);
          this.setState({likers: newLikers});
        } else {
          const newLikers = this.state.likers.filter(liker => liker.login !== likerInfo.liker.login);
          this.setState({likers: newLikers});
        }
      }
      this.changeQuantityLabel();
    });

    PubSub.subscribe('new-comments', (topic, commentInfo) => {      
      if(this.props.photo.id === commentInfo.photoId) {
        const newComments = this.state.comments.concat(commentInfo.newComment);
        this.setState({comments: newComments});
      }
    });
  }

  componentDidMount() {
    this.changeQuantityLabel();
  }

  render() {
    return (
        <div className="foto-in fo">
          <div className="foto-info-likes">
            {
              this.state.likers.map(liker => {                  
                return (<Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login}, </Link>)
              })
            }
            {this.state.label}
          </div>

          <p className="foto-info-legenda">
            <a className="foto-info-autor">autor </a>
            {this.props.photo.comentario}
          </p>

          <ul className="foto-info-comentarios">
            {
              this.state.comments.map(comentario => {
                return (
                  <li key={comentario.id} className="comentario">
                    <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                    <span> {comentario.texto}</span>
                  </li>
                );
              })
            }
          </ul>
        </div>            
    );
  }
}

class PhotoHeader extends Component {
  render() {
      return (
          <header className="foto-header">
            <figure className="foto-usuario">
              <img src={this.props.photo.urlPerfil} alt="foto do usuario"/>
              <figcaption className="foto-usuario">
                <Link to={`/timeline/${this.props.photo.loginUsuario}`}>
                  {this.props.photo.loginUsuario}
                </Link>  
              </figcaption>
            </figure>
            <time className="foto-data">{this.props.photo.horario}</time>
          </header>            
      );
  }
}

export default class PhotoItem extends Component {
  render() {
      return (
        <div className="foto">
          <PhotoHeader photo={this.props.photo}/>
          <img alt="foto" className="foto-src" src={this.props.photo.urlFoto}/>
          <PhotoInfo photo={this.props.photo}/>
          <PhotoUpdates photo={this.props.photo}/>
        </div>            
      );
  }
}