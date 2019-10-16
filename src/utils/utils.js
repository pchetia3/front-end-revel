export function commaify(text) {
  if (typeof text == "undefined") {
    return "";
  }

  return text.toString().replace(/\B(?=(\d{3})+(?!\d))/gi, ",");
}
