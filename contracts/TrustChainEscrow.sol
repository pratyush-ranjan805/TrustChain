// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustChainEscrow {
    struct Milestone {
        string name;
        uint256 amount;
        bool approved;
        bool submitted;
    }

    struct Job {
        address client;
        address freelancer;
        uint256 totalAmount;
        uint256 milestoneCount;
        uint256 currentMilestoneIndex;
        bool completed;
        bool disputed;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => mapping(uint256 => Milestone)) public jobMilestones;
    uint256 public jobCount;

    event JobCreated(uint256 jobId, address client, address freelancer, uint256 totalAmount);
    event MilestoneSubmitted(uint256 jobId, uint256 milestoneIndex);
    event MilestoneApproved(uint256 jobId, uint256 milestoneIndex, uint256 amount);
    event DisputeRaised(uint256 jobId);

    function createJob(address _freelancer, string[] memory _milestoneNames, uint256[] memory _milestoneAmounts) external payable {
        require(msg.value > 0, "Initial deposit required");
        require(_milestoneNames.length == _milestoneAmounts.length, "Milestone names and amounts length mismatch");
        
        uint256 totalMAmount = 0;
        for(uint i=0; i < _milestoneAmounts.length; i++) {
            totalMAmount += _milestoneAmounts[i];
        }
        require(msg.value == totalMAmount, "Deposit must equal total milestone amounts");

        jobCount++;
        Job storage job = jobs[jobCount];
        job.client = msg.sender;
        job.freelancer = _freelancer;
        job.totalAmount = msg.value;
        job.milestoneCount = _milestoneNames.length;

        for(uint i=0; i < _milestoneNames.length; i++) {
            jobMilestones[jobCount][i] = Milestone({
                name: _milestoneNames[i],
                amount: _milestoneAmounts[i],
                approved: false,
                submitted: false
            });
        }

        emit JobCreated(jobCount, msg.sender, _freelancer, msg.value);
    }

    function submitMilestone(uint256 _jobId, uint256 _milestoneIndex) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.freelancer, "Only freelancer can submit");
        require(!jobMilestones[_jobId][_milestoneIndex].approved, "Milestone already approved");
        
        jobMilestones[_jobId][_milestoneIndex].submitted = true;
        emit MilestoneSubmitted(_jobId, _milestoneIndex);
    }

    function approveMilestone(uint256 _jobId, uint256 _milestoneIndex) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "Only client can approve");
        Milestone storage m = jobMilestones[_jobId][_milestoneIndex];
        require(m.submitted, "Milestone not yet submitted");
        require(!m.approved, "Milestone already approved");

        m.approved = true;
        payable(job.freelancer).transfer(m.amount);

        emit MilestoneApproved(_jobId, _milestoneIndex, m.amount);

        if (_milestoneIndex == job.milestoneCount - 1) {
            job.completed = true;
        }
    }

    function raiseDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client || msg.sender == job.freelancer, "Only parties can dispute");
        job.disputed = true;
        emit DisputeRaised(_jobId);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
