// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

contract ChainlinkTwitter is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; 
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public timeStamp;
    
    //only the contract owner should be able to tweet
    address public owner;
    modifier onlyOwner {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _linkTokenAddr, address _oralcleAddr, string memory _jobId) {
    	setChainlinkToken(_linkTokenAddr);
    	oracle = _oralcleAddr; // oracle address
    	jobId = "_jobId"; //job id 
    	owner = msg.sender;
    }

    //tweets the supplied string
    function requestLastUserTweetTs(string memory username) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("username", username);
        sendChainlinkRequestTo(oracle, req, 1 * 10 * 17);
    }
        
    //callback function
    function fulfill(bytes32 _requestId, uint256 _timeStamp) public recordChainlinkFulfillment(_requestId) {
        timeStamp = _timeStamp;
    }

}