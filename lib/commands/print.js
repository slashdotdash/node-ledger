// The `ledger print` command returns a readable stream that outputs the Ledger file 'pretty printed'
module.exports.run = function() {
  // print Ledger transactions sorted by date
  var process = this.cli.exec(['print', '--sort', 'd']);
  
  return process.stdout;
};