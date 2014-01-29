var Stream = require('stream').Stream;

var trim = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

// The accounts command displays the list of accounts used in a Ledger file.
var Accounts = (function() {
  function Accounts(cli) {
    this.cli = cli;
    this.output = new Stream({ readable: true, writable: false });
    this.buffer = '';
  }

  Accounts.prototype.run = function(callback) {
    var process = this.cli.exec(['accounts']);
    
    process.stdout.on('data', this.parseAccount.bind(this));
    
    process.stdout.once('end', function() {
      if (this.buffer) {
        this.output.emit('data', trim(this.buffer));
      }

      this.output.emit('end');
    }.bind(this));

    process.stderr.once('data', function(error) {
      callback(error);
    });

    return this.output;
  };

  Accounts.prototype.parseAccount = function(entry) {
    this.buffer += entry;

    var index = this.buffer.indexOf('\n');

    while (index) {
      var line = this.buffer.substr(0, index);
      this.output.emit('data', trim(line));
      
      this.buffer = this.buffer.substr(index);
      index = this.buffer.indexOf('\n');
    }
  };
  
  return Accounts;
})();

exports.Accounts = Accounts;