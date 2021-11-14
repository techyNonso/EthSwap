pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "Erc20 instant exchange";
    uint256 public rate = 100;
    Token public token;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );
    event TokensSoled(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(address _token_address) public {
        //note this is an object of the Token contract
        token = Token(_token_address);
    }

    function buyTokens() public payable {
        //this is eth amount with rate 100
        uint256 tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //we need to convert the Token instance to an address
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        //this is not neccesary since ERC20 tokens handle this by default
        require(token.balanceOf(msg.sender) >= _amount);
        //calculate eth value
        uint256 etherAmount = _amount / rate;
        //we will do approve outside the contract
        require(address(this).balance >= etherAmount);
        //perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokensSoled(msg.sender, address(token), _amount, rate);
    }
}
