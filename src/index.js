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
            show: true
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        this.setState({ show: !this.state.show })
    }
    render() {
        return (
            <div>
                <div style={{ display: this.state.show ? "block" : "none" }}>
                    <HeadSection />
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" data-toggle="toggle" value={this.state} onChange={this.handleChange} />
                        Hide original Page
                    </label>
                </div>
                <div className="board" id="service">
                    <Routes />
                </div>
                <div style={{ display: this.state.show ? "auto" : "none" }}>
                    <Footer className={this.state.show} />
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

export default App