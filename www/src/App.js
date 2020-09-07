import React , { Component } from "react";
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from './component/Home';
import About from './component/About';
import Head from './component/Layouts/Head';
import Footer from './component/Layouts/Footer';
import Show from './component/Show';
import Page from './component/Page';
import Test from './component/Test';

//
class App extends Component {
  render() {
    return (
      <div className="App">
        <Head />
        <Router>
          <div>
            <Route exact path='/' component={Home}/>
            <Route path="/show/:id" component={Show} />
            <Route path="/pages/:id" component={Page} />
            <Route path='/about' component={About}/>
            <Route path='/test' component={Test}/> 
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}
export default App;
