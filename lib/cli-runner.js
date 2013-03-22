/*global exports, require, console */
(function () {
  var _ = require('lodash'),
      spawn = require('child_process').spawn,
      BufferedStream = require('./stream/buffered-stream').BufferedStream;
  
  var Cli = (function() {
    function Cli(command, options) {
      this.command = command;
      this.options = _.extend({debug: false}, options);
    }
    
    Cli.prototype.exec = function(args, callback) {
      this.log(this.command + ' ' + args.join(' '));
      
      var process = spawn(this.command, args),
          self = this,
          buffered = new BufferedStream();

      process.stdout.setEncoding('utf8');
      process.stderr.setEncoding('utf8');

      process.stdout.pipe(buffered);

      buffered.on('data', function (data) {
        self.log('stdout: ' + data);
        callback(null, data);
      });
      
      process.stderr.on('data', function (error) {
        self.log('stderr: ' + error);
        callback(error);
      });

      process.on('close', function (code) {
        self.log('child process exited with code ' + code);
      });
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