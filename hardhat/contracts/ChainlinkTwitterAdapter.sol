// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

contract ChainlinkTwitterAdapter is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;
    address public oracle;
    bytes32 private jobId;
    uint256 private fee;

    enum APIFuncToCall {
        LATEST_TWEET_TS,
        LIKES_SINCE_TS
    }

    constructor(address _linkTokenAddr, address _oralcleAddr) {
        setChainlinkToken(_linkTokenAddr);
        oracle = _oralcleAddr; // oracle address
        jobId = '2cc926226a6a4975ae499c873525e881'; //job id

        console.log("LinkToken address: %s", _linkTokenAddr);
        console.log("Oracle address: %s", _oralcleAddr);
    }

    function requestLastUserTweetTs(string memory _username)
        public
        returns (bytes32)
    {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillGoalRequest.selector
        );
        req.add("username", _username);
        req.add("method", "latest_tweet_ts");
        req.add("userid", "");
        req.add("unix_ts", "");
        bytes32 requestId = sendChainlinkRequestTo(oracle, req, 0);

        // console.log("Requested last tweet timestamp for user: %s", _username);

        return requestId;
    }

    function requestLikesSinceTs(uint256 _userId, uint256 _timeStamp)
        public
        returns (bytes32)
    {
        console.log("Requesting likes since timestamp: %d", _timeStamp);
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillGoalEvaluationRequest.selector
        );
        req.add("username", "");
        req.add("method", "likes_since_ts");
        req.addUint("userid", _userId);
        req.addUint("unix_ts", _timeStamp);
        bytes32 requestId = sendChainlinkRequestTo(oracle, req, 0);
        return requestId;
    }

    //callback function
    function fulfillGoalRequest(
        bytes32 _requestId,
        uint256 _payload,
        uint256 _userId
    ) public virtual recordChainlinkFulfillment(_requestId) {
        console.log("Fulfilling fulfillGoalRequest.");
    }

    function fulfillGoalEvaluationRequest(
        bytes32 _requestId,
        uint256 _payload,
        uint256 _userId
    ) public virtual recordChainlinkFulfillment(_requestId) {
        console.log("Fulfilling fulfillGoalEvaluationRequest.");
    }
}
