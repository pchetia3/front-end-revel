import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Divider } from "@material-ui/core";
import ThresholdConfiguration from "./ThresholdConfiguration";
import NotificationConfiguration from "./NotificationConfiguration";
import OrderCategory from "../../models/OrderCategory";
import ThresholdType from "../../models/ThresholdType";
import { sendRequest } from "../../utils/requests";
import { LoaderWrapper } from "@revel/core";
import { withSnackbar } from "notistack";

const styles = {
  root: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  }
};

class Settings extends React.Component {
  state = {
    tabIndex: 0,
    thresholdKey: 0,
    isLoading: true,
    email: true,
    thresholdInputs: {
      discountsThreshold: {
        orderLevel: "",
        employeeLevel: "",
        locationLevel: ""
      },
      refundsThreshold: {
        orderLevel: "",
        employeeLevel: "",
        locationLevel: ""
      },
      voidsThreshold: {
        orderLevel: "",
        employeeLevel: "",
        locationLevel: ""
      }
    }
  };

  onReceiveThresholds = response => {
    const newThresholds = this.state.thresholdInputs;

    OrderCategory.types
      .map(v => v.thresholdRequestTitle)
      .forEach(order => {
        if (typeof response[order] === "undefined") {
          return;
        }

        ThresholdType.all
          .map(v => v.requestTitle)
          .forEach(level => {
            if (typeof response[order][level] === "undefined") {
              return;
            }

            newThresholds[order][level] = ThresholdConfiguration.valueFormatter(
              response[order][level].toString()
            );
          });
      });

    this.setState({ thresholdInputs: newThresholds, email: response.email });
  };

  getRequestHandler = {
    path: "/getthresholds",
    error: "Failed to get thresholds.",
    onSuccess: this.onReceiveThresholds,
    config: {
      schema: this.props.profile.schema
    }
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    sendRequest(this, this.getRequestHandler);
  }

  handleTabChange = (event, newIndex) => {
    this.setState({ tabIndex: newIndex });
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <LoaderWrapper isLoading={this.state.isLoading}>
          <Paper>
            <Tabs
              style={{ width: 1000 }}
              value={this.state.tabIndex}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleTabChange}
            >
              <Tab
                label="Thresholds"
                onClick={() => {
                  // causes threshold to rerender back to its initial home screen
                  this.setState({ thresholdKey: this.state.thresholdKey + 1 });
                }}
              />
              <Tab label="Notifications" />
            </Tabs>
            <Divider />
            {this.state.tabIndex === 0 && (
              <ThresholdConfiguration
                thresholdInputs={this.state.thresholdInputs}
                profile={this.props.profile}
                key={this.state.thresholdKey}
              />
            )}
            {this.state.tabIndex === 1 && (
              <NotificationConfiguration
                email={this.state.email}
                profile={this.props.profile}
              />
            )}
          </Paper>
        </LoaderWrapper>
      </div>
    );
  }
}

export default withSnackbar(Settings);
