/*global exports, require */
(function () {
  var stream = require('stream'),
      util = require('util'),
      Transform = stream.Transform;

  var BufferedStream = (function() {
    function BufferedStream(options) {
      if (!(this instanceof BufferedStream)) {
        return new BufferedStream(options);
      }
      
      Transform.call(this, options);
      
      this.buffer = '';
    }
    
    util.inherits(BufferedStream, Transform);

    BufferedStream.prototype.pump = function() {
      var position;

      while ((position = this.buffer.indexOf('\n')) >= 0) {
        if (position === 0) {
          this.buffer = this.buffer.slice(1);
          continue;
        }
      
        this.process(this.buffer.slice(0, position));
      
        this.buffer = this.buffer.slice(position + 1);
      }      
    };

    BufferedStream.prototype.process = function(line) {
      if (line[line.length - 1] === '\r') {
        line = line.substr(0, line.length - 1);  // discard CR
      }
    
      if (line.length > 0) {
        this.push(line);
      }      
    };
  
    BufferedStream.prototype._transform = function(chunk, encoding, done) {
      this.buffer += chunk.toString();
      this.pump();
      
      done();
    };
    
    return BufferedStream;
  })();

  exports.BufferedStream = BufferedStream;
})();