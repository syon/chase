import React from 'react';
import $ from 'jquery';
import Colors from 'material-ui/lib/styles/colors';
import CircularProgress from 'material-ui/lib/circular-progress';

const CountGraph = React.createClass({

  loadFromServer() {
    $.ajax({
      url: "/info",
      dataType: 'json',
      cache: false,
      success: (info) => {
        console.log("/info", info);
        this.setState({fetched: true, info: info});
        let unread  = this.state.info.count_unread;
        let archive = this.state.info.count_archive;
        this.setState({
          fetched: true,
          info: {
            label: `${unread} / ${unread + archive}`,
            count_unread: unread,
            count_archive: archive
          }
        });
      },
      error: (xhr, status, err) => {
        console.error("/info", status, err.toString());
      }
    });
  },

  getInitialState() {
    return {
      fetched: false,
      info: {
        label: "",
        count_unread: 0,
        count_archive: 0
      }
    };
  },

  componentDidMount() {
    this.loadFromServer();
  },

  render() {
    let info = this.state.info;
    let deno = info.count_unread + info.count_archive;
    let rate = info.count_unread / deno * 100;
    let styles = {
      outer: {
        backgroundColor: Colors.grey200
      },
      inner: {
        width: `${rate}%`,
        backgroundColor: Colors.pink300
      }
    }
    let cp = this.state.fetched ? null: <CircularProgress size={0.5} />;
    return (
      <div className="countGraph" style={styles.outer}>
        {cp}
        <div className="countGraph-inner" style={styles.inner}>
          <span>{this.state.info.label}</span>
        </div>
      </div>
    );
  }
});

export default CountGraph;
