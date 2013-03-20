/*global exports, require */
(function () {
  var BufferedStream = require('./stream/buffered-stream').BufferedStream;
  
  var Balance = (function() {
    var format = ['{',
    '  "total": %(quoted(display_total)),',
    '  "account": {',
    '    "fullname": %(quoted(account)),',
    '    "shortname": %(quoted(partial_account)),',
    '    "depth": %(depth)',
    '  }',
    '}\n%/'];

    function Balance(cli) {
      this.cli = cli;
    }

    Balance.prototype.run = function(callback) {
      var args = ['--format', format.join(''), 'balance'];
      var buffered = new BufferedStream();
      
      var output = this.cli.exec(args);

      output.pipe(buffered);
      
      buffered.on('data', function (data) {
        try {
          var obj = JSON.parse(data.toString());
          callback(null, obj);
        } catch (ex) {
          callback(ex);
        }
      });
    };
    
    return Balance;
  })();

  exports.Balance = Balance;
})();