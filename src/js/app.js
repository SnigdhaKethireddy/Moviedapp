App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
   
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Movie.json", function(Movie) {
      App.contracts.Movie = TruffleContract(Movie);
      App.contracts.Movie.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.Movie.deployed().then(function(instance) {
      instance.movieEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        App.render();
      });
    });
  },

  render: function() {
    var MovieInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    
    App.contracts.Movie.deployed().then(function(instance) {
      MovieInstance = instance;
      return MovieInstance.movieCount();
    }).then(function(movieCount) {
      var movieResults = $("#movieResults");
      movieResults.empty();

      var movieSelect = $('#movieSelect');
      movieSelect.empty();

      for (var i = 1; i <= movieCount; i++) {
        MovieInstance.movie(i).then(function(movie) {
          var id = movie[0];
          var name = movie[1];
          var count_v = movie[2];

         
          var movieTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + count_v + "</td></tr>"
          movieResults.append(movieTemplate);

          
          var movieOption = "<option value='" + id + "' >" + name + "</ option>"
           movieSelect.append(movieOption);
        });
      }
      return MovieInstance.audience(App.account);
    }).then(function(hasVoted) {
      

      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var movieId = $('#movieSelect').val();
    App.contracts.Movie.deployed().then(function(instance) {
      return instance.vote(movieId, { from: App.account });
    }).then(function(result) {
      
      
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
