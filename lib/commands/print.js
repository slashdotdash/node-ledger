// The print command returns a readable stream that outputs the Ledger file 'pretty printed'
var Print = (function() {
  function Print(cli) {
    this.cli = cli;
  }

  // print Ledger transactions sorted by date
  Print.prototype.run = function() {
    var process = this.cli.exec(['print', '--sort', 'd']);
    
    return process.stdout;
  };
  
  return Print;
})();

exports.Print = Print;