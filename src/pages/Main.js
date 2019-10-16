import LocationGrid from "./LocationGrid";
import LoginPage from "./LoginPage";
import React from "react";
import { Route, Switch } from "react-router-dom";
import EmployeeOrderReport from "./reports/EmployeeOrderReport";
import LossPreventionReport from "./reports/LossPreventionReport";
import Inbox from "./Inbox";
import Settings from "./settings/Settings";
import firebase from "firebase";
import { send } from "../utils/snackbar";
import { withSnackbar } from "notistack";
import { testName } from "../constants";
import Formatter from "../models/Formatter";
import { firebaseConfig } from "../constants";

firebase.initializeApp(firebaseConfig);
export const dbRef = firebase
  .database()
  .ref()
  .child(testName);

class Main extends React.Component {
  state = {
    alerts: [], // raw data objects from backend
    alertData: [], // formatted data displayed in table
    isLoading: true
  };

  formatDate(date, delimiter) {
    let day = date.split(delimiter)[0];
    let time = date.split(delimiter)[1];

    day = Formatter.formatDate(day, "-");
    time = time.substring(0, 5);

    return day + " " + time;
  }
  componentDidMount = () => {
    const props = this.props;

    dbRef.on("child_added", snap => {
      var newPost = snap.val();
      const alert = {
        title: newPost.title,
        thresholdType: newPost.threshold_type,
        link: newPost.link,
        body: newPost.body,
        date: newPost.date
      };

      const newAlerts = this.state.alerts;
      const newAlertData = this.state.alertData;
      newAlerts.push(alert);

      newAlertData.push([
        alert.title,
        alert.thresholdType,
        this.formatDate(alert.date, " ")
      ]);

      this.setState({
        isLoading: false,
        alerts: newAlerts,
        alertData: newAlertData
      });
    });
  };

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={dashProps => <LocationGrid profile={this.props.profile} />}
          />

          <Route
            path="/locations"
            render={dashProps => <LocationGrid profile={this.props.profile} />}
          />

          <Route
            exact
            path="/reports"
            render={dashProps => (
              <LossPreventionReport profile={this.props.profile} />
            )}
          />

          <Route
            exact
            path="/reports/employee/"
            render={dashProps => (
              <EmployeeOrderReport profile={this.props.profile} />
            )}
          />

          <Route
            exact
            path="/settings"
            render={dashProps => <Settings profile={this.props.profile} />}
          />

          <Route
            exact
            path="/inbox"
            render={dashProps => (
              <Inbox
                profile={this.props.profile}
                alerts={this.state.alerts}
                alertData={this.state.alertData}
                isLoading={this.state.isLoading}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default withSnackbar(Main);
