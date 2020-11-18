const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client.js');
const lodash = require('lodash');

const BACKEND = "http://localhost:8080"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {subreddits: []};
  }

  componentDidMount() {
    console.log("before backend call");
    client({method: 'GET', path: BACKEND.concat('/subreddits/available')}).then(response => {
      this.setState({subreddits: response.entity});
    });
    console.log("after backend call");
  }

  storeSubreddits(response) {
    this.setState({subreddits: response.entity});
  }

  render() {
    console.log("in render");

    return (
      <div class='button-container'>
        {this.createButtonRows()}
      </div>
    );
  }

  createButtonRows() {
    const row_buttons = lodash.chunk(this.state.subreddits, 3);
    return row_buttons.map(buttons => <ButtonRow buttonData={buttons}/>);
  }
}

class ButtonRow extends React.Component {

  onButtonClick(endpoint) {
    alert(endpoint);
  }

  render() {
    const buttons = this.props.buttonData.map(data => <SubredditButton name={data} clickMethod={this.onButtonClick}/>);

    return (
      <div class='button-row'>
        {buttons}
      </div>
    );
  }

}

class SubredditButton extends React.Component {

  render() {
    const endpoint = BACKEND.concat("/subreddits/").concat(this.props.name);

    return (
      <input type='button' class='button-subreddit' onClick={() => this.props.clickMethod(endpoint)} value={this.props.name}/>
    );
  }

}

class EmployeeList extends React.Component {

  render() {
    const employees = this.props.employees.map(employee =>
      <Employee key={employee.id} employee={employee}/>  
    );

    return (
      <table>
        <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Description</th>
          </tr>
          {employees}
        </tbody>
      </table>
    );
  }
}

class Employee extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.employee.firstName}</td>
        <td>{this.props.employee.lastName}</td>
        <td>{this.props.employee.description}</td>
      </tr>
    );
  }
}

export default App;
