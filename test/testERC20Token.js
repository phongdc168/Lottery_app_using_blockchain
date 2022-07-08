const { getAllByDisplayValue } = require("@testing-library/dom");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("My Token", function(){
    let myToken;
    let owner;
    let addr1;
    let addr2;

    this.beforeEach(async function() {
        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy();
        await myToken.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should successfully deploy", async function() {
        console.log("Success");
    });

    it("Should deploy 10000 supply for the owner of the contract", async function() {
        const balance = await myToken.balanceOf(owner.address);
        expect(ethers.utils.formatEther(balance) == 10000);
    });

    it("Should let you send token to another address", async function() {
        await myToken.transfer(addr1.address, ethers.utils.parseEther("100"));
        expect(await myToken.balanceOf(addr1.address)) == (ethers.utils.parseEther("100"));
    });

    it("should let you give another address the approval to send on your behalf", async function() {
        await myToken.connect(addr1).approve(owner.address, ethers.utils.parseEther("1000"));
        await myToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await myToken.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther("1000"));
        expect(await myToken.balanceOf(addr2.address)) == ethers.utils.parseEther("1000");
    });
})