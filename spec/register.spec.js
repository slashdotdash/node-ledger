var chai = require('chai'),
    expect = chai.expect,
    Ledger = require('../lib/ledger').Ledger;
  
describe('Register', function() {
  var spec;
  
  beforeEach(function() {
    spec = this;
  });
  
  describe('single transaction', function() {
    var ledger, entries;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/single-transaction.dat'});
      entries = [];
      
      ledger.register()
        .on('data', function(entry) {
          entries.push(entry);
        })
        .once('end', function(){
          done();
        })
        .once('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it('should return entry for single transaction', function() {
      expect(entries.length).to.equal(1);
    });

    it('should parse transaction', function() {
      var transaction = entries[0];
      expect(transaction.date - new Date(2013, 2, 19)).to.equal(0);
      expect(transaction.payee).to.equal('My Employer');
    });

    it('should parse the first posting', function() {
      var posting = entries[0].postings[0];
      expect(posting).to.eql({
        commodity: {
          currency: '£',
          amount: 1000,
          formatted: '£1,000.00'
        },
        account: 'Assets:Checking'
      });
    });
    
    it('should parse the second posting', function() {
      var posting = entries[0].postings[1];
      expect(posting).to.eql({
        commodity: {
          currency: '£',
          amount: -1000,
          formatted: '£-1,000.00'
        },
        account: 'Income:Salary'
      });
    });
  });
  
  describe('filtering by account', function() {
    var ledger, entries;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/drewr.dat'});
      entries = [];

      ledger.register({account: 'Income'})
        .on('data', function(entry) {
          entries.push(entry);
        })
        .once('end', function(){
          done();
        })
        .once('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it('should return entries for two matching transactions', function() {
      expect(entries.length).to.equal(2);
    });

    it('should parse first transaction', function() {
      var transaction = entries[0];
      expect(transaction.date - new Date(2004, 0, 5)).to.equal(0);
      expect(transaction.payee).to.equal('Employer');
      expect(transaction.postings.length).to.equal(1);
    });
    
    it('should parse second transaction', function() {
      var transaction = entries[1];
      expect(transaction.date - new Date(2004, 1, 1)).to.equal(0);
      expect(transaction.payee).to.equal('Sale');
      expect(transaction.postings.length).to.equal(1);
    });
  });
  
  // Handle transactions where the payee contains a double quote (')
  describe('quoted transaction', function() {
    var ledger, entries;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/quoted-transaction.dat'});
      entries = [];
      
      ledger.register()
        .on('data', function(entry) {
          entries.push(entry);
        })
        .once('end', function(){
          done();
        })
        .once('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it('should return entry for single transaction', function() {
      expect(entries.length).to.equal(1);
    });
  });
});