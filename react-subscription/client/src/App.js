import React, {Component} from 'react';
import './App.scss';
import Form from './component/Form';
import SubDash from './component/SubDash';
let baseURL = "http://localhost:9000";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submit: "true"
    };
  }

  render(){
    return (
      <div className="App">
        <Form baseURL={baseURL} />
        <SubDash />
      </div>
    );
  }
}

export default App;
