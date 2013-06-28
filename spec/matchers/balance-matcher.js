/*global exports, require */
(function () {
  var _ = require('lodash');
  
  // account matcher
  var toBeBalance = function(expected) {
    var actual = this.actual;
    
    this.message = function () {
      return 'Expected ' + JSON.stringify(actual) + ' balance to be ' + JSON.stringify(expected);
    };
    
    return _.isEqual(actual, expected);
  };

  exports.toBeBalance = toBeBalance;
})();