# ledger-cli

API for the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

  * [Ledger 3](http://ledger-cli.org/)
  * [Node.js](nodejs.org) and npm

### Installing Ledger

The simplest way to install Ledger 3 is through [Homebrew](http://mxcl.github.com/homebrew/).

    brew install ledger --HEAD

The `--HEAD` option is required to install version 3.x.

## Usage

Install `ledger-cli` and its dependencies with npm.

    npm install ledger-cli

Use the Ledger class to execute reports (balance & register are currently supported).

    var Ledger = require('ledger-cli').Ledger;
    ledger = new Ledger({ file: 'path/to/ledger/journal/file.dat' });
    
### Balance    

The balance command reports the current balance of all accounts.

    ledger.balance()
      .on('data', function(entry) {
        // JSON object for each entry
        entry = {
          total: {
            currency: '£',
            amount: 1000,
            formatted: '£1,000.00'
          }, 
          account: { 
            fullname: 'Assets:Checking',
            shortname: 'Assets:Checking',
            depth: 2,
          }
        }
      })
      .once('end', function(){
        // completed
      })
      .on('error', function(error) {
        // error
      });
    
### Register

The register command displays all the postings occurring in a single account.

    ledger.register()
      .on('data', function(entry) {
        // JSON object for each entry
      })
      .once('end', function(){
        // completed
      })
      .on('error', function(error) {
        // error
      });