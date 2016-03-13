var CommodityParser = {
  // Parse an amount from a given string that looks like one of the following
  // cases:
  //   £-1,000.00
  //   5 STOCKSYMBOL {USD200}
  //   -900.00 CAD {USD1.1111111111} [13-Mar-19]
  parse: function(data) {
    // Strip out unneeded details.
    data = data.replace(/{.*}/g, '');
    data = data.replace(/\[.*\]/g, '');
    data = data.trim();

    // Find the amount first.
    var amountMatch = data.match(/-?[0-9,.]+/);
    if (amountMatch == null) {
      throw ('Could not get amount from string: ' + data);
    }
    var amountString = amountMatch[0];

    // Strip commas and parse amount as a float.
    var amount = parseFloat(amountString.replace(/,/g, ''));

    // Remove the amount from the data string, and use the rest as the currency.
    var currency = data.replace(amountString, '').trim();

    return {
      currency: currency,
      amount: amount,
      formatted: data
    };
  }
};

module.exports.CommodityParser = CommodityParser;
