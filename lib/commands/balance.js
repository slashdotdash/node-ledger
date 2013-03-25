/*global exports, require */
(function () {
  var csv = require('fast-csv'),
      Stream = require('stream').Stream;

  // The balance command reports the current balance of all accounts.
  var Balance = (function() {
    var format = '%(quoted(display_total)),%(quoted(account)),%(quoted(partial_account)),%(depth)\n%/';

    function Balance(cli) {
      this.cli = cli;
      this.output = new Stream({ readable: true, writable: false });
    }

    Balance.prototype.run = function() {
      var args = ['balance', '--format', format],
          process = this.cli.exec(args);

      csv(process.stdout)
        .on('data', this.parse.bind(this))
        .once('end', this.end.bind(this))
       .parse();

      process.stderr.on('data', this.error.bind(this));

      return this.output;
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
        
        this.output.emit('data', obj);
      } catch (ex) {
        this.output.emit('error', 'Failed to parse balance: ' + ex);
      }
    };
    
    Balance.prototype.end = function() {
      this.output.emit('end');
    };
    
    Balance.prototype.error = function(error) {
      this.output.emit('error', error);
    };
    
    return Balance;
  })();

  exports.Balance = Balance;
})();