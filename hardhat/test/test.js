const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

// Chainlink Keeper Registry Address (Mainnet)
const KEEPER_ADDRESS = "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B";

const NEW_KEEPER_ADDRESS = "0x02777053d6764996e594c3E88AF1D58D5363a2e6";

/**
 * This is a basic test that is not complete. It is tested using Hardhat's
 * mainnet forking feature so this test does not include many functionalities.
 * This test was written before the final version of the smart contract. Further
 * testing was done using Remix (Rinkeby).
 */

describe("Basic contract functionality test", function () {
  let ContractFactory;
  let contract;
  let owner;
  let employee1;

  beforeEach(async function () {
    [owner, employee1] = await ethers.getSigners();
    ContractFactory = await ethers.getContractFactory("SalaryAutomation");
    contract = await ContractFactory.deploy(
      KEEPER_ADDRESS,
      500,
      employee1.address
    );
    await contract.deployed();
  });

  it("Check if state variables are correctly assigned", async function () {
    let ownerAddress = await contract.owner();
    expect(ownerAddress).to.equal(owner.address);

    let timeStamp = await contract.lastTimeStamp();
    expect(timeStamp).to.be.above(0);

    let keeperAddress = await contract.getKeeperRegistryAddress();
    expect(keeperAddress).to.equal(KEEPER_ADDRESS);

    let employeeAddress = await contract.getEmployee();
    expect(employeeAddress).to.equal(employee1.address);

    let salary = await contract.getEmployeeSalary();
    expect(salary).to.equal(500);
  });

  it("Successfully funds contract", async function () {
    await contract.fund({ value: parseEther("100") });

    let contractBalance = await ethers.provider.getBalance(contract.address);
    contractBalance = contractBalance / 1e18;
    expect(contractBalance).to.equal(100);
  });

});
