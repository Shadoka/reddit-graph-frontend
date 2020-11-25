import React from 'react';

const client = require('./client.js');

const BACKEND = "http://localhost:8080"

/*
* Button representing a subreddit. Shows the banner image of the subreddit.
* Properties:
* name        => name of the subreddit this button represents
* clickMethod => method to execute when this button is clicked
* selected    => flag to indicate whether or not this button is currently selected
*/
class SubredditButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image_url: ""
        };
    }

    componentDidMount() {
        client({method: 'GET', path: BACKEND.concat('/subreddits/').concat(this.props.name).concat('/image')}).then(image => {
            this.setState({image_url: image.entity.url})    
        })
    }

    render() {
        const endpoint = BACKEND.concat("/subreddits/").concat(this.props.name);
  
        var buttonClasses = "";
        if (this.props.selected) {
            buttonClasses += "button-span-selected";
        } else {
            buttonClasses += "button-span";
        }

        return (
            <span className={buttonClasses} style={{backgroundImage: "url('" + this.state.image_url + "')"}}>
              <a href='javascript:void(0)' onClick={() => this.props.clickMethod(this.props.name)} title={this.props.name}></a>
            </span>
        );
    }
}

export default SubredditButton;