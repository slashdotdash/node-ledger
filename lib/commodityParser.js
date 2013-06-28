/*global exports */
(function () {
  var CommodityParser = {
    // Parse an amount from a given string such as £-1,000.00
    parse: function(data) {
      var currency = data.match(/^.*[^\.,\-\s0-9]/)[0];
      var amount = parseFloat(data.replace(currency, '').replace(',', '').trim());

      return {
        currency: currency,
        amount: amount,
        formatted: data
      };
    }
  };
  
  exports.CommodityParser = CommodityParser;
})();