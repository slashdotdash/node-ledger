var chai = require('chai'),
    expect = chai.expect,
    Ledger = require('../lib/ledger').Ledger;

describe('Balance', function() {
  var spec;
  
  beforeEach(function() {
    spec = this;
  });
  
  describe('single transaction', function() {
    var ledger, balances;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/single-transaction.dat'});
      balances = [];

      ledger.balance()
        .on('data', function(entry) {
          balances.push(entry);
        })
        .once('end', function(){
          done();
        })
        .on('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it('should return balance for two accounts', function() {
      expect(balances.length).to.equal(2);
    });

    it('should parse first balance', function() {
      expect(balances[0]).to.eql({
        total: {
          currency: '£',
          amount: 1000,
          formatted: '£1,000.00'
        },
        account: {
          fullname: 'Assets:Checking',
          shortname: 'Assets:Checking',
          depth: 2
        }
      });
    });

    it('should parse second balance', function() {
      expect(balances[1]).to.eql({
        total: {
          currency: '£',
          amount: -1000,
          formatted: '£-1,000.00'
        },
        account: {
          fullname: 'Income:Salary',
          shortname: 'Income:Salary',
          depth: 2
        }
      });
    });
  });
});