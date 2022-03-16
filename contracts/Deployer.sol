//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ReverseMortgage.sol";

contract Deployer {
    address public owner;

    struct Proposal {
        address lender;
        address borrower;
        uint mortgageValue;
        uint interestRate;
        uint termLength;
        bool accepted;
    }

    Proposal[] public proposals;
    uint public proposalsCount;

    ReverseMortgage[] public deployedContracts;
    uint public deployedContractsCount;

    event NewProposal(uint _proposalId, address _lender, uint _mortgageValue, uint _interestRate, uint _termLength);
    event DeployedContract(uint _contractId, uint _proposalId);

    constructor() {
        owner = msg.sender;
    }

    function createProposal(uint _mortgageValue, uint _interestRate, uint _termLength) external returns(uint) {
        proposals.push(Proposal(msg.sender, address(0), _mortgageValue, _interestRate, _termLength, false));
        proposalsCount++;

        emit NewProposal(proposalsCount-1, msg.sender, _mortgageValue, _interestRate, _termLength);

        return (proposalsCount-1);

    }

    function acceptProposal(uint proposalId) external {
        Proposal storage proposal = proposals[proposalId];

        ReverseMortgage rm = new ReverseMortgage(
            proposal.lender,
            msg.sender,
            proposal.mortgageValue,
            proposal.interestRate,
            proposal.termLength
        );

        deployedContracts.push(rm);
        deployedContractsCount++;

        emit DeployedContract(deployedContractsCount-1, proposalId);

        console.log("Newly deployed contract address:", address(rm));

        proposal.borrower = msg.sender;
        proposal.accepted = true; 

    }

}