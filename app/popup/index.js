import Promise from 'bluebird';
Promise.config({
  longStackTraces: true,
  warnings: true
});

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';

import tabs from '../core/tabs';
import storage from '../core/storage';
import { randomString, prettifyJSON } from '../core/utils';

const TZ = moment.tz.guess();

const sorters = {
  date(a, b) {
    if (a.saved > b.saved) {
      return -1
    } else if (a.saved > b.saved) {
      return 1
    }
    return 0
  },
  title(a, b) {
    if (a.name < b.name) {
      return -1
    } else if (a.name > b.name) {
      return 1
    }
    return 0
  }
}

var Home = React.createClass({

  getInitialState() {
    return {
      input: '',
      windows: {},
      waiting: false,
      exportedData: undefined,
      sort: "date"
    };
  },

  componentDidMount() {
    this.getFromStorage();
    storage.onChange(() => {
      this.getFromStorage();
    });
  },

  getFromStorage() {
    storage.getAll().then((data) => {
      this.setState({
        windows: data
      });
    });
  },

  openWindow(key) {
    this.setState({ waiting: true });
    let urls = this.state.windows[key].tabs.map((tab) => {
      return tab.url;
    });
    tabs.open(urls).then(() => {
      this.setState({ waiting: false });
    });
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
        saved: new Date().toISOString()
      });
      this.state.input = '';
    });
  },

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  },

  handleExportOpen() {
    tabs.getAll().then((data) => {
      this.setState({
        exportedData: prettifyJSON(data)
      });
    });
  },

  handleExportStored() {
    storage.getAll().then((data) => {
      this.setState({
        exportedData: prettifyJSON(data)
      });
    });
  },

  handleExportClear() {
    this.setState({
      exportedData: undefined
    });
  },

  handleSortChange(value) {
    this.setState({
      sort: value
    })
  },

  renderWindows() {
    console.log(sorters[this.state.sort])
    console.log(this.state.sort)
    if (Object.keys(this.state.windows).length > 0) {
      return (
        <section>
          <h2>Stored Windows</h2>
          <div className="window-row export-row">
            <button className="pure-button" onClick={this.handleSortChange.bind(this, "date")}>Sort by <strong>Date</strong></button>
            <button className="pure-button" onClick={this.handleSortChange.bind(this, "title")}>Sort by <strong>Title</strong></button>
          </div>
          <ul className="windows-list">
            {
              Object.keys(this.state.windows)
                .sort((a, b) => sorters[this.state.sort](this.state.windows[a], this.state.windows[b]))
                .map((key) => {
                  return this.renderItem(key, this.state.windows[key]);
                })
            }
          </ul>
        </section>
      );
    }
  },

  renderItem(key, window) {
    return (
      <li key={key} className="window window-row">
        <div className="expand-flex details-row">
          <div className="details-name">{ !!window.name ? window.name : key }</div>
          <div className="window-row">
            <div>{ window.tabs.length } tabs</div>
            <div className="expand-flex details-date">{moment(window.saved).tz(TZ).fromNow()}</div>
          </div>
        </div>
        <div className="button-row">
          <button disabled={this.state.waiting} className="pure-button button button-open" onClick={this.openWindow.bind(this, key)}>
            <i className="fa fa-lg fa-external-link"></i>
            Open
          </button>
          <button disabled={this.state.waiting} className="pure-button button button-remove" onClick={this.removeWindow.bind(this, key)}>
            <i className="fa fa-lg fa-trash"></i>
          </button>
        </div>
      </li>
    );
  },

  renderExportedData() {
    if (this.state.exportedData !== undefined) {
      return (
        <div className="export-data">
          <button className="pure-button" onClick={this.handleExportClear}>Clear</button>
          <pre>
            <code>
              { this.state.exportedData }
            </code>
          </pre>
        </div>
      );
    }
  },

  render() {
    return (
      <div>
        <section className="header">
          <img src="../icon-outline.png"/>
          <h1>TabMap</h1>
        </section>
        <section>
          <h2>Add Current window</h2>
          <form onSubmit={this.handleSubmit} className="pure-form window-row">
            <input type="text"
              value={this.state.input}
              onChange={this.handleInput}
              placeholder="Give this window a name"
              className="pure-input-2-3 form-item"
            />
            <button type="submit" className="pure-button pure-button-primary form-item">Save Window</button>
          </form>
        </section>
        { this.renderWindows() }
        <section>
          <h2>Export</h2>
          <div className="window-row export-row">
            <button className="pure-button" onClick={this.handleExportStored}>All <strong>Stored</strong> Windows</button>
            <button className="pure-button" onClick={this.handleExportOpen}>All <strong>Open</strong> Windows</button>
          </div>
          { this.renderExportedData() }
        </section>
      </div>
    );
  }

});

ReactDOM.render(<Home/>, document.getElementById('app'));
