/*global exports, require */
(function () {
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

      this.cli.exec(args, function(err, line) {
        try {
          var obj = JSON.parse(line.toString());
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