import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LoginPage from "./pages/LoginPage";
import * as serviceWorker from "./serviceWorker";
import App from "./pages/App";
import red from "material-ui/es/colors/red";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createPalette from "@material-ui/core/styles/createPalette";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";
import Box from "@material-ui/core/Box";

const muiTheme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: blue,
    error: red,
    type: "light"
  }),
  text: createPalette({
    primary: blue,
    accent: blue,
    error: red
  })
});

const savedProfile = JSON.parse(window.localStorage.getItem("login"));

if (savedProfile !== null) {
  ReactDOM.render(
    <MuiThemeProvider theme={muiTheme}>
      <App profile={savedProfile} />
    </MuiThemeProvider>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <MuiThemeProvider theme={muiTheme}>
      <LoginPage />
    </MuiThemeProvider>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
