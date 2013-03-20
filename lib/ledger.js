/*global exports, require */
(function () {
  var _ = require('lodash'),
      Cli = require('./cli-runner').Cli,
      Balance = require('./balance').Balance;
  
  var Ledger = (function() {
    var config = {
      binary: '/usr/local/bin/ledger'
    };
    
    function Ledger(options) {
      this.options = _.defaults(config, (options || {}));

      this.cli = new Cli(this.options.binary);
    }

    Ledger.prototype.version = function(success, failure) {
      this.cli.exec(['--version'], function(data) { 
        var matches = data.toString().match(/Ledger (.*),/);
        
        if (matches) {
          success(matches[1]);
        } else {
          failure(); 
        }
      });
    };
    
    Ledger.prototype.balance = function(callback) {
      new Balance(this.execWithLedgerFile(this.cli)).run(callback);
    };
    
    Ledger.prototype.execWithLedgerFile = function(cli) {
      var file = ['-f', this.options.file];

      return {
        exec: function(args, callback) {
          return cli.exec(file.concat(args || []), callback);
        }
      };
    };
    
    return Ledger;
  })();

  exports.Ledger = Ledger;
})();