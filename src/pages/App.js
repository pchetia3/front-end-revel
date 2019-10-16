import React from "react";
import clsx from "clsx";
import { ReactComponent as Logo } from "../icons/logo.svg";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as BellSVG } from "../icons/bell.svg";
import { ReactComponent as MailSVG } from "../icons/mail.svg";
import { ReactComponent as SettingsSVG } from "../icons/settings.svg";
import { ReactComponent as HelpSVG } from "../icons/help.svg";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SideBar from "../components/SideBar.js";
import Main from "./Main";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Link } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Box from "@material-ui/core/Box";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  appBar: {
    position: "fixed",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    background: "off-white",
    // "#0288d1"
    color: "white"
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 10,
    color: "black",
    align: "center"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(9) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(10) + 1
    }
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px"
    // ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  inputRoot: {
    color: "black"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 800
    }
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  }
}));

function App(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          elevation={0}
          color="inherit"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              size="medium"
              data-sidebar-test-open
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, { [classes.hide]: open })}
            >
              <Logo width={45} />
            </IconButton>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton>
                <BellSVG />
              </IconButton>
              <IconButton component={Link} to={"/inbox"}>
                <MailSVG />
              </IconButton>
              <IconButton component={Link} to={"/settings"}>
                <SettingsSVG />
              </IconButton>
              <IconButton>
                <HelpSVG />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          PaperProps={{ width: 50 }}
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
          open={open}
        >
          <div className={classes.toolbar}>
            <IconButton data-sidebar-test-close onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>

          <SideBar profile={props.profile} />
        </Drawer>
        <div style={{ width: "100%", marginTop: 100 }}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            maxSnack={3}
            autoHideDuration={4000}
            preventDuplicate={true}
          >
            <Main profile={props.profile} location={props.location} />
          </SnackbarProvider>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
