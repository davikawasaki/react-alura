import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class CustomizedInput extends Component {

    constructor() {
        super();
        this.state = {errMsg: ''};
    }

    render() {
        return (
            <div className="pure-control-group">
              <label htmlFor={this.props.id}>{this.props.label}</label> 
              <input {...this.props} />
              <span className="error">{this.state.errMsg}</span>
            </div>  
        );
    }

    componentDidMount() {
        PubSub.subscribe("validation-error", function(topic, err) {
            if(err.field === this.props.name) this.setState({errMsg: err.defaultMessage});
        }.bind(this));

        PubSub.subscribe("clear-errors", function(topic) {
            this.setState({errMsg: ''});
        }.bind(this));        
    }
}