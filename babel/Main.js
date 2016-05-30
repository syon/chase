import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import RaisedButton from 'material-ui/RaisedButton';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CountGraph from './my/CountGraph';
import ItemBox from './my/ItemBox';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  openPocket() {
    window.open("https://getpocket.com");
  }

  exitApp() {
    window.location = "/logout";
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Chase"
            showMenuIconButton={false}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem primaryText="Pocket" leftIcon={<OpenInNew />} onTouchTap={this.openPocket} />
                <MenuItem primaryText="Exit" leftIcon={<ExitToApp />} onTouchTap={this.exitApp} />
              </IconMenu>
            }
          />
          <div>
            <CountGraph />
            <ItemBox />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
