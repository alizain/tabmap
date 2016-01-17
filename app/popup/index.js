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

  renderSpace(key, window) {
    return (
      <li key={key}>
        <div>{ window.name === undefined ? key : name}</div>
        <a onClick={this.openWindow.bind(this, key)}>Open</a>
        <a onClick={this.removeWindow.bind(this, key)}>Remove</a>
      </li>
    );
  },

  render() {
    return (
      <div>
        <h2>TabMap</h2>
        <button onClick={this.captureWindow}>Save Current Window</button>
        <ol>
          {
            Object.keys(this.state.windows).map((key) => {
              return this.renderSpace(key, this.state.windows[key]);
            })
          }
        </ol>
      </div>
    );
  }

});

ReactDOM.render(<Home/>, document.getElementById('app'));
