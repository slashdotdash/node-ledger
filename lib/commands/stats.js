module.exports.run = function(cli, callback) {
  var process = cli.exec(['stats']);

  process.stdout.once('data', function(data) {
    var stats = null,
        split = data.toString().split('\n'),
        files = data.match(/Files these postings came from:([^]*?)(\r?\n){2}/);

    split.forEach(function(el){
      var prop = el.trim().match(/^(.*):[\s]+(.*)$/);
      if (prop) {
       if (stats === null) {
         stats = new Object();
       }
       stats[prop[1]] = prop[2];
      }
    });

    if (files) {
      if (stats === null) {
        stats = new Object();
      }

      // convert files[1] == paths capture to array and remove empty entries
      stats['files'] = files[1].split('\n').map(function(entry) {
        return entry.trim();
      }).filter(Boolean);
    }

    if (stats !== null) {
      callback(null, stats);
    } else {
      callback('Failed to parse Ledger stats');
    }
  });

  process.stderr.once('data', function(error) {
    callback(error);
  });
};
