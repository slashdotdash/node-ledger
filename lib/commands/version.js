/*global exports */
(function () {
  // The version command reports the current installed Ledger version.
  var Version = (function() {
    function Version(cli) {
      this.cli = cli;
    }

    Version.prototype.run = function(callback) {
      var process = this.cli.exec(['--version']);
      
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
    
    return Version;
  })();

  exports.Version = Version;
})();