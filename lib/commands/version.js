// The version command reports the current installed Ledger version.
module.exports.run = function(cli, callback) {
  var process = cli.exec(['--version']);
  
  process.stdout.once('data', function(data) {
    var matches = data.toString().match(/Ledger (.*),/);
    
    if (matches) {
      callback(null, matches[1]);
    } else {
      callback('Failed to match Ledger version');
    }
  });
  
  process.stderr.once('data', function(error) {
    callback(error);
  });
};