var Movie = artifacts.require("./Movie.sol");

contract( function(accounts) {   
  var MovieInstance;

  it( function() {                                     // the movies are initialized
    return Movie.deployed().then(function(instance) {
      return instance.moviesCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it( function() {                                 //the movies are initialized with correct values
    return Movie.deployed().then(function(instance) {
      MovieInstance = instance;
      return MovieInstance.movies(1);
    }).then(function(movie) {
      assert.equal(movie[0], 1);   // contains correct id
      assert.equal(movie[1], "movie 1"); //contains correct name
      assert.equal(movie[2], 0);  //contains correct votes count
      return MovieInstance.movies(2);
    }).then(function(movie) {
      assert.equal(movie[0], 2);  
      assert.equal(movie[1], "movie 2"); 
      assert.equal(movie[2], 0);  
    }).then(function(movie) {
      assert.equal(movie[0], 2);  
      assert.equal(movie[1], "movie 3"); 
      assert.equal(movie[2], 0);  
    }).then(function(movie) {
      assert.equal(movie[0], 2);  
      assert.equal(movie[1], "movie 4"); 
      assert.equal(movie[2], 0);  
    
    
    });
  });

 
 
  it( function() {                             // a voter casts a vote for the movie
    return Movie.deployed().then(function(instance) {
      MovieInstance = instance;
      movieId = 1;
      return MovieInstance.vote(movieId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1);  //event was triggered
      assert.equal(receipt.logs[0].event, "movieEvent");  //event type is correct or not
      assert.equal(receipt.logs[0].args._movieId.toNumber(), movieId);  //the movie id is correct or not
      return MovieInstance.audience(accounts[0]);
    }).then(function(voted) {
      assert(voted);  //the audience marked as voted
      return MovieInstance.movies(movieId);
    }).then(function(movie) {
      var count_v = movie[2];
      assert.equal(count_v, 1);  //increments the movie's vote count
    })
  });
 
 
 
  it( function() {                             //exception is thrown for invalid audience
    return Movie.deployed().then(function(instance) {
      MovieInstance = instance;
      return MovieInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0); //error message 
      return MovieInstance.movies(1);
    }).then(function(movie1) {
      var count_v = movie1[2];
      assert.equal(count_v, 1);  //no votes received by movie1
      return MovieInstance.movies(2);
    }).then(function(movie2) {
      var count_v = movie2[2];
      assert.equal(count_v, 0);  //no votes received by movie2
    }).then(function(movie3) {
      var count_v = movie3[2];
      assert.equal(count_v, 1);  //no votes received by movie3
      return MovieInstance.movies(2);
    }).then(function(movie4) {
      var count_v = movie4[2];
      assert.equal(count_v, 0);  //no votes received by movie4
    });
  });

  
    
});
