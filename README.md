# ledger-cli

API for the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

Requires the Ledger to be installed, for Mac OS X using homebrew and latest 3.0 version.

    brew install ledger --HEAD

## Usage

Install dependencies with npm.

    npm install ledger-cli

Use the Ledger class to execute reports (only balance is currently supported).

    var Ledger = require('ledger-cli).Ledger;
    ledger = new Ledger({ file: 'path/to/ledger/journal/file.dat' });
    
### Balance    

The balance command reports the current balance of all accounts.

    ledger.balance()
      .on('record', function(entry) {
        // JSON object for each entry
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
      .on('record', function(entry) {
        // JSON object for each entry
      })
      .once('end', function(){
        // completed
      })
      .on('error', function(error) {
        // error
      });