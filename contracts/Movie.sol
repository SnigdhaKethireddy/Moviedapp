pragma solidity 0.4.25;

contract Movie {
    struct Movie {
        uint id;
        string name;
        uint count_v;
    }

    
    uint public movieCount;
    mapping(address => bool) public audience;
    mapping(uint => Movie) public movie;
    event movieEvent (
        uint indexed _movieId
    );

    constructor () public {
        addMovie("Dash & Lily");
        addMovie("After We Collided");
        addMovie("Freaky");
        addMovie("A Cindrella's Story ");
    }


    function vote (uint _movieId) public {
       
        require(!audience[msg.sender]);
        require(_movieId > 0 && _movieId <= movieCount);
        audience[msg.sender] = true;
        movie[_movieId].count_v =movie[_movieId].count_v+1;
        emit movieEvent(_movieId);
    }
    function addMovie (string _name) private {
        movieCount=movieCount+ 1;
        movie[movieCount] = Movie(movieCount, _name, 0);
    }

    
}
