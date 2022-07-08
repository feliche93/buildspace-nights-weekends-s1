pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import './ChainlinkTwitterAdapter.sol';
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract GoalContract is ReentrancyGuard, ChainlinkTwitterAdapter{
    event GoalCreated(
        Goal goal
    );

    event GoalEvaluated(
        uint256 goalId,
        string goal,
        address goalOwnerAddress,
        bool achieved
    );

    event PledgedAmountWithdrawn(
        uint256 goalId,
        string goal,
        address goalOwnerAddress,
        uint256 amountPledged
    );

    using Counters for Counters.Counter;
    Counters.Counter public goalIds;
    Counters.Counter public goalsAchieved;

    struct Goal {
        uint256 goalId;
        bytes32 requestId;
        uint256 userId;
        string goal;
        uint256 metric;
        uint256 deadline;
        address goalOwnerAddress;
        uint256 amountPledged;
        bool fulfilled;
        // bool achieved;
        // bool withdrawn;
        // bool started;
        // bool ended;
    }

    mapping(uint256 => Goal) public idToGoal;
    mapping(address => uint[]) public usersGoalIds;
    mapping(address => uint256) public amountLockedByAddress;

    mapping(address => bytes32) userLastReqId;
    mapping(bytes32 => uint) requestIdGoalId;
    constructor(address _linkTokenAddr, address _oralcleAddr) 
    ChainlinkTwitterAdapter(_linkTokenAddr, _oralcleAddr)
    payable {
    }

    // function dummySend(string memory _string) public {
    //     ChainlinkTwitter twitterAdapter = ChainlinkTwitter(twitterAdapterAddress);
    //     userLastReqId[msg.sender] = twitterAdapter.requestLastUserTweetTs(_string);
    // }

    // function dummyReceive() public view returns (uint256){
    //     ChainlinkTwitter twitterAdapter = ChainlinkTwitter(twitterAdapterAddress);
    //     ChainlinkTwitter.TwitterRequest memory request = twitterAdapter.getRequest(userLastReqId[msg.sender]);
    //     return request.payload;
    // }
    function createGoal(
        string memory goalName,
        string memory username,
        uint256 deadlineInDays
    ) public payable {
        require(deadlineInDays > 0, "Deadline must be at least 1 day");
        bytes32 requestId = requestLastUserTweetTs(username);

        goalIds.increment();
        uint256 goalId = goalIds.current();
        requestIdGoalId[requestId] = goalId;
        uint[] storage userGoalIds = usersGoalIds[msg.sender];
        userGoalIds.push(goalId);

        // keeping a glboal mapping of each challengers address to the amount they have locked
        amountLockedByAddress[payable(msg.sender)] += msg.value;

        idToGoal[goalId] = Goal(
            goalId, // goalId
            requestId,
            0,
            goalName, // goal
            0,
            block.timestamp + deadlineInDays * 1 seconds, // deadline calculated from timestamp of block on
            payable(msg.sender), // goalOwnerAddress
            msg.value, // amountPledged
            false);
            // false, // achieved
            // false, // withdrawn
            // true, // started
            // false // ended
        // );

        // emit GoalCreated(
        //     goal
        // );
    }

    // function evaluateGoal(uint256 goalId, bool achieved) public {
    //     require(idToGoal[goalId].goalId > 0, "Goal must be started");
    //     // require(
    //     //     !idToGoal[goalId].ended,
    //     //     "Goal has already ended and been verified"
    //     // );
    //     require(
    //         block.timestamp >= idToGoal[goalId].deadline,
    //         "Goal deadline has not passed yet."
    //     );

        // goalsAchieved.increment();
        // idToGoal[goalId].achieved = achieved;
        // idToGoal[goalId].ended = true;

        // emit GoalEvaluated(
        //     idToGoal[goalId].goalId,
        //     idToGoal[goalId].goal,
        //     idToGoal[goalId].goalOwnerAddress,
        //     idToGoal[goalId].achieved
        // );
    // }

    // function withdrawFunds(uint256 goalId) public nonReentrant {
    //     require(
    //         msg.sender == idToGoal[goalId].goalOwnerAddress,
    //         "Only goal owner can withdraw funds"
    //     );
    //     require(idToGoal[goalId].started, "Goal must be started");
    //     require(idToGoal[goalId].ended, "Goal has not ended yet");
    //     require(
    //         block.timestamp >= idToGoal[goalId].deadline,
    //         "Goal deadline has not passed yet."
    //     );
    //     require(!idToGoal[goalId].withdrawn, "Goal has already been withdrawn");
    //     require(
    //         idToGoal[goalId].achieved,
    //         "Goal has not been verified as achieved"
    //     );

    //     idToGoal[goalId].withdrawn = true;
    //     idToGoal[goalId].ended = true;

    //     (bool sent, ) = msg.sender.call{value: idToGoal[goalId].amountPledged}(
    //         ""
    //     );
    //     require(sent, "Failed to send user ETH back");

    //     emit PledgedAmountWithdrawn(
    //         idToGoal[goalId].goalId,
    //         idToGoal[goalId].goal,
    //         idToGoal[goalId].goalOwnerAddress,
    //         idToGoal[goalId].amountPledged
    //     );
    // }

    /* Returns goals that a user can evaluate */
    // function fetchEvaluationsByAddress(address targetAddresss)
    //     public
    //     view
    //     returns (Goal[] memory)
    // {
    //     uint256 totalGoalCount = goalIds.current();
    //     uint256 GoalCount = 0;
    //     uint256 currentIndex = 0;

    //     console.log("Total goal count: %s", totalGoalCount);
    //     console.log("Target Address: %s", targetAddresss);

    //     for (uint256 i = 0; i < totalGoalCount; i++) {
    //         console.log("i: %s", i);
    //         if (
    //             idToGoal[i + 1].goalCheckerAddress == targetAddresss &&
    //             !idToGoal[i + 1].ended
    //         ) {
    //             console.log(
    //                 "Goal Checker Address: %s",
    //                 idToGoal[i + 1].goalCheckerAddress
    //             );
    //             GoalCount += 1;
    //         }
    //     }

    //     console.log("Goal count: %s", GoalCount);

    //     Goal[] memory goals = new Goal[](GoalCount);
    //     for (uint256 i = 0; i < totalGoalCount; i++) {
    //         if (
    //             idToGoal[i + 1].goalCheckerAddress == targetAddresss &&
    //             !idToGoal[i + 1].ended
    //         ) {
    //             uint256 currentId = i + 1;
    //             Goal storage currentItem = idToGoal[currentId];
    //             goals[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //     }

    //     return goals;
    // }

    /* Returns goals that a user complete */
    // function fetchAchievedByAddress(address targetAddresss)
    //     public
    //     view
    //     returns (Goal[] memory)
    // {
    //     uint256 totalGoalCount = goalIds.current();
    //     uint256 GoalCount = 0;
    //     uint256 currentIndex = 0;

    //     console.log("Total goal count: %s", totalGoalCount);
    //     console.log("Target Address: %s", targetAddresss);

    //     for (uint256 i = 0; i < totalGoalCount; i++) {
    //         console.log("i: %s", i);
    //         if (
    //             idToGoal[i + 1].goalOwnerAddress == targetAddresss &&
    //             idToGoal[i + 1].achieved &&
    //             !idToGoal[i + 1].withdrawn
    //         ) {
    //             console.log(
    //                 "Goal Checker Address: %s",
    //                 idToGoal[i + 1].goalCheckerAddress
    //             );
    //             GoalCount += 1;
    //         }
    //     }

    //     console.log("Goal count: %s", GoalCount);

    //     Goal[] memory goals = new Goal[](GoalCount);
    //     for (uint256 i = 0; i < totalGoalCount; i++) {
    //         if (
    //             idToGoal[i + 1].goalOwnerAddress == targetAddresss &&
    //             idToGoal[i + 1].achieved &&
    //             !idToGoal[i + 1].withdrawn
    //         ) {
    //             uint256 currentId = i + 1;
    //             Goal storage currentItem = idToGoal[currentId];
    //             goals[currentIndex] = currentItem;
    //             currentIndex += 1;
    //         }
    //     }

    //     return goals;
    // }

    function fulfill(bytes32 _requestId, uint256 _payload, uint256 _userId) public override recordChainlinkFulfillment(_requestId) {
        uint256 goalId = requestIdGoalId[_requestId];
        Goal storage goal = idToGoal[goalId];
        goal.fulfilled = true;
        goal.metric = _payload;
        goal.userId = _userId;
        console.log("Payload ", _payload);
    }

    function getUserGoals(address userAddr) public view returns (Goal[] memory){
        uint256[] memory userGoalIds = usersGoalIds[userAddr];
        Goal[] memory goals = new Goal[](userGoalIds.length);
        for (uint i=0; i < userGoalIds.length; i++){
            goals[i] = idToGoal[userGoalIds[i]];
        }
        return goals;
    }

    function getLastUserGoal(address userAddr) public view returns (Goal memory){
        uint256[] memory userGoalIds = usersGoalIds[userAddr];
        return idToGoal[userGoalIds[userGoalIds.length-1]];
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
