/*global exports, require */
(function () {
  var csv = require('fast-csv'),
      EventEmitter = require("events").EventEmitter;

  // The balance command reports the current balance of all accounts.
  var Balance = (function() {
    var format = '%(quoted(display_total)),%(quoted(account)),%(quoted(partial_account)),%(depth)\n%/';

    function Balance(cli) {
      this.cli = cli;
      this.emitter = new EventEmitter();
    }

    Balance.prototype.run = function() {
      var args = ['balance', '--format', format],
          process = this.cli.exec(args);

      csv(process.stdout)
        .on('data', this.parse.bind(this))
        .once('end', this.end.bind(this))
       .parse();

      process.stderr.on('data', this.error.bind(this));

      return this.emitter;
    };
    
    Balance.prototype.parse = function(data) {
      try {
        var obj = {
          total: data[0],
          account: { 
            fullname: data[1],
            shortname: data[2],
            depth: parseInt(data[3], 10)
          }
        };
        
        this.emitter.emit('record', obj);
      } catch (ex) {
        this.emitter.emit('error', 'Failed to parse balance: ' + ex);
      }
    };
    
    Balance.prototype.end = function() {
      this.emitter.emit('end');
    };
    
    Balance.prototype.error = function(error) {
      this.emitter.emit('error', error);
    };
    
    return Balance;
  })();

  exports.Balance = Balance;
})();