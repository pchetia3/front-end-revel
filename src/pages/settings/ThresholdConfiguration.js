import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import RightArrow from "@material-ui/icons/KeyboardArrowRight";
import { ListItemIcon } from "@material-ui/core";
import ThresholdType from "../../models/ThresholdType";
import OrderCategory from "../../models/OrderCategory";
import TextField from "@material-ui/core/TextField";
import { sendPostRequest, sendRequest } from "../../utils/requests";
import { withSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import { LoaderWrapper } from "@revel/core";
import { commaify } from "../../utils/utils";
import SaveButton from "../../components/SaveButton";

class ThresholdConfiguration extends React.Component {
  state = {
    thresholdInputs: this.props.thresholdInputs,
    selectedThreshold: null
  };

  postRequestHandler = {
    path: "/setthresholds",
    error: "Failed to set thresholds.",
    config: {
      schema: this.props.profile.schema,
      email: null
    }
  };

  selectSetting(newThreshold) {
    this.setState({ selectedThreshold: newThreshold });
  }

  static valueFormatter(value) {
    return value.length === 0 ? "" : "$" + commaify(value.substring(0, 6));
  }

  updateThreshold(threshold, orderCategory, newValue) {
    const newInputValue = this.state.thresholdInputs;

    // remove all leading zeros and non-digits
    newValue = newValue.replace(/[^\d]/gi, "");
    newValue = newValue.replace(/^0*/gi, "");

    // format into $number format and set in state
    newInputValue[orderCategory.thresholdRequestTitle][
      threshold.requestTitle
    ] = ThresholdConfiguration.valueFormatter(newValue);

    this.setState({ thresholdInputs: newInputValue });

    // process new request
    this.postRequestHandler.config.threshold_type = orderCategory.title.toLowerCase();
    this.postRequestHandler.config.threshold_value =
      newValue.length > 0 ? newValue : null;
    this.postRequestHandler.config.threshold_level = threshold.requestTitle;

    sendPostRequest(this, this.postRequestHandler);
  }

  createSettingsTable(threshold) {
    return (
      <>
        <List component="nav">
          {OrderCategory.types.map(orderCategory => {
            return (
              <div>
                <ListItem>
                  <ListItemText primary={orderCategory.title} />
                  <TextField
                    value={
                      this.state.thresholdInputs[
                        orderCategory.thresholdRequestTitle
                      ][threshold.requestTitle]
                    }
                    onChange={event =>
                      this.updateThreshold(
                        threshold,
                        orderCategory,
                        event.target.value
                      )
                    }
                    variant="outlined"
                    label="Amount"
                    type="string"
                  />
                </ListItem>
                <Divider />
              </div>
            );
          })}

          <ListItem>
            <Typography variant="caption" color="textSecondary">
              Set the maximum price threshold for each category at the{" "}
              {threshold.title}. Once the entered value is reached, you will be
              sent a notification. You may also disable notifications for each
              type by opting out.
            </Typography>
          </ListItem>
        </List>
        <SaveButton message="Threshold settings saved." />
      </>
    );
  }

  mainTableSettings = () => {
    return (
      <List component="nav">
        {ThresholdType.all.map((value, index) => {
          return (
            <div>
              <ListItem
                key={index}
                button
                onClick={() => this.selectSetting(value)}
              >
                <ListItemText primary={value.title} />
                <ListItemIcon>
                  <RightArrow />
                </ListItemIcon>
              </ListItem>
              <Divider />
            </div>
          );
        })}

        <ListItem>
          <Typography variant="caption" color="textSecondary">
            Configure thresholds at the specified level, applied for every
            location, employee, or order.
          </Typography>
        </ListItem>
      </List>
    );
  };

  render() {
    return (
      <div>
        {this.state.selectedThreshold == null && this.mainTableSettings()}
        {this.state.selectedThreshold !== null &&
          this.createSettingsTable(this.state.selectedThreshold)}
      </div>
    );
  }
}

export default withSnackbar(ThresholdConfiguration);
