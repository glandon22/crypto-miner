var request = require('request');
var mysql = require('mysql');

//skip file paths
for (var i = 2; i < process.argv.length; i++) {
    var coinName = process.argv[i]
    request.get('https://coinmetrics.io/data/' + coinName + '.csv', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var csv = body.split(',');
            csv[8] = csv[8].split('\n');
            //flatten array
            var merged = [].concat.apply([], csv);
            //skip column names
            var rowHolder = [];
            var fullCoinData = [];
            for (var j = 9; j < csv.length; j++) {
                /*
                if (j % 9 === 0 ) {
                    //first date entry doesnt have line break character
                    if (j === 9) { 
                        date.push(merged[j]);
                        continue;
                    }

                    //remove leading line break
                    date.push(merged[j].split('\n')[1]);
                }
                */
                //clean date of leading new line character
                if (j % 9 === 0) {
                    //first date entry doesnt have line break character
                    if (j === 9) {
                        //add coin abbreviation as name
                        rowHolder.push(coinName.toString()); 
                        rowHolder.push(merged[j]);
                        continue;
                    }

                    rowHolder.push(coinName.toString()); 
                    //remove leading line break
                    rowHolder.push(merged[j].split('\n')[1]);
                }
                //push row into table holder
                else if (j % 9 === 8) {
                    fullCoinData.push(rowHolder);
                    rowHolder = [];
                }
                //push value into row holder
                else {
                    rowHolder.push(merged[j]);
                }
            }
            console.log(fullCoinData); 
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
          /*
            creating table
            var sql = "CREATE TABLE coins (date DATE, tradeVol INT, tradeCount INT, marketCap BIGINT, price DOUBLE(10,2), exchangeVol INT, genCoins INT, fees INT)";
            con.query(sql, function(err,results) {
              if (err) throw err;
              console.log('created');
            });

            var test = [
                ['2013-05-01',108659660.293,52443,1542820000.0,139.0,0.0,3575.0,36.80599998],
                ['2013-05-02',96958519.0041,55169,1292190000.0,116.38,0.0,3425.0,54.40791613],
                ['2013-05-03',84459697.3245,55636,1180070000.0,106.25,0.0,3650.0,48.52677208]
            ];*/
            var sql = "INSERT INTO coins (coinName, date, tradeVol, tradeCount, marketCap, price, exchangeVol, genCoins, fees) VALUES ?";
            con.query(sql, [fullCoinData], function(err, results) {
                if (err) throw err;
                console.log('inserted correctly');
            }); 
        });
    });
}
