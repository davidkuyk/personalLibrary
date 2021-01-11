/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const id = '5fecc4034880a90405cb76bd'  // to edit
const id2 = '5fecc9195c7deb06c1f4e7da' // to delete
const id3 = '5fecc5210e48' // the invalid

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'TestingTitle'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.equal(res.body.title, 'TestingTitle')
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
          });
        done();
        });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.equal(res.body, 'missing required field title')
          });
        done();
        });
      });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
          });
        done();
        });      
      
      });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/' + id3)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
          });
        done();
        });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + id)
          .send({
            _id: id
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.typeOf(res.body, 'object');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.equal(res.body._id, id)
          });
        done();
        });
      
      });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send({
              comment: 'hello'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'TestingTitle');
              assert.equal(res.body.comments[0], 'hello');
              done();
         });
        });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send({
              title: 'Test Title Three',
              commentcount: 0,
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field comment');
              done();
          });
        });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
       chai.request(server)
          .post('/api/books/' + id3)
          .send({
              title: 'Test Title Three',
              commentcount: 0,
              comment: 'hello?'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
          });
        });
      });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete('/api/books/' + id2)
        .send({
          _id: id2
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'delete successful')
        });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/' + id3)
        .send({
          _id: id3
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists')
        });
        done();
      });
    });
  });
});