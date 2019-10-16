import Formatter from "../models/Formatter";

/**
 * Categories used to populate EmployeeOrderReport by storing the name, headers, and useful methods to convert data
 */
class OrderCategory {
  /**
   * Refund data stored in an OrderCategory
   * @type {OrderCategory} specific refund data
   */
  static refunds = new OrderCategory(
    "Refunds",
    [
      "Order ID",
      "Created Date",
      "Refund Total",
      "Manager Password",
      "Payment Type"
    ],
    ["Product ID", "Refund Date", "Refund Amount", "Reason"],
    "refundsThreshold",
    Formatter.refundReportFormatter,
    Formatter.refundItemFormatter
  );

  /**
   * Void data stored in an OrderCategory
   * @type {OrderCategory} specific void data
   */
  static voids = new OrderCategory(
    "Voids",
    ["Order ID", "Created Date", "Void Total", "Manager Password"],
    ["Product ID", "Void Date", "Void Amount", "Reason"],
    "voidsThreshold",
    Formatter.voidReportFormatter,
    Formatter.voidItemFormatter
  );

  /**
   * Discount data stored in an OrderCategory
   * @type {OrderCategory} specific discount data
   */
  static discounts = new OrderCategory(
    "Discounts",
    [
      "Order ID",
      "Created Date",
      "Amount Discounted",
      "Order Total",
      "Manager Password",
      "Payment Type"
    ],
    ["Product ID", "Discount Amount", "Price", "Reason"],
    "discountsThreshold",
    Formatter.discountReportFormatter,
    Formatter.discountItemFormatter
  );

  /**
   * All possible types for orders
   *
   * @type {OrderCategory[]} each OrderCategory that can be used
   */
  static types = [
    OrderCategory.refunds,
    OrderCategory.voids,
    OrderCategory.discounts
  ];

  /**
   * Create a new OrderCategory to be displayed in EmployeeReportFormatter
   *
   * @param title the text to be displayed on the ExpandablePanel
   * @param orderHeader the header which will populate the data table in the ExpandablePanel
   * @param itemHeader the header which will populate the data table in Drawer
   * @param formatter formatter used for populating the expandable data table
   * @param itemFormatter formatter used for populating item drawer
   */
  constructor(
    title,
    orderHeader,
    itemHeader,
    thresholdRequestTitle,
    formatter,
    itemFormatter
  ) {
    this.title = title;
    this.orderHeader = orderHeader;
    this.itemHeader = itemHeader;
    this.thresholdRequestTitle = thresholdRequestTitle;
    this.formatter = formatter;
    this.itemFormatter = itemFormatter;
  }

  /**
   * List all the titles of OrderCategory, useful for mapping the titles to something
   *
   * @returns {[String]} an string array of all the titles
   */
  static listTypes() {
    return OrderCategory.types.map(type => type.title);
  }

  /**
   * Convert a title to a OrderCategory object
   *
   * @param title the title of the desired OrderCategory object
   * @returns {OrderCategory} the OrderCategory object found
   */
  static categoryFromTitle(title) {
    return OrderCategory.types.find(type => title === type.title);
  }
}

export default OrderCategory;
