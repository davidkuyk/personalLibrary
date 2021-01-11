/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
let db = mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

module.exports = function (app) {

  const bookSchema = new mongoose.Schema({
    title: String,
    commentcount: Number,
    comments: [String]
    });

  const Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find((error, data) => {
        if(error) {
            console.log(error)
        } else {
          res.send(data);
        }
      })
    })
    
    .post(function (req, res){
      if (!req.body.title) {
          return res.json('missing required field title')
          }
      //response will contain new book object including atleast _id and title
      var newBook = new Book({
        title: req.body.title,
        commentcount: 0,
        comments: []
      });

      newBook.save((err, data) => {
         if(err) {
            return console.error(err);  
          } else {
            return res.json(data);
          }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err, data){
        if(err) {
          console.log(err)
        } else {
          return res.json('complete delete successful')
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (error, data) => {
        if(error) {
          console.log(error)
        } else if (!data) {
          return res.json('no book exists')
          } else {
          return res.json(data)
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {return res.json('missing required field comment')};
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, 
      {
        $push: {comments: comment},
        $inc: {commentcount: 1}
      }, {new: true}, (error, data) => {
        if(error) {
          console.log(error)
        } else if (!data) {
          return res.json('no book exists')
          } else {
          return res.json(data)
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, function(err, data){
        if(!err && data){
          res.json('delete successful');
        } else if(!data){
          res.json('no book exists')
        } 
      })
    });
  
};
