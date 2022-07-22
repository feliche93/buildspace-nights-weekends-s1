pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./ChainlinkTwitterAdapter.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract GoalContractV1 is ReentrancyGuard, ChainlinkTwitterAdapter {
    using Counters for Counters.Counter;
    Counters.Counter public goalIds;
    Counters.Counter public goalsAchieved;

    struct Goal {
        uint256 goalId;
        uint256 username;
        string goal;
        uint256 current;
        uint256 target;
        uint256 startDate;
        uint256 endDate;
        address goalOwnerAddress;
        uint256 amountPledged;
        bool achieved;
        bool withdrawn;
        bool ended;
    }

    struct GoalRequest {
        string goal;
        uint256 startDate;
        uint256 endDate;
        uint256 target;
        address goalOwnerAddress;
        uint256 amountPledged;
        bool fulfilled;
    }

    struct GoalEvaluateRequest {
        uint256 goalId;
        bool fulfilled;
    }

    mapping(uint256 => Goal) public idToGoal;
    mapping(address => uint256[]) public userToGoalIds;
    mapping(address => bytes32) public userToLastReqId;
    mapping(bytes32 => GoalRequest) public requestIdToGoalRequest;
    mapping(address => uint256) public amountLockedByAddress;

    constructor(address _linkTokenAddr, address _oralcleAddr)
        payable
        ChainlinkTwitterAdapter(_linkTokenAddr, _oralcleAddr)
    {}

    receive() external payable {}

    fallback() external payable {}

    event GoalCreated(Goal goal);

    event GoalRequestCreated(GoalRequest goalRequest);

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

    // @notice Create a new goal
    // @param goal he goal to be achieved
    // @param username the username of the user who created the goal
    // @param endDate the date the goal should be achieved by
    // @dev Goal Request gets created and oracle is called to test before goal creation
    function createGoalRequest(
        string memory goal,
        uint256 target,
        string memory username,
        uint256 startDate,
        uint256 endDate
    ) 
    public 
    payable {
        // require(deadlineInDays > 0, "Deadline must be at least 1 day");

        bytes32 requestId = requestLastUserTweetTs(username);

        console.log("username: %s", username);

        userToLastReqId[msg.sender] = requestId;

        GoalRequest memory greq = GoalRequest(
            goal, // e.g. "Status Updates"
            startDate, // e.g. 1546300800
            endDate, // unix timestamp when goal is due to be achieved
            target, // e.g. 100
            msg.sender, // address of the goal owner
            msg.value, // amount of ether pledged by the goal owner
            false // whether the goal has been fulfilled
        );

        requestIdToGoalRequest[requestId] = greq;

        emit GoalRequestCreated(greq);
    }

    function createGoalEvaluationRequest(
        uint256 _goalId
    )
    public {
        Goal memory goal = idToGoal[_goalId];
        bytes32 requestId = requestLikesSinceTs(goal.username, goal.startDate);
        GoalEvaluateRequest memory gereq = GoalEvaluateRequest(
        _goalId,
        false //fillfilment
        );
    }

    function fulfillGoalRequest(
        bytes32 _requestId,
        uint256 _payload,
        uint256 _username
    ) public override recordChainlinkFulfillment(_requestId) {
        GoalRequest memory greq = requestIdToGoalRequest[_requestId];
        greq.fulfilled = true;
        goalIds.increment();
        uint256 goalId = goalIds.current();
        uint256[] storage userGoalIds = userToGoalIds[msg.sender];
        userGoalIds.push(goalId);
        amountLockedByAddress[payable(msg.sender)] += greq.amountPledged;
        Goal memory goal = Goal(
            goalId, // goalId
            _username,
            greq.goal, // goal
            _payload,  //current
            greq.target, // target
            greq.startDate, // startDate
            greq.endDate, // endDate
            greq.goalOwnerAddress,
            greq.amountPledged,
            false, // achieved
            false, // withdrawn
            false // ended
        );
        idToGoal[goalId] = goal;
        emit GoalCreated(goal);
    }

    function getGoalRequestFufilled(bytes32 _requestId)
        public
        view
        returns (bool)
    {
        return requestIdToGoalRequest[_requestId].fulfilled;
    }

    function getUserGoals(address userAddr)
        public
        view
        returns (Goal[] memory)
    {
        uint256[] memory userGoalIds = userToGoalIds[userAddr];
        Goal[] memory goals = new Goal[](userGoalIds.length);
        for (uint256 i = 0; i < userGoalIds.length; i++) {
            goals[i] = idToGoal[userGoalIds[i]];
        }
        return goals;
    }

    function getLastUserGoal(address userAddr)
        public
        view
        returns (Goal memory)
    {
        uint256[] memory userGoalIds = userToGoalIds[userAddr];
        return idToGoal[userGoalIds[userGoalIds.length - 1]];
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

    // to support receiving ETH by default
}
