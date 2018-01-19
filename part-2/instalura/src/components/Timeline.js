import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PhotoItem from './PhotoItem';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Container Component
// @see: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
class Timeline extends Component {

    constructor(props) {       
        super(props);
        this.state = {photos: []};
        this.login = this.props.login;
    }

    loadPhotos() {
        let urlProfile;
        if(this.login === undefined) urlProfile = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        else urlProfile = `http://localhost:8080/api/public/fotos/${this.login}`;
        fetch(urlProfile)
            .then(response => response.json())
            .then(photos => {
                this.setState({photos: photos});
                this.loadQuantityLabel();
            });
    }

    loadQuantityLabel() {
        this.state.photos.forEach(photo => {
            this.changeQuantityLabel(photo);
            this.setState({photos: this.state.photos});
        });
    }

    changeQuantityLabel(photo) {
        if(photo.likers.length === 1) photo.likeadaLabel = ' curtiu';
        else if(photo.likers.length > 1) photo.likeadaLabel = ' curtiram';
        else photo.likeadaLabel = '';
    }

    toLike(photoId) {
        fetch(`http://localhost:8080/api/fotos/${photoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
            .then(response => {
                if(response.ok) return response.json();
                else throw new Error("Não foi possível realizar o like da foto!");
            })
            .then(liker => {
                // Property shorthand
                // @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
                PubSub.publish('update-liker', {photoId, liker});
            });
    }

    toComment(photoId, commentText) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({texto: commentText}),
            headers: new Headers({
              'Content-type': 'application/json'
            })
        };
    
        fetch(`http://localhost:8080/api/fotos/${photoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if(response.ok) return response.json();
                else throw new Error("Não foi possível comentar nessa foto!");
            })
            .then(newComment => {
                PubSub.publish('new-comments', {photoId, newComment});
            });
    }

    componentDidMount() {
        this.loadPhotos();
    }

    componentWillMount() {
        PubSub.subscribe('timeline-search', (topic, newPhotos) => {
            // this.setState({photos: newPhotos.photos});
            this.props.history.push(`/timeline/${newPhotos.login}`);
        });

        PubSub.subscribe('update-liker', (topic, likerInfo) => {      
            const findedPhoto = this.state.photos.find(photo => photo.id === likerInfo.photoId);
            
            findedPhoto.likeada = !findedPhoto.likeada;
            const possibleLiker = findedPhoto.likers.find(liker => liker.login === likerInfo.liker.login);
            
            if(possibleLiker === undefined) findedPhoto.likers.push(likerInfo.liker);
            else {
                const newLikers = findedPhoto.likers.filter(liker => liker.login !== likerInfo.liker.login);
                findedPhoto.likers = newLikers;
            }
            
            this.changeQuantityLabel(findedPhoto);
            this.setState({photos: this.state.photos});
        });
      
        PubSub.subscribe('new-comments', (topic, commentInfo) => {
            const findedPhoto = this.state.photos.find(photo => photo.id === commentInfo.photoId);
            findedPhoto.comentarios.push(commentInfo.newComment);
            this.setState({photos: this.state.photos});
        });
    }

    componentWillReceiveProps(nextProps) {        
        // if(nextProps.login !== undefined) this.login = nextProps.login;
        this.login = nextProps.login;
        this.loadPhotos();
    }

    render() {
        return (
        <div className="fotos container">
            <ReactCSSTransitionGroup
                transitionName="timeline"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                {
                    this.state.photos.map(photo => <PhotoItem key={photo.id} photo={photo} toLike={this.toLike} toComment={this.toComment} />)
                }
            </ReactCSSTransitionGroup>
        </div>            
        );
    }
}

export default withRouter(Timeline);