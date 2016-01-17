import Promise from 'bluebird';
Promise.config({
  longStackTraces: true,
  warnings: true
});

import React from 'react';
import ReactDOM from 'react-dom';

import tabs from '../core/tabs';
import storage from '../core/storage';
import { randomString } from '../core/utils';

let Home = React.createClass({

  getInitialState() {
    return {
      input: '',
      windows: {}
    };
  },

  componentDidMount() {
    this.getFromStorage();
    storage.onChange(() => {
      this.getFromStorage();
    });
  },

  getFromStorage() {
    storage.get(null).then((data) => {
      this.setState({
        windows: data
      });
    });
  },

  captureWindow() {
    tabs.capture().then((data) => {
      storage.set(randomString(), {
        tabs: data
      });
    });
  },

  openWindow(key) {
    let urls = this.state.windows[key].tabs.map((tab) => {
      return tab.url;
    });
    tabs.open(urls);
  },

  removeWindow(key) {
    storage.remove(key);
  },

  handleSubmit(e) {
    e.preventDefault();
    tabs.capture().then((data) => {
      storage.set(randomString(), {
        name: this.state.input,
        tabs: data,
        saved: Date.now()
      });
      this.state.input = '';
    });
  },

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  },

  renderSpace(key, window) {
    return (
      <li key={key}>
        <div>{ !window.name ? key : window.name}</div>
        <div className="pure-g">
          <span className="pure-u-1-2">{window.saved}</span>
          <button className="pure-u-3-8 pure-button button-open" onClick={this.openWindow.bind(this, key)}>
            <i className="fa fa-lg fa-external-link"></i>
            Open
          </button>
          <button className="pure-u-1-8 pure-button button-remove" onClick={this.removeWindow.bind(this, key)}>
            <i className="fa fa-lg fa-trash"></i>
          </button>
        </div>
      </li>
    );
  },

  render() {
    return (
      <div>
        <section className="header">
          <h1>TabMap</h1>
        </section>
        <section>
          <h3>Save all tabs in the current window</h3>
          <form onSubmit={this.handleSubmit} className="pure-form">
            <fieldset>
              <input type="text"
                value={this.state.input}
                onChange={this.handleInput}
                placeholder="Name"
                className="pure-input-2-3"
              />
            <button type="submit" className="pure-button pure-button-primary">Save</button>
            </fieldset>
          </form>
        </section>
        <section>
          <h3>Saved windows</h3>
          <ul className="window-list">
            {
              Object.keys(this.state.windows).map((key) => {
                return this.renderSpace(key, this.state.windows[key]);
              })
            }
          </ul>
        </section>
      </div>
    );
  }

});

ReactDOM.render(<Home/>, document.getElementById('app'));
