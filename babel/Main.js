import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './my/TopBar';
import CountGraph from './my/CountGraph';
import ItemBox from './my/ItemBox';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

function Main() {
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <TopBar />
        <div>
          <CountGraph />
          <ItemBox />
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default Main;
