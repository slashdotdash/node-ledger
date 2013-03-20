# node-ledger

API for the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

Requires the Ledger to be installed, for Mac OS X using homebrew and latest 3.0 version.

    brew install ledger --HEAD

## Usage

Install dependencies with npm.

    npm install

Use the Ledger class to execute reports (only balance is currently supported).

    ledger = new Ledger({ file: 'path/to/ledger/file.dat' });
    ledger.balance(function(err, entry) {
       // JSON object for each account 
    });