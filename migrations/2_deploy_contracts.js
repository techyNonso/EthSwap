/* eslint-disable no-undef */
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
    //deploy Token
    await deployer.deploy(Token);
    const token = await Token.deployed()
    //deploy EthSwap
    await deployer.deploy(EthSwap, token.address);
    const ethSwap = await EthSwap.deployed()

    //transfer all tokens to eth swap
    await token.transfer(ethSwap.address, '1000000000000000000000000')
    
};
