/*global exports */
(function () {
  var spawn = require('child_process').spawn;
  
  var Cli = (function() {
    function Cli(command) {
      this.command = command;
    }
    
    Cli.prototype.exec = function(args, callback) {
      var process = spawn(this.command, args);
      
      process.stdout.setEncoding('utf8');
      process.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        callback(data);
      });

      process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });

      process.on('close', function (code) {
        console.log('child process exited with code ' + code);
      });
    };
    
    return Cli;
  })();
  
  exports.cli = Cli;
})();