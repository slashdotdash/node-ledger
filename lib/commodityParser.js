var CommodityParser = {
  // Parse an amount from a given string such as £-1,000.00
  parse: function(data) {
    var currency = '';
    var matches = data.match(/^.*[^\.,\-\s0-9]/);
    if (matches !== null) {
      var currency = matches[0];
    }
    var amount = parseFloat(data.replace(currency, '').replace(',', '').trim());

    return {
      currency: currency,
      amount: amount,
      formatted: data
    };
  }
};

module.exports.CommodityParser = CommodityParser;
