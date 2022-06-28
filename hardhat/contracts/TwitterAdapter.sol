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
    uint256 public likes;
    bool public fullfilled1;
    bool public fullfilled2;
    
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
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillLastUserTweetTs.selector);
        req.add("username", username);
        req.add("method", "latest_tweet_ts");
        req.add("userid", "");
        req.add("unix_ts", "");
        sendChainlinkRequestTo(oracle, req, 0);
    }

    function requestLikesSinceTs(string memory _username, string memory _timeStamp) public onlyOwner {
        console.log("TA: Received %s", _username);
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillLikesSinceTs.selector);
        req.add("username", _username);
        req.add("method", "likes_since_ts");
        req.add("userid", "");
        req.add("unix_ts", _timeStamp);
        sendChainlinkRequestTo(oracle, req, 0);
    }
        
    //callback function
    function fulfillLastUserTweetTs(bytes32 _requestId, uint256 _payload, uint256 _userId) public recordChainlinkFulfillment(_requestId) {
        fullfilled1 = true;
        timeStamp = _payload;
        console.log("Last timestamp of Tweet", timeStamp);
    }

    function fulfillLikesSinceTs(bytes32 _requestId, uint256 _payload, uint256 _userId) public recordChainlinkFulfillment(_requestId) {
        fullfilled2 = true;
        likes = _payload;
        console.log("Last timestamp of Tweet", likes);
    }
}