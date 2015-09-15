
var express = require('express'),
    compression = require('compression');

var app = module.exports = express();

app.disable('x-powered-by');
app.use(compression());
app.use(express.static(__dirname + '/www/'));

app.listen(1337);
