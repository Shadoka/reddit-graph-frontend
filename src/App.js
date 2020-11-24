import UserListScreen from './UserListScreen';

const React = require('react');
const ReactDOM = require('react-dom');
const lodash = require('lodash');

const client = require('./client.js');

const BACKEND = "http://localhost:8080"
const CROSSPOSTER_ENDPOINT = BACKEND.concat("/user/crossposter/");

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subreddits: [],
      selected_subs: [],
      crossposter: []
    };

    this.selectSubreddit = this.selectSubreddit.bind(this);
  }

  componentDidMount() {
    client({method: 'GET', path: BACKEND.concat('/subreddits/available')}).then(response => {
      this.setState({subreddits: response.entity});
    });
  }

  render() {
    if (this.state.crossposter.length > 0) {
      return (
        <div className='application-container'>
          <div className='button-container'>
            {this.createButtonRows()}
          </div>
          <div className='content-container'>
            <UserListScreen data={this.state.crossposter}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className='button-container'>
          {this.createButtonRows()}
        </div>
      );
    }
  }

  selectSubreddit(subreddit_name) {
    const index = this.state.selected_subs.indexOf(subreddit_name);
    var current_selections = [...this.state.selected_subs];
    if (index > -1) {
      current_selections = current_selections.filter(name => name !== subreddit_name);
      this.setState({selected_subs: this.state.selected_subs.filter(name => name !== subreddit_name)});
    } else {
      current_selections = current_selections.concat(subreddit_name);
      this.setState({selected_subs: this.state.selected_subs.concat(subreddit_name)});
    }

    if (current_selections.length >= 2) {
      this.getCrossposterData(current_selections);
    } else {
      this.setState({crossposter: []});
    }
  }

  getCrossposterData(selections) {
    // TODO: Make it better
    const endpoint = CROSSPOSTER_ENDPOINT.concat("?firstSubreddit=").concat(selections[0]).concat("&secondSubreddit=").concat(selections[1]);
    client({method: 'GET', path: endpoint}).then(response => {
      this.setState({crossposter: response.entity});
    });
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
* selected_subs   => string array of all currently selected subreddits
* onSubSelection  => function to execute when a subreddit is selected
*/
class ButtonRow extends React.Component {

  render() {
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

export default App;
