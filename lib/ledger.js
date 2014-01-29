var _ = require('lodash'),
    Cli = require('./cli-runner').Cli,
    Accounts = require('./commands/accounts').Accounts,
    Balance = require('./commands/balance').Balance,
    Register = require('./commands/register').Register,
    Version = require('./commands/version').Version;

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
    new Version(this.cli).run(callback);
  };

  // accounts reports the list of accounts.
  Ledger.prototype.accounts = function() {
    return new Accounts(this.withLedgerFile(this.cli)).run();
  };
  
  // balance reports the current balance of all accounts.
  Ledger.prototype.balance = function() {
    return new Balance(this.withLedgerFile(this.cli)).run();
  };
  
  // register displays all the postings occurring in a single account.
  Ledger.prototype.register = function(options) {
    return new Register(this.withLedgerFile(this.cli)).run(options);
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

exports.Ledger = Ledger;