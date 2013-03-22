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

    Ledger.prototype.version = function(callback) {
      this.cli.exec(['--version'], _.once(function(err, data) {
        if (err) return callback(err);
        
        var matches = data.toString().match(/Ledger (.*),/);
        
        if (matches) {
          callback(null, matches[1]);
        } else {
          callback('Failed to match Ledger version');
        }
      }));
    };
    
    Ledger.prototype.balance = function(callback) {
      new Balance(this.execWithLedgerFile(this.cli)).run(callback);
    };
    
    Ledger.prototype.execWithLedgerFile = function(cli) {
      var file = ['-f', this.options.file];

      return {
        exec: function(args, callback) {
          cli.exec(file.concat(args || []), callback);
        }
      };
    };
    
    return Ledger;
  })();

  exports.Ledger = Ledger;
})();