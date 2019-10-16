import React from "react";
import { DateRangePicker } from "react-date-range";
import SimplePopover from "./SimplePopover";
import { addDays, compareAsc, format } from "date-fns";
import { ReactComponent as DateSVG } from "../icons/date.svg";

// Wrapper that display https://github.com/Adphorus/react-date-range in a popover after button is clicked

const iconStyle = {
  color: "black",
  verticalAlign: "left",
  width: 16,
  height: 16,
  marginRight: 5
};
class DateRangeButton extends React.Component {
  state = {
    startDate: this.props.startDate,
    endDate: this.props.endDate
  };

  formatDateDisplay(start, end) {
    var formatStr = "MMM D, YYYY";
    var startStr = format(start, formatStr);
    var endStr = format(end, formatStr);

    // in case a single day
    if (startStr === endStr) {
      return startStr;
    }

    return startStr + " - " + endStr;
  }

  handleDateSelection = event => {
    // prevents user from selecting a range greater than 365 days
    const maxRangeDays = 365;
    const currentRangeDays = Math.ceil(
      Math.abs((event.selection.startDate - event.selection.endDate) / 8.64e7)
    );

    if (currentRangeDays >= maxRangeDays) {
      event.selection.endDate = addDays(
        event.selection.startDate,
        maxRangeDays
      );
    }

    // prevents user from selecting a date bigger than today (endDate > today)
    // calculate after 365 range check in case it places the range to after today's date
    if (compareAsc(event.selection.endDate, new Date()) > 0) {
      event.selection.endDate = new Date();
    }

    this.setState({
      startDate: event.selection.startDate,
      endDate: event.selection.endDate
    });
  };

  handleDone = () => {
    this.props.handleDone(this.state.startDate, this.state.endDate);
  };

  render() {
    const selectionRange = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      key: "selection"
    };

    return (
      <div>
        <SimplePopover
          handleDone={this.handleDone}
          buttonLabel={this.formatDateDisplay(
            this.props.startDate,
            this.props.endDate
          )}
          buttonIcon={<DateSVG style={iconStyle} />}
        >
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={this.handleDateSelection}
            maxDate={new Date()}
          />
        </SimplePopover>
      </div>
    );
  }
}

export default DateRangeButton;
