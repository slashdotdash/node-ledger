/*global exports, require, console */
(function () {
  var _ = require('lodash'),
      spawn = require('child_process').spawn;
  
  var Cli = (function() {
    function Cli(command, options) {
      this.command = command;
      this.options = _.extend({debug: false}, options);
    }
    
    Cli.prototype.exec = function(args, callback) {
      this.log(this.command + ' ' + args.join(' '));
      
      var process = spawn(this.command, args),
          self = this;
      
      process.stdout.setEncoding('utf8');
      process.stderr.setEncoding('utf8');

      if (callback) {
        process.stdout.on('data', function (data) {
          self.log('stdout: ' + data);
          callback(data);
        });
      }
      
      process.stderr.on('data', function (data) {
        self.log('stderr: ' + data);
      });

      process.on('close', function (code) {
        self.log('child process exited with code ' + code);
      });

      return process.stdout;
    };
    
    Cli.prototype.log = function(msg) {
      if (this.options.debug) {
        console.log(msg);
      }
    };
    
    return Cli;
  })();
  
  exports.Cli = Cli;
})();