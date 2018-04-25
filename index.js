var request = require('request');

console.log(process.argv);
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

        if (!error && response.statusCode == 200) {
            //need to fix no comma after activeAddresses bc it is messing up data buckets +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            var csv = body.split(',');
            console.log(csv);
            //skip column names
            for (var j = 9; j < csv.length; j++) {
                if (j % 9 === 0 ) {
                    //remove trailing line break
                    date.push(csv[j].slice(0,-2));
                }

                else if ( j % 9 === 1) {
                    tradeVol.push(csv[j]);
                }

                else if ( j % 9 === 2) {
                    tradeCount.push(csv[j]); 
                }

                else if ( j % 9 === 3) {
                    marketCap.push(csv[j]);
                }

                else if ( j % 9 === 4) {
                    price.push(csv[j]);
                }

                else if ( j % 9 === 5) {
                    exchangeVol.push(csv[j]);
                }

                else if ( j % 9 === 6) {
                    genCoins.push(csv[j]);
                }

                else if ( j % 9 === 7) {
                    fees.push(csv[j]);
                }
                //throw away null values
                else if ( j % 9 === 8) {
                    
                }
            } 
        }
        //console.log(date, tradeCount);
    });
}

