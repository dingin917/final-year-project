import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import HeadSection from './HeadSection';
import Footer from './Footer';
import Routes from './Routes';
import './index.css';

class App extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            login: false
        }
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin() {
        // if document.querySelector('#id').value===process.env.passwd
        this.setState({ login: true })
    }
    render() {
        if (this.state.login) return (
            <div>
                hi
                <button onClick={this.handleLogin}>login</button>
            </div>
        );
        return (
            <div>
                <div style={{"margin-bottom": "5rem"}}>
                    <HeadSection />
                </div>
                <Routes />
                <div>
                    <Footer className={this.state.show} />
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

export default App