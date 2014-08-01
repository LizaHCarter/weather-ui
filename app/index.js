'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res){
  var url = 'http://api.wunderground.com/api/6904868a2f38a2ae/conditions/q/'+req.body.zip+'.json'
  request(url, function(error, response, forecast){
    forecast = JSON.parse(forecast);
    var temp = forecast.current_observation.temp_f;
    var color;

    if(temp <= 32){
      color = 'blue';
    }else if(temp <= 70){
      color = 'green';
    }else if(temp <= 80){
      color = 'yellow';
    }else if(temp <= 95){
      color = 'orange';
    }else{
      color = 'red';
    }
    
    res.render('temp', {zip:req.body.zip, temp:temp, color:color})

  });
});

var port = process.env.PORT;
app.listen(port, function(){
  console.log('Express is listenind on PORT ', port);
});
