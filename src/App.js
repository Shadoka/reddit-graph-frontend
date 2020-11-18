const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client.js');

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

  onButtonClick(endpoint) {
    alert(endpoint);
  }

  render() {
    console.log("in render");
    const buttons = this.state.subreddits.map(sub => <SubredditButton name={sub} clickMethod={this.onButtonClick}/>);

    return (
      <div class='button-container'>
        {buttons}
      </div>
    );

    //return (
    //  <EmployeeList employees={this.state.employees}/>
    //);
  }

  createButtonRows() {
    var rows;
    var currentRow;
    
  }
}

class SubredditButton extends React.Component {
  render() {
    const endpoint = BACKEND.concat("/subreddits/").concat(this.props.name);

    return (
      <input type='button' onClick={() => this.props.clickMethod(endpoint)} value={this.props.name}/>
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
