const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client.js');
const lodash = require('lodash');

const BACKEND = "http://localhost:8080"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        subreddits: []
      };
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

  createButtonRows() {
    return lodash
      .chunk(this.state.subreddits, 3)
      .map(reddits => <ButtonRow buttonData={reddits}/>);
  }
}

class ButtonRow extends React.Component {

  onButtonClick(endpoint) {
    alert(endpoint);
  }

  render() {
    const buttons = this.props.buttonData.map(data =><SubredditButton name={data} clickMethod={this.onButtonClick} key={data}/>);

    return (
      <div className='button-row'>
        {buttons}
      </div>
    );
  }
}

class SubredditButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image_url: "",
      selected: false
    };
  }

  componentDidMount() {
    client({method: 'GET', path: BACKEND.concat('/subreddits/').concat(this.props.name).concat('/image')}).then(image => {
      this.setState({image_url: image.entity.url})    
    })
  }

  select() {
    this.setState({
      image_url: this.state.image_url,
      selected: !this.state.selected
    });
  }

  render() {
    const endpoint = BACKEND.concat("/subreddits/").concat(this.props.name);
    // () => this.props.clickMethod(endpoint)

    var buttonClasses = "";
    if (this.state.selected) {
      buttonClasses += "button-span-selected";
    } else {
      buttonClasses += "button-span";
    }

    return (
      <span className={buttonClasses} style={{backgroundImage: "url('" + this.state.image_url + "')"}}>
        <a href='javascript:void(0)' onClick={() => this.select()} title={this.props.name}></a>
      </span>
    );
  }
}

export default App;
