import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'lodash';
import {
  AppBar,
  Card, CardActions, CardHeader, CardText,
  FlatButton, RaisedButton,
  LeftNav, MenuItem,
  Paper
} from 'material-ui';

import {Spacing} from 'material-ui/lib/styles';
import {Colors, getMuiTheme} from 'material-ui/lib/styles';
import {StylePropable, StyleResizable} from 'material-ui/lib/mixins';

// import CardExampleWithAvatar from 'mycomponents/CardExampleWithAvatar';
// import CardExampleWithoutAvatar from './mycomponents/CardExampleWithoutAvatar.jsx';
import Abc from './Abc.jsx';

let ItemBox = React.createClass({
  loadFromServer: function() {
    $.ajax({
      url: "/retrieve",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/retrieve", status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: {list: []}};
  },
  componentDidMount: function() {
    this.loadFromServer();
  },
  render: function() {
    return (
      <div className="itemBox">
        <ItemList data={this.state.data} />
      </div>
    );
  }
});

let ItemList = React.createClass({
  render: function() {
    let list = _.toArray(this.props.data.list);
    let nodes = list.map(function(d) {
      return (
        <Card key={d.item_id}>
          <CardHeader
            title={d.resolved_title}
            subtitle={d.resolved_url}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </CardText>
          <CardActions expandable={true}>
            <FlatButton label="Action1"/>
            <FlatButton label="Action2"/>
          </CardActions>
        </Card>
      );
    });
    return (
      <div className="itemList">
        {nodes}
      </div>
    );
  }
});

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
          iconClassNameRight="muidocs-icon-navigation-expand-more"
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
          <ItemBox />
        </Paper>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
