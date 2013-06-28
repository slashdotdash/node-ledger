/*global exports, require */
(function () {
  var _ = require('lodash');
  
  // transaction posting matcher
  var toBePosting = function(expected) {
    var actual = this.actual;
    
    this.message = function () {
      return 'Expected ' + JSON.stringify(actual) + ' posting to be ' + JSON.stringify(expected);
    };

    return _.isEqual(actual, expected);
  };

  exports.toBePosting = toBePosting;
})();