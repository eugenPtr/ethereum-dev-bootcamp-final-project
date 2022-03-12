//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "abdk-libraries-solidity/ABDKMathQuad.sol";
import "hardhat/console.sol";

contract ReverseMortgage {
    // Borrowed value in USD
    uint public mortgageValue;
    // Percentage
    uint public annualInterestRate;
    // Number of years
    uint public termLength;

    // Sum of monthly payments + interest
    uint public borrowedAmount;

    uint monthlyPaymentValue;
    uint monthlyInterestBasisPoints;

    address public lender;
    address public borrower;

    constructor(address _lender,
                address _borrower,
                uint _mortgageValue, 
                uint _annualInterestRate, 
                uint _termLength) {
        lender = _lender;
        borrower = _borrower;
        mortgageValue = _mortgageValue;
        annualInterestRate = _annualInterestRate;
        termLength = _termLength;
        monthlyPaymentValue = _getMonthlyPaymentValue(mortgageValue, termLength);
        monthlyInterestBasisPoints = _getMonthlyInterestBasisPoints(annualInterestRate);

        console.log("Monthly interest:", monthlyInterestBasisPoints);
        

    }

    function pay() external payable{
        console.log("Message value:", msg.value);
        console.log("Monthly payment value:", monthlyPaymentValue);
        require(msg.value == monthlyPaymentValue, "Incorrect payment value");
        
        borrowedAmount += msg.value;
        // Compound interest
        console.log("Borrowed amount:", borrowedAmount);
        console.log("Interest value:", _getInterestValue(borrowedAmount, monthlyInterestBasisPoints));
        borrowedAmount += _getInterestValue(borrowedAmount, monthlyInterestBasisPoints);
        
    }

    function _getMonthlyPaymentValue(uint _mortgageValue, uint _termLength) private pure returns(uint) {
        return 1 ether * _mortgageValue / _termLength / 12;
    }

    function _getMonthlyInterestBasisPoints(uint _annualInterestRate) private pure returns(uint) {
        return _annualInterestRate * 10**3 / 12;
    }

    function _getInterestValue(uint _baseValue, uint interestRatio) private pure returns(uint) {
        return _baseValue * interestRatio / 10**3 / 100;
    }


}