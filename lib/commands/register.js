/*global exports, require */
(function () {
  var csv = require('fast-csv'),
      Stream = require('stream').Stream;
      
  // The register command displays all the postings occurring in a single account, line by line. 
  var Register = (function() {
    var initialFormat = [
      '%(quoted(date))',
      '%(effective_date ? quoted(effective_date) : "")',
      '%(code ? quoted(code) : "")',
      '%(cleared ? "true" : "false")',
      '%(pending ? "true" : "false")',
      '%(quoted(payee))',
      '%(quoted(display_account))',
      '%(quoted(amount))'
    ];
    var subsequentFormat = [ 
      '%(quoted(display_account))', 
      '%(quoted(amount))' 
    ];
    
    function Register(cli) {
      this.cli = cli;
      this.output = new Stream({ readable: true, writable: false });
      this.current = null;
    }

    Register.prototype.run = function() {
      var format = initialFormat.join(',') + '%/\n,,,,,,' + subsequentFormat.join(',') + '%/',
          args = ['register', '--format', format],
          process = this.cli.exec(args);

      csv(process.stdout)
        .on('data', this.parse.bind(this))
        .once('end', this.end.bind(this))
       .parse();

      process.stderr.on('data', this.error.bind(this));

      return this.output;
    };
    
    Register.prototype.parse = function(data) {
      try {
        if (data[0].length !== 0) {
          this.emitCurrent();
          this.parseCurrent(data);
        }

        this.appendPosting(data);
      } catch (ex) {
        this.output.emit('error', 'Failed to parse balance: ' + ex);
      }
    };
    
    Register.prototype.emitCurrent = function() {
      if (this.current !== null) {
        // emit completed record        
        this.output.emit('data', this.current);
        this.current = null;
      }
    };
    
    Register.prototype.parseCurrent = function(data) {
      this.current = {
        date: this.toDate(data[0]),
        effectiveDate: this.toDate(data[1]),
        code: data[2],
        cleared: data[3] === 'true',
        pending: data[4] === 'true',
        payee: data[5],
        postings: []
      };
    };
    
    Register.prototype.appendPosting = function(data) {
      this.current.postings.push({
        account: data[6],
        amount: data[7]
      });
    };
    
    Register.prototype.end = function() {
      this.emitCurrent();
      this.output.emit('end');
    };
    
    Register.prototype.error = function(error) {
      this.output.emit('error', error);
    };
    
    Register.prototype.toDate = function(str) {
      if (str.length === 0) {
        return null;
      }
      
      var date = str.split('/');
      
      return new Date(date[0], date[1], date[2]);
    };
    
    return Register;
  })();

  exports.Register = Register;
})();