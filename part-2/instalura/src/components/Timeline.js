import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PhotoItem from './PhotoItem';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Timeline extends Component {

    constructor(props) {       
        super(props);        
        this.state = {photosList: []};
        this.login = this.props.login;
    }

    loadPhotos() {
        let urlProfile;       
        if(this.login === undefined) urlProfile = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        else urlProfile = `http://localhost:8080/api/public/fotos/${this.login}`;
        fetch(urlProfile)
            .then(response => response.json())
            .then(photos => this.setState({photosList: photos}));
    }

    componentDidMount() {
        this.loadPhotos();
    }

    componentWillMount() {
        PubSub.subscribe('timeline-search', (topic, newPhotos) => {
            // this.setState({photosList: newPhotos.photos});
            this.props.history.push(`/timeline/${newPhotos.login}`);
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
                    this.state.photosList.map(photo => <PhotoItem key={photo.id} photo={photo}/>)
                }
            </ReactCSSTransitionGroup>
        </div>            
        );
    }
}

export default withRouter(Timeline);