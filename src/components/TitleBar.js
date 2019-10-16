import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { ReactComponent as MenuSVG } from "../icons/menu.svg";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DateRangeButton from "./DateRangeButton";
import Payment from "../models/Payment";
import Check from "@material-ui/icons/Check";
import Grid from "@material-ui/core/Grid";
import { ListItemIcon } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  grow: {
    flexGrow: 1
  },
  title: {},
  appBar: {
    elevation: 0,
    backgroundColor: "#4FBBD5",
    position: "static",
    color: "default",
    height: 110
  },
  typography: {
    flexGrow: 1,
    textAlign: "left",
    marginTop: 20,
    color: "black"
  },

  //section mobile
  toggleContainer: {
    display: "flex"
  },
  dateButton: {
    color: "black",
    marginTop: 20
  }
}));

const ITEM_HEIGHT = 48;

export default function TitleBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const [pay, setPay] = React.useState(props.payType);
  const classes = useStyles();

  const handlePayType = (event, newPay) => {
    setPay(newPay);
    props.handlePayType(newPay);
    setAnchorEl(null);
  };

  function checkmarkIcon(value) {
    if (Payment.createFromTitle(value) === props.payType) {
      return <Check align="left" />;
    }
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.typography}>
            {props.title}
            <div className={classes.toggleContainer}>
              <DateRangeButton
                startDate={props.startD}
                endDate={props.endD}
                handleDone={props.handleDone}
                className={classes.dateButton}
              />
            </div>
          </Typography>
          <div>
            {props.children}
            <IconButton onClick={handleClick}>
              <MenuSVG />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 100
                }
              }}
            >
              {["All", "Cash", "Credit", "Other"].map((value, index) => {
                return (
                  <MenuItem
                    onClick={event =>
                      handlePayType(event, Payment.createFromTitle(value))
                    }
                    value={index}
                    key={index}
                  >
                    <Grid container justify="space-between">
                      <Typography variant="body1" align="right">
                        {value}
                      </Typography>

                      {checkmarkIcon(value)}
                    </Grid>
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
