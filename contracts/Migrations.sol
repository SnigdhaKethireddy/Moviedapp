pragma solidity ^0.4.2;

contract Migrations {
  address public dapp;
  uint public prev_migration;

  modifier restricted() {
    if (msg.sender == dapp) _;
  }

  constructor () public {
    dapp = msg.sender;
  }

  function setCompleted(uint finished) public restricted {
    prev_migration = finished;
  }

  function update(address new_add) public restricted {
    Migrations updated = Migrations(new_add);
    updated.setCompleted(prev_migration);
  }
}
