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
        this.props.store.list(urlProfile);
    }

    toLike(photoId) {
        this.props.store.like(photoId);
    }

    toComment(photoId, commentText) {
        this.props.store.comment(photoId, commentText);
    }

    componentDidMount() {
        this.loadPhotos();
    }

    componentWillMount() {
        PubSub.subscribe('timeline-search', (topic, newPhotos) => {
            // this.setState({photos: newPhotos.photos});
            this.props.history.push(`/timeline/${newPhotos.login}`);
        });

        this.props.store.subscribe(photos => {
            this.setState({photos});
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
                    this.state.photos.map(photo => <PhotoItem key={photo.id} photo={photo} toLike={this.toLike.bind(this)} toComment={this.toComment.bind(this)} />)
                }
            </ReactCSSTransitionGroup>
        </div>            
        );
    }
}

export default withRouter(Timeline);