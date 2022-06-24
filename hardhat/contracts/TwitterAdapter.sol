// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import "hardhat/console.sol";


contract ChainlinkTwitter is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; 
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public timeStamp;
    bool public fullfilled;
    
    //only the contract owner should be able to tweet
    address public owner;
    modifier onlyOwner {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _linkTokenAddr, address _oralcleAddr) {
    	setChainlinkToken(_linkTokenAddr);
    	oracle = _oralcleAddr; // oracle address
    	jobId = '2cc926226a6a4975ae499c873525e881'; //job id 
    	owner = msg.sender;
    }

    //tweets the supplied string
    function requestLastUserTweetTs(string memory username) public onlyOwner {
        console.log("TA: Received %s", username);
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("username", username);
        sendChainlinkRequestTo(oracle, req, 1 * 10 * 17);
    }
        
    //callback function
    function fulfill(bytes32 _requestId, uint256 _timeStamp) public recordChainlinkFulfillment(_requestId) {
        fullfilled = true;
        timeStamp = _timeStamp;
    }

}