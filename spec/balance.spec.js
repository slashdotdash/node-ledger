/*global require, describe, beforeEach, it, expect */
var ledger = require('../lib/ledger'),
    Ledger = ledger.Ledger,
    toBeBalance = require('./matchers/balance-matcher').toBeBalance;

describe('Balance', function() {
  var spec;
  
  beforeEach(function() {
    spec = this;
    spec.addMatchers({ toBeBalance: toBeBalance });
  });
  
  describe('single transaction', function() {
    var ledger, balances;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/single-transaction.dat'}),
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

    it("should return balance for two accounts", function() {
      expect(balances.length).toBe(2);
    });

    it("should parse first balance", function() {
      expect(balances[0]).toBeBalance({ 
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

    it("should parse second balance", function() {
      expect(balances[1]).toBeBalance({
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