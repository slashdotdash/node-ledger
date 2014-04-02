// The `ledger print` command returns a readable stream that outputs the Ledger file 'pretty printed'
module.exports.run = function(cli) {
  // print Ledger transactions sorted by date
  var process = cli.exec(['print', '--sort', 'd']);
  
  return process.stdout;
};
