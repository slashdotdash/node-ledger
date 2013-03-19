/*global exports */
(function () {
  var Cli = require('./cli-runner').cli;
  
  var Ledger = (function() {
    function Ledger() {
      this.cli = new Cli('ledger')
    }

    Ledger.prototype.version = function(callback) {
      this.cli.exec(['--version'], function(data) { 
        var matches = data.toString().match(/Ledger (.*),/);
        
        if (matches) {
          callback(matches[1]);
        }
      });
    };
    
    return Ledger;
  })();

  exports.Ledger = Ledger;
})();