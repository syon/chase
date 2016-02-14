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
      muiTheme: getMuiTheme(),
      leftNavOpen: false,
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
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        paddingTop: Spacing.desktopKeylineIncrement,
        minHeight: 400,
        backgroundColor: "#fafafa"
      },
      leftNavLogo: {
        height: 64,
        marginBottom: 8,
      }
    };
    return styles;
  },

  render() {
    let {
      leftNavOpen,
    } = this.state;

    const styles = this.getStyles();

    let docked = false;
    let showMenuIconButton = true;

    if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      docked = true;
      leftNavOpen = true;
      showMenuIconButton = false;

      styles.leftNav = {
        zIndex: styles.appBar.zIndex - 1,
      };
      styles.root.paddingLeft = 256;
    }

    return (
      <div>
        <AppBar
          title="Pokke"
          style={styles.appBar}
          iconElementRight={<FlatButton label="Connect" href="/oauth/connect" linkButton={true} />}
        />
        <LeftNav
          style={styles.leftNav}
          docked={docked}
          open={leftNavOpen}
        >
          <MenuItem style={styles.leftNavLogo}>--</MenuItem>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </LeftNav>
        <Paper zDepth={1} style={this.prepareStyles(styles.root)}>
          <CountGraph />
          <ItemBox />
        </Paper>
      </div>
    );
  }
});

export default App;
