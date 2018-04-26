var request = require('request');
var mysql = require('mysql');

//skip file paths
for (var i = 2; i < process.argv.length; i++) {
    request.get('https://coinmetrics.io/data/' + process.argv[i] + '.csv', function (error, response, body) {
        var date = [];
        var tradeVol = [];
        var tradeCount = [];
        var marketCap = [];
        var price = [];
        var exchangeVol = [];
        var genCoins = [];
        var fees = [];
        var fuck = [];

        if (!error && response.statusCode == 200) {
            var csv = body.split(',');
            csv[8] = csv[8].split('\n');
            //flatten array
            var merged = [].concat.apply([], csv);
            //console.log(merged);
            //skip column names
            for (var j = 9; j < csv.length; j++) {
                if (j % 9 === 0 ) {
                    //first date entry doesnt havfe line break character
                    if (j === 9) { 
                        date.push(merged[j]);
                        continue;
                    }

                    //remove leading line break
                    date.push(merged[j].split('\n')[1]);
                }

                else if ( j % 9 === 1) {
                    tradeVol.push(merged[j]);
                }

                else if ( j % 9 === 2) {
                    tradeCount.push(merged[j]); 
                }

                else if ( j % 9 === 3) {
                    marketCap.push(merged[j]);
                }

                else if ( j % 9 === 4) {
                    price.push(merged[j]);
                }

                else if ( j % 9 === 5) {
                    exchangeVol.push(merged[j]);
                }

                else if ( j % 9 === 6) {
                    genCoins.push(merged[j]);
                }

                else if ( j % 9 === 7) {
                    fees.push(merged[j]);
                }
                //throw away null values
                else if ( j % 9 === 8) {
                }
            } 
        }

        var con = mysql.createConnection({
            host: "cryptos.cvndjrqk9gtt.us-east-2.rds.amazonaws.com",
            user: "",
            password: "",
            database: "cryptos"
          });
          
          con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
          
            /* creating table
            var sql = "CREATE TABLE coins (date DATE, tradeVol INT, tradeCount INT, marketCap BIGINT, price DOUBLE(10,2), exchangeVol INT, genCoins INT, fees INT)";
            con.query(sql, function(err,results) {
              if (err) throw err;
              console.log('created');
            });
            */

            var sql = "INSERT INTO coins (date, tradeVol, tradeCount, marketCap, price, exchangeVol, genCoins, fees) VALUES ?";
            con.query(sql, [date, tradeVol, tradeCount, marketCap, price, exchangeVol, genCoins, fees], function(err, results) {
                if (err) throw err;
                console.log('inserted correctly');
            }); 
          });
    });
}
