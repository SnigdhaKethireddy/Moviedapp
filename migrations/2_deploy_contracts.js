var Movie = artifacts.require("./Movie.sol");

module.exports = function(deployer) {
  deployer.deploy(Movie);
};
