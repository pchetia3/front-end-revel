import React from "react";
import OrderCategory from "./OrderCategory";
import Payment from "./Payment";
import Tooltip from "@material-ui/core/Tooltip";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { commaify } from "../utils/utils";
import { TableCell } from "@revel/core";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import WarningIndicator from "../components/WarningIndicator";

/**
 * Provides the ability to format responses received from the backend into objects which can be passed into a DataTable
 */

class Formatter {
  /**
   * Determine if a row show should a warning indicator
   *
   * @param response the response from backend
   * @returns the warning icon or nothing if it is not flagged
   */
  static warningIndicator(response) {
    if (
      JSON.stringify(response) &&
      JSON.stringify(response).includes("threshold")
    ) {
      return <WarningIndicator />;
    }

    return "";
  }
  static formatDate(str, delimiter) {
    if (delimiter !== "") {
      var splitString = str.split(delimiter);
      var str = splitString.join("");
    }

    var year = str.substr(0, 4);
    var month = str.substr(4, 2).concat("/");
    var day = str.substr(6, 2).concat("/");

    var date = month + day + year;

    return date;
  }

  static formatColumn(prefix, value, tooltip) {
    const thresholdValue = value.threshold ? value.threshold : 0;
    let total = value.sum ? value.sum : value.total ? value.total : 0;

    if (prefix === "$") {
      total = total.toFixed(2);
    }

    if (tooltip && thresholdValue > 0) {
      return (
        <Tooltip
          title={"$" + commaify(thresholdValue) + " Threshold Exceeded"}
          placement="top-end"
        >
          <Typography
            style={{
              borderBottom: "2px solid red"
            }}
            variant="body2"
          >
            {prefix + commaify(total)}
          </Typography>
        </Tooltip>
      );
    }
    return prefix + commaify(total);
  }

  static lossPreventionFormatter = (response, estID, start, end) => {
    return Object.keys(response).map(id => {
      const employee = response[id];

      return [
        <Link
          component={RouterLink}
          to={{
            pathname: "/reports/employee",
            search: "?establishment_id=" + estID + "&employee_id=" + id,
            state: {
              openCategory: null,
              clicked: false,
              startDate: start,
              endDate: end
            }
          }}
        >
          <Typography variant="body2">
            {Formatter.warningIndicator(employee)} {id}
          </Typography>
        </Link>,
        <Link
          component={RouterLink}
          to={{
            pathname: "/reports/employee",
            search: "?establishment_id=" + estID + "&employee_id=" + id,
            state: {
              openCategory: "Refunds",
              clicked: true,
              startDate: start,
              endDate: end
            }
          }}
        >
          {Formatter.formatColumn("", employee.refundCount)}
        </Link>,
        Formatter.formatColumn("$", employee.refundTotal, true),
        Formatter.formatColumn("$", employee.refundAvg),
        <Link
          component={RouterLink}
          to={{
            pathname: "/reports/employee",
            search: "?establishment_id=" + estID + "&employee_id=" + id,
            state: {
              openCategory: "Voids",
              clicked: true,
              startDate: start,
              endDate: end
            }
          }}
        >
          {Formatter.formatColumn("", employee.voidCount)}
        </Link>,
        Formatter.formatColumn("$", employee.voidTotal, true),
        <Link
          component={RouterLink}
          to={{
            pathname: "/reports/employee",
            search: "?establishment_id=" + estID + "&employee_id=" + id,
            state: {
              openCategory: "Discounts",
              clicked: true,
              startDate: start,
              endDate: end
            }
          }}
        >
          {" "}
          {Formatter.formatColumn("", employee.discountCount)}
        </Link>,
        Formatter.formatColumn("$", employee.discountTotal, true),
        Formatter.formatColumn("$", employee.discountAvg)
      ];
    });
  };

