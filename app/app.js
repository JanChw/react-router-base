'use strict';

import 'semantic-ui';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link, IndexRoute, Redirect } from 'react-router';
import Home from './Home';

class App extends React.Component{
    render(){
        return (
          <div>
              <div className="ui secondary pointing menu">
                  <Link to="/" className="item">Home</Link>
                  <Link to="/tv" className="item">TV</Link>
              </div>
              {this.props.children}
          </div>
        );
    }
}

class TV extends React.Component{
    render(){
        return(
            <div>
                {this.props.children}
            </div>
        );
    }
}

class Show extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.params);
    }
    render(){
        return(
            <h3>节目 {this.props.params.id}</h3>
        );
    }
}

class ShowIndex extends React.Component{
    render(){
        return(
            <div className="ui info message">电视列表</div>
        );
    }
}

function handleEnter(){
    console.log('enter');
}

function handleLeave(){
    console.log('leave');
}

ReactDom.render((
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/tv" component={TV}>
                <IndexRoute component={ShowIndex} />
                <Route path="/show/:id" component={Show}
                onEnter={handleEnter} onLeave={handleLeave} />
                <Redirect from="show/:id" to="/show/:id" />
            </Route>
        </Route>
    </Router>
), document.getElementById('app'));
