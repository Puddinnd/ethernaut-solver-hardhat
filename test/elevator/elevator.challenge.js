const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Elevator', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Elevator');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Elevator', deployer);
            this.target = await ContractFactory.deploy();
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        const BuildingSolverFactory = await ethers.getContractFactory('BuildingSolver', attacker);
        const BuildingSolver = await BuildingSolverFactory.deploy();
        let pwnTX = await BuildingSolver.connect(attacker).pwn(
            this.target.address, 
            1337, 
            {gasLimit: 200000}
        ); await pwnTX.wait();
        console.log(`\t top: ${await this.target.top()}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.top()).to.be.eq(true);
    });
});