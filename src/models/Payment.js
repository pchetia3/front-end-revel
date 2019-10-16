/**
 * A data class for storing the type of payments, their values, and helper methods
 */
class Payment {
  /**
   * Payment type that represents all payments
   * @type {Payment} all Payment object
   */
  static all = new Payment(null, "All", null);

  /**
   * Payment type that represents all cash payments
   * @type {Payment} cash Payment object
   */
  static cash = new Payment(1, "Cash", "cash");

  /**
   * Payment type that represents credit payments
   * @type {Payment} credit Payment object
   */
  static credit = new Payment(2, "Credit", "credit");

  /**
   * Payment type that represents other payments
   *
   * @type {Payment} other Payment object
   */
  static other = new Payment(3, "Other", "other");

  /**
   * All the types available
   * @type {Payment[]} list of all Payment objects
   */
  static types = [Payment.all, Payment.cash, Payment.credit, Payment.other];

  /**
   * Create a new Payment object
   *
   * @param value the identifier, used to convert between backend parameter values and UI elements
   * @param title the title of the payment which is displayed on the front end
   */
  constructor(value, title, requestTitle) {
    this.value = value;
    this.title = title;
    this.requestTitle = requestTitle;
  }

  /**
   * Convert an identifier to a Payment object
   *
   * @param value the identifier used to find the Payment object
   * @returns {Payment} the Payment object with that identifier
   */
  static createFromValue(value) {
    return this.types.find(element => {
      return element.value === value;
    });
  }

  /**
   * Convert a title to a Payment object
   *
   * @param title the title of the object displayed in the front end
   * @returns {Payment} the Payment object that matches that title
   */
  static createFromTitle(title) {
    return this.types.find(element => {
      return element.title === title;
    });
  }
}

export default Payment;
