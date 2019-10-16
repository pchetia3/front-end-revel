import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { LoaderWrapper } from "@revel/core";
import { Divider } from "@material-ui/core";
import SaveButton from "../../components/SaveButton";
import { sendPostRequest } from "../../utils/requests";
import { send } from "../../utils/snackbar";
import { withSnackbar } from "notistack";
import red from "material-ui/es/colors/red";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createPalette from "@material-ui/core/styles/createPalette";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";
import App from "../App";
import ReactDOM from "react-dom";

class NotificationConfiguration extends React.Component {
  state = {
    email: this.props.email,
    darkMode: false
  };

  postRequestHandler = {
    path: "/setthresholds",
    error: "Failed to set notification preferences.",
    onSuccess: () => {
      send(this.props, "Email settings saved.", "success");
    },
    config: {
      schema: this.props.profile.schema,
      threshold_type: null,
      threshold_value: null,
      threshold_level: null
    }
  };

  onChangeMailSettings = checked => {
    this.postRequestHandler.config.email = checked;
    this.setState({ email: checked });

    sendPostRequest(this, this.postRequestHandler);
  };

  render() {
    return (
      <LoaderWrapper isLoading={false}>
        <List component="nav">
          <ListItem>
            <ListItemText primary="Email Notifications" />
            <Switch
              checked={this.state.email}
              onChange={(event, checked) => this.onChangeMailSettings(checked)}
              color="primary"
            />
          </ListItem>

          <Divider />

          <ListItem>
            <ListItemText primary="Dark Mode" />
            <Switch
              checked={this.state.darkMode}
              onChange={(event, checked) => {
                let dark = this.state.darkMode;
                dark = !dark;
                this.setState({ darkMode: dark });

                const muiTheme = createMuiTheme({
                  palette: createPalette({
                    primary: blue,
                    accent: blue,
                    error: red,
                    type: dark ? "dark" : "light"
                  }),
                  text: createPalette({
                    primary: blue,
                    accent: blue,
                    error: red
                  })
                });

                ReactDOM.render(
                  <MuiThemeProvider theme={muiTheme}>
                    <App profile={this.props.profile} />
                  </MuiThemeProvider>,
                  document.getElementById("root")
                );
              }}
              color="primary"
            />
          </ListItem>

          <Divider />

          <ListItem>
            <Typography variant="caption" color="textSecondary">
              Enable or disable each notification type. Disabling will opt out
              of all notifications for that type.
            </Typography>
          </ListItem>
        </List>
      </LoaderWrapper>
    );
  }
}

export default withSnackbar(NotificationConfiguration);
