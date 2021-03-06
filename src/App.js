import UserListScreen from './UserListScreen';
import ButtonRow from './ButtonRow';
import ActionButtonColumn from './ActionButtonColumn';
import FriendGraph from './FriendGraph';

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
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    client({method: 'GET', path: BACKEND.concat('/subreddits/available')}).then(response => {
      this.setState({subreddits: response.entity});
    });
  }

  render() {
    if (this.state.crossposter.length > 0) { // show crossposter when 2+ selected
      const title = "Crossposter " + this.state.selected_subs[0] + " & " + this.state.selected_subs[1];
      
      return (
        <div className='application-container'>
          <div className='button-container'>
            {this.createButtonRows()}
          </div>
          <div className='content-container'>
            <ActionButtonColumn userDataFetchMethod={this.getUserData}/>
            <UserListScreen data={this.state.crossposter} list_title={title}/>
            <div className='filler-div'></div>
          </div>
        </div>
      );
    } else if (this.state.selected_subs.length === 1) { // show friend graph when 1 selected
      return (
        <div className='application-container'>
          <div className='button-container'>
            {this.createButtonRows()}
          </div>
          <div className='content-container'>
            <ActionButtonColumn userDataFetchMethod={this.getUserData}/>
            <FriendGraph />
            <div className='filler-div'></div>
          </div>
        </div>
      );
    } else { // show nothing when nothing is selected
      return (
        <div className='button-container'>
          {this.createButtonRows()}
        </div>
      );
    }
  }

  getUserData() {
    const currently_selected = this.state.selected_subs[0];
    const endpoint = BACKEND.concat("/user/").concat(currently_selected).concat("/friends");

    client({method: 'GET', path: endpoint}).then(response => {
      console.log(response.entity.userToFriend);
    });
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

export default App;