import LocationIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import React from "react";

class ThresholdType {
  static locationLevel = new ThresholdType(
    "Location Level",
    <LocationIcon />,
    "locationLevel"
  );
  static employeeLevel = new ThresholdType(
    "Employee Level",
    <PersonIcon />,
    "employeeLevel"
  );
  static orderLevel = new ThresholdType(
    "Order Level",
    <MoneyIcon />,
    "orderLevel"
  );

  static all = [
    ThresholdType.locationLevel,
    ThresholdType.employeeLevel,
    ThresholdType.orderLevel
  ];

  constructor(title, icon, requestTitle) {
    this.title = title;
    this.icon = icon;
    this.requestTitle = requestTitle;
  }
}

export default ThresholdType;
