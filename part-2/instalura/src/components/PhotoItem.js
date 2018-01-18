import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PhotoUpdates extends Component {
    render() {
        return (
            <section className="fotoAtualizacoes">
              <a href="#" className="fotoAtualizacoes-like">Likar</a>
              <form className="fotoAtualizacoes-form">
                <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo"/>
                <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
              </form>

            </section>            
        );
    }
}

class PhotoInfo extends Component {
    render() {
      let likers = '';
      if(this.props.photo.likers.length > 0) likers = 'curtiram';
      return (
          <div className="foto-in fo">
            <div className="foto-info-likes">
              {
                this.props.photo.likers.map(liker => {
                  return (<Link key={liker.id} to={`/timeline/${liker.login}`}>{liker.login},</Link>)
                })
              }
              {likers}
            </div>

            <p className="foto-info-legenda">
              <a className="foto-info-autor">autor </a>
              {this.props.photo.comentario}
            </p>

            <ul className="foto-info-comentarios">
              {
                this.props.photo.comentarios.map(comentario => {
                  return (
                    <li key={comentario.id} className="comentario">
                      <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                      {comentario.texto}
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
            <PhotoUpdates/>
          </div>            
        );
    }
}