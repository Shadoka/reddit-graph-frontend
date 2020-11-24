const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client.js');
const lodash = require('lodash');

const BACKEND = "http://localhost:8080"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subreddits: [],
      selected_subs: []
    };

    this.selectSubreddit = this.selectSubreddit.bind(this);
  }

  componentDidMount() {
    client({method: 'GET', path: BACKEND.concat('/subreddits/available')}).then(response => {
      this.setState({subreddits: response.entity});
    });
  }

  render() {
    return (
      <div className='button-container'>
        {this.createButtonRows()}
      </div>
    );
  }

  selectSubreddit(subreddit_name) {
    const index = this.state.selected_subs.indexOf(subreddit_name);
    if (index > -1) {
      this.setState({selected_subs: this.state.selected_subs.filter(name => name !== subreddit_name)});
    } else {
      this.setState({selected_subs: this.state.selected_subs.concat(subreddit_name)});
    }
  }

  createButtonRows() {
    return lodash
      .chunk(this.state.subreddits, 3)
      .map(reddits => <ButtonRow buttonData={reddits} selected_subs={this.state.selected_subs} onSubSelection={this.selectSubreddit}/>);
  }
}
/*
* Row of subreddit buttons.
* Properties:
* buttonData      => string array of all the subreddits in this show 
* selected_subs    => string array of all currently selected subreddits
* onSubSelection  => function to execute when a subreddit is selected
*/
class ButtonRow extends React.Component {

  render() {
    console.log(this.props.selected_subs);
    const buttons = this.props.buttonData.map(data => {
      const is_selected = this.props.selected_subs.includes(data);

      return <SubredditButton name={data} clickMethod={this.props.onSubSelection} selected={is_selected} key={data}/>
    });

    return (
      <div className='button-row'>
        {buttons}
      </div>
    );
  }
}

/*
* Button representing a subreddit. Shows the banner image of the subreddit.
* Properties:
* name => name of the subreddit this button represents
* clickMethod => method to execute when this button is clicked
* selected => flag to indicate whether or not this button is currently selected
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

export default App;
