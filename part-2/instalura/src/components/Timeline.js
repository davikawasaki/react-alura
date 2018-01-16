import React, { Component } from 'react';
import PhotoItem from './PhotoItem';

export default class Timeline extends Component {
    render(){
        return (
        <div className="fotos container">
            <PhotoItem/>
            <PhotoItem/>
        </div>            
        );
    }
}