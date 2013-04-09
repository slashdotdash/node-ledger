/*global exports, require */
(function () {
  var csv = require('csv'),
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

      csv()
        .from.stream(process.stdout)
        .on('record', this.parse.bind(this))
        .once('end', this.end.bind(this));

      process.stderr.on('data', this.error.bind(this));

      return this.output;
    };
    
    Balance.prototype.parse = function(data, index) {
      try {
        var total = this.parseAmount(data[0].toString());
        
        var obj = {
          total: total,          
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
    
    // Parse an amount from a given string such as £-1,000.00
    Balance.prototype.parseAmount = function(data) {
      var currency = data.match(/^.*[^\.,\-\s0-9]/)[0];
      var amount = parseFloat(data.replace(currency, '').replace(',', '').trim());

      return {
        currency: currency,
        amount: amount,
        formatted: data
      }
    };
    
    Balance.prototype.end = function(count) {
      this.output.emit('end');
    };
    
    Balance.prototype.error = function(error) {
      this.output.emit('error', error);
    };
    
    return Balance;
  })();

  exports.Balance = Balance;
})();