import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

export default class Timeline extends Component {

    constructor() {
        super();
        this.state = {photosList: []};
    }

    componentDidMount() {
        fetch('http://localhost:8080/api/public/fotos/alots')
            .then(response => response.json())
            .then(photos => this.setState({photosList: photos}));
    }

    render() {
        return (
        <div className="fotos container">
            {
                this.state.photosList.map(photo => <PhotoItem key={photo.id} photo={photo}/>)
            }
        </div>            
        );
    }
}