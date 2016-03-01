# ledger-cli

API for the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

  * [Ledger 3](http://ledger-cli.org/)
  * [Node.js](nodejs.org) and npm

### Installing Ledger

The simplest way to install Ledger 3 is through [Homebrew](http://mxcl.github.com/homebrew/).

```
brew install ledger --HEAD
```

The `--HEAD` option is required to install version 3.x.

## Usage

Install `ledger-cli` and its dependencies with npm.

```
npm install ledger-cli
```

Then require the library and use the exported Ledger class to [execute commands](#available-commands).

```js
var Ledger = require('ledger-cli').Ledger;
```

You must provide the path to the Ledger journal file via the  `file` option

```js
var ledger = new Ledger({ file: 'path/to/ledger/journal/file.dat' });
```

### Available commands

There are five available Ledger commands.

* `accounts` - Lists all accounts for postings.
* `balance` - Reports the current balance of all accounts.
* `print` - Prints out the full transactions, sorted by date, using the same format as they would appear in a Ledger data file.
* `register` - Displays all the postings occurring in a single account.
* `stats` - Retrieves statistics, like number of unique accounts.
* `version` - Gets the currently installed Ledger version number.

### Accounts

Lists all accounts for postings. It returns a readable object `stream`.

```js
ledger.accounts()
  .on('data', function(account) {
    // account is the name of an account (e.g. 'Assets:Current Account')
  });
```

### Balance

The balance command reports the current balance of all accounts. It returns a readable object `stream`.

```js
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
    };
  })
  .once('end', function(){
    // completed
  })
  .once('error', function(error) {
    // error
  });
```

### Print

The print command formats the full list of transactions, ordered by date, using the same format as they would appear in a Ledger data file. It returns a readable stream.

```js
var fs = require('fs'),
    out = fs.createWriteStream('output.dat');

ledger.print().pipe(out);
```

### Register

The register command displays all the postings occurring in a single account. It returns a readable object `stream`.

```js
ledger.register()
  .on('data', function(entry) {
    // JSON object for each entry
    entry = {
      date: new Date(2014, 1, 1),
      cleared: true,
      pending: true,
      payee: 'Salary',
      postings: [{
        commodity: {
          currency: '£',
          amount: 1000,
          formatted: '£1,000.00'
        },
        account: 'Assets:Checking'
      }]
    };
  })
  .once('end', function(){
    // completed
  })
  .once('error', function(error) {
    // error
  });
```

### Stats

The stats command is used to retrieve statistics about the Ledger data file. It requires a Node style callback function that is called with either an error or the stats object.

```js
ledger.stats(function(err, stats) {
  if (err) { return console.error(err); }

  // stats is a map (e.g. stats['Unique accounts'] = 13)
});
```

### Version

The version command is used to get the Ledger binary version. It requires a Node style callback function that is called with either an error or the version number as a string.

```js
ledger.version(function(err, version) {
  if (err) { return console.error(err); }

  // version is a string (e.g. '3.0.0-20130529')
});
```
