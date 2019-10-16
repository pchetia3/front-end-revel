import LoginPage from "../pages/LoginPage.js";
import React from "react";
import ReactDOM from "react-dom";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import { ReactComponent as LogoutSVG } from "../icons/logout.svg";
import { ReactComponent as ReportSVG } from "../icons/report.svg";
import { Link } from "react-router-dom";

function SideBar(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [profile] = React.useState(props.profile);

  function handleListItemClick(index) {
    setSelectedIndex(index);
  }

  function logout() {
    setSelectedIndex(1);

    window.localStorage.removeItem("login");
    ReactDOM.render(<LoginPage />, document.getElementById("root"));
  }

  return (
    <div>
      <Divider />

      <List style={{ marginLeft: 5 }}>
        <ListItem>
          <ListItemIcon>
            <Avatar src={profile.google.imageUrl} />
          </ListItemIcon>
          <h1 style={{ marginLeft: 20 }}>{profile.google.givenName}</h1>
        </ListItem>
      </List>

      <List style={{ marginLeft: 10 }}>
        <ListItem
          onClick={() => handleListItemClick(0)}
          component={Link}
          to="/locations"
          button
        >
          <ListItemIcon>
            <ReportSVG fill={selectedIndex === 0 ? "#4FBBD5" : "black"} />
          </ListItemIcon>
          Reports
        </ListItem>
        <br />

        <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutSVG fill={selectedIndex === 1 ? "#4FBBD5" : "black"} />
          </ListItemIcon>
          Logout
        </ListItem>
      </List>
    </div>
  );
}

export default SideBar;
