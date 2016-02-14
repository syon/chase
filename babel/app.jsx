import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import {
  AppBar,
  FlatButton, RaisedButton,
  LeftNav, MenuItem,
  Paper
} from 'material-ui';

import {Spacing} from 'material-ui/lib/styles';
import {Colors, getMuiTheme} from 'material-ui/lib/styles';
import {StylePropable, StyleResizable} from 'material-ui/lib/mixins';

// import CardExampleWithAvatar from 'mycomponents/CardExampleWithAvatar';
// import CardExampleWithoutAvatar from './mycomponents/CardExampleWithoutAvatar.jsx';
import CountGraph from './CountGraph.jsx';
import ItemBox from './ItemBox.jsx';

const App = React.createClass({

  mixins: [
    StylePropable,
    StyleResizable,
  ],

  getInitialState() {
    return {
      muiTheme: getMuiTheme()
    };
  },

  componentWillMount() {
    this.setState({
      muiTheme: this.state.muiTheme,
    });
  },

  getStyles() {
    const styles = {
      appBar: {
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        minHeight: 400,
        backgroundColor: "#f5f5f5"
      },
    };
    return styles;
  },

  render() {
    const styles = this.getStyles();

    return (
      <div>
        <AppBar
          title="Chase"
          style={styles.appBar}
          showMenuIconButton={false}
        />
        <Paper zDepth={1} style={this.prepareStyles(styles.root)}>
          <CountGraph />
          <ItemBox />
        </Paper>
      </div>
    );
  }
});

export default App;
