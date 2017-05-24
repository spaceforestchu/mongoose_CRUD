var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var BookSchema = require('./Book.model');
var port = 8080;
var db = 'mongodb://localhost/BookSchema';
var Promise = require('promise');
var assert = require('assert');
mongoose.Promise =  global.Promise;

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res){
  res.send('Here');
});

app.get('/books', function(req, res){
  console.log('getting all books');

  BookSchema.find({}, function(err, books){
    if (err) {
      console.log(err)
    }
    console.log(books);
    res.json(books)
  })
});

app.get('/books/:id', function(req, res){
  console.log('getting one book');

  BookSchema.findOne({_id: req.params.id}, function(err, book){
    if (err) {
      console.log(err);
    }
    console.log(book);
    res.json(book)
  })
});

app.post('/book', function(req, res){

  var newBook = new BookSchema({
    title: req.body.title,
    author: req.body.author,
   category: req.body.category
  });

  newBook.save(function(err, book){
    if(err){
      res.send('error')
    }
    console.log(book);
    res.json(book)
  })
});

app.post('/book2', function(req, res){
  BookSchema.create(req.body, function(err, book){
    if(err){
      console.log(err);
    }
    console.log(book);
    res.json(book)
  })
})

app.put('/book/:id', function(req, res) {
  BookSchema.findOneAndUpdate({
    _id: req.params.id
    },
    { $set: { title: req.body.title }
  }, {upsert: true}, function(err, newBook) {
    if (err) {
      res.send('error updating ');
    } else {
      console.log(newBook);
      res.send(newBook);
    }
  });
});

app.delete('/book/:id', function(req, res) {
  BookSchema.findByIdAndRemove({
    _id: req.params.id
  }, function(err, book) {
    if(err) {
      res.send('error removing')
    } else {
      console.log(book);
      res.status(204);
    }
  });
});

app.listen(port, function() {
  console.log('Server started @ : ' + port);
});
