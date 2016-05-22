import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CountGraph from './my/CountGraph';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const pocket = (
      <FlatButton
        label="Pocket"
        linkButton={true}
        href="https://getpocket.com"
        target="_blank"
      />
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Chase"
            showMenuIconButton={false}
            iconElementRight={pocket}
          />
          <div>
            <CountGraph />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
