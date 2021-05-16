import React, { Component } from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Index from '../js/Component/theFirstPage/Index'
import Login from './Component/enterPage/loginPage/Login'
import Attend from './Component/enterPage/attendPage/Attend'
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        
        }
    }
    render() { 
        return (
            <Router>
                {/* <Redirect to='/Index'/> */}
                <Route  exact path='/' component={Index}></Route>
                <Route path='/Login' component={Login}></Route> 
                <Route path = "/Attend" component = {Attend }></Route>
            </Router> 
         );
    }
}
export default App;