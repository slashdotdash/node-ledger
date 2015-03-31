var _ = require('lodash'),
    Cli = require('./cli-runner').Cli,
    accounts = require('./commands/accounts'),
    balance = require('./commands/balance'),
    print = require('./commands/print'),
    register = require('./commands/register'),
    stats = require('./commands/stats'),
    version = require('./commands/version');

var Ledger = (function() {
  var config = {
    binary: '/usr/local/bin/ledger',
    debug: false
  };
  
  function Ledger(options) {
    this.options = _.defaults({}, options, config);

    this.cli = new Cli(this.options.binary, { debug: this.options.debug });
  }

  // version reports the current installed Ledger version.
  Ledger.prototype.version = function(callback) {
    version.run(this.cli, callback);
  };

  // accounts reports the list of accounts.
  Ledger.prototype.accounts = function() {
    return accounts.run(this.withLedgerFile(this.cli));
  };
  
  // balance reports the current balance of all accounts.
  Ledger.prototype.balance = function() {
    return balance.run(this.withLedgerFile(this.cli));
  };
  
  // register displays all the postings occurring in a single account.
  Ledger.prototype.register = function(options) {
    return register.run(this.withLedgerFile(this.cli), options);
  };

  // print returns a readable stream that outputs the Ledger file 'pretty printed'
  Ledger.prototype.print = function() {
    return print.run(this.withLedgerFile(this.cli));
  };

  // stats returns statistics, like number of unique accounts
  Ledger.prototype.stats = function(callback) {
    stats.run(this.withLedgerFile(this.cli), callback);
  };

  Ledger.prototype.withLedgerFile = function(cli) {
    var file = ['-f', this.options.file];

    return {
      exec: function(args) {
        return cli.exec(file.concat(args || []));
      }
    };
  };
  
  return Ledger;
})();

module.exports.Ledger = Ledger;