  static totalsFooterFormatter = tot => {
    return [
      <Typography variant="body2">
        {Formatter.warningIndicator(tot)} Total
      </Typography>,
      Formatter.formatColumn("", tot ? tot.refundCount : 0),
      Formatter.formatColumn("$", tot ? tot.refundTotal : 0, true),
      Formatter.formatColumn("$", tot ? tot.refundAvg : 0),
      Formatter.formatColumn("", tot ? tot.voidCount : 0),
      Formatter.formatColumn("$", tot ? tot.voidTotal : 0, true),
      Formatter.formatColumn("", tot ? tot.discountCount : 0),
      Formatter.formatColumn("$", tot ? tot.discountTotal : 0, true),
      Formatter.formatColumn("$", tot ? tot.discountAvg : 0)
    ].map((item, index) => {
      return (
        <TableCell key={index} variant="footer" align="left">
          {item}
        </TableCell>
      );
    });
  };

  static refundReportFormatter = (onSelectOrder, response) => {
    return Object.keys(response).map(id => {
      const order = response[id];
      const date = order.created_date.toString().split(" ")[0];
      const time = order.created_date.toString().split(" ")[1];
      const dateTimeStamp =
        this.formatDate(order.created_date.toString().split(" ")[0], "") +
        " " +
        time;

      return [
        <Link onClick={() => onSelectOrder(OrderCategory.refunds, id, order)}>
          <Typography variant="body2">
            {Formatter.warningIndicator(order)} {id}
          </Typography>
        </Link>,
        dateTimeStamp,
        Formatter.formatColumn("$", order, true),
        "-",
        Formatter.paymentPortionToString(order.payment_portions)
      ];
    });
  };

  static refundItemFormatter = orders => {
    return orders.map(order => {
      const date = order.date.split(" ")[0];
      const time = order.date
        .split(" ")[1]
        .split(".")[0]
        .substr(0, 5);
      const dateTime = this.formatDate(date, "-");

      return [
        order.item_id,
        dateTime + " " + time,
        "$" + commaify(order.price.toFixed(2)),
        order.reason
      ];
    });
  };

  static voidReportFormatter = (onSelectOrder, response) => {
    return Object.keys(response).map(id => {
      const order = response[id];
      const date = order.created_date.toString().split(" ")[0];
      const time = order.created_date.toString().split(" ")[1];
      const dateTimeStamp =
        this.formatDate(order.created_date.toString().split(" ")[0], "") +
        " " +
        time;

      return [
        <Link onClick={() => onSelectOrder(OrderCategory.voids, id, order)}>
          <Typography variant="body2">
            {Formatter.warningIndicator(order)} {id}
          </Typography>
        </Link>,
        dateTimeStamp,
        Formatter.formatColumn("$", order, true),
        "-"
      ];
    });
  };

  static voidItemFormatter = order => {
    return Formatter.refundItemFormatter(order);
  };

  static discountReportFormatter = (onSelectOrder, response) => {
    return Object.keys(response).map(id => {
      const order = response[id];

      const date = order.created_date.toString().split(" ")[0];
      const time = order.created_date.toString().split(" ")[1];
      const dateTimeStamp =
        this.formatDate(order.created_date.toString().split(" ")[0], "") +
        " " +
        time;

      return [
        <Link onClick={() => onSelectOrder(OrderCategory.discounts, id, order)}>
          <Typography variant="body2">
            {Formatter.warningIndicator(order)} {id}
          </Typography>
        </Link>,
        dateTimeStamp,
        Formatter.formatColumn("$", order, true),
        "$" + commaify(order.post_discount),
        "-",
        Formatter.paymentPortionToString(order.payment_portions)
      ];
    });
  };

  static discountItemFormatter = orders => {
    return orders.map(order => {
      return [
        order.item_id,
        "$" + commaify(order.discount_amount.toFixed(2)),
        "$" + commaify(order.post_discount_price.toFixed(2)),
        order.discount_reasons[0]
      ];
    });
  };

  static paymentPortionToString(paymentPortion) {
    const column = Object.keys(paymentPortion)
      .map(payment => {
        return Payment.createFromValue(parseInt(payment)).title;
      })
      .join("/");
    const tooltip = Object.keys(paymentPortion)
      .map(payment => {
        return (
          "$" +
          commaify(paymentPortion[payment]) +
          " " +
          Payment.createFromValue(parseInt(payment)).title
        );
      })
      .join(" ");

    return (
      <Tooltip title={tooltip} placement="right">
        <div>{column}</div>
      </Tooltip>
    );
  }
}

export default withRouter(Formatter);
