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
    mapping(uint => address) public contractAddresses;

    event NewProposal(uint _proposalId, address _lender, uint _mortgageValue, uint _interestRate, uint _termLength);
    event DeployedContract(uint _contractId, uint , address _contractAddress);

    constructor() {
        owner = msg.sender;
    }

    function createProposal(address _borrower, uint _mortgageValue, uint _interestRate, uint _termLength) external returns(uint) {
        require(msg.sender != _borrower, "Please use a different borrower address");

        proposals.push(Proposal(msg.sender, _borrower, _mortgageValue, _interestRate, _termLength, false));
        proposalsCount++;

        emit NewProposal(proposalsCount-1, msg.sender, _mortgageValue, _interestRate, _termLength);

        return (proposalsCount-1);

    }

    function acceptProposal(uint proposalId) external {
        require(msg.sender == proposals[proposalId].borrower);
        
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

        contractAddresses[deployedContractsCount-1] = address(rm);

        emit DeployedContract(deployedContractsCount-1, proposalId, address(rm));

        proposal.accepted = true; 

    }

}