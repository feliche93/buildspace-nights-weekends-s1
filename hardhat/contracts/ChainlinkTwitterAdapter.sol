// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';
import "hardhat/console.sol";


contract
ChainlinkTwitterAdapter is 
ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; 
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    enum APIFuncToCall{
        LATEST_TWEET_TS, 
        LIKES_SINCE_TS
        }

    constructor(address _linkTokenAddr, address _oralcleAddr) {
    	setChainlinkToken(_linkTokenAddr);
    	oracle = _oralcleAddr; // oracle address
    	jobId = '2cc926226a6a4975ae499c873525e881'; //job id

    }


    function requestLastUserTweetTs(
        string memory username
    ) 
    public 
    returns (bytes32){
        console.log("TA: Received %s", username);
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("username", username);
        req.add("method", "latest_tweet_ts");
        req.add("userid", "");
        req.add("unix_ts", "");
        bytes32 requestId = sendChainlinkRequestTo(oracle, req, 0);
        return requestId;
    }


    function requestLikesSinceTs(
        string memory _username,
        string memory _timeStamp
    )
    public 
    returns (bytes32){
        console.log("TA: Received %s", _username);
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("username", _username);
        req.add("method", "likes_since_ts");
        req.add("userid", "");
        req.add("unix_ts", _timeStamp);
        bytes32 requestId = sendChainlinkRequestTo(oracle, req, 0);
        return requestId;
    }
        
    //callback function
    function fulfill(bytes32 _requestId, uint256 _payload, uint256 _userId)
    virtual
    public
    recordChainlinkFulfillment(_requestId) {
    }

}