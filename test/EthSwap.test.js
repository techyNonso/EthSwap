const { default: Web3 } = require('web3');

/* eslint-disable no-undef */
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai').use(require('chai-as-promised')).should()

const tokens = (n) => {
    return web3.utils.toWei(n,'ether')
}

contract("EthSwap",([deployer,investor]) => {
    let token,ethSwap
    before(async() => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)

        //transfer tokens
        await token.transfer(ethSwap.address, tokens('1000000'))
    })
     describe("Token deployment", async() => {
        it("name should be correct", async() => {
            const name = await token.name()
            assert.equal(name,'Cody Token')
        })
    })
    describe("EthSwap deployment", async() => {
        it("name should be correct", async() => {
            const name = await ethSwap.name()
            assert.equal(name,'Erc20 instant exchange')
        })

        it("contract has correct tokens", async() => {
            let balance  = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
   

    describe("Token Purchase", async() => {
        let result
        before(async() => {
        result = await ethSwap.buyTokens({from:investor, value: web3.utils.toWei('1','ether')})
            
    })
        it("Allows users to purchase tokens ", async() => {
           //check if investor received token
           let balance = await token.balanceOf(investor)
           assert.equal(balance.toString(), tokens('100'))
           //check eth swap balance after purchase
           let ethSwapBalance = await token.balanceOf(ethSwap.address)
           assert.equal(ethSwapBalance.toString(),tokens('999900'))
           ///checking how much eth is in our contract cos it will retain that automaticaly
           let ethSwapEthBalance = await web3.eth.getBalance(ethSwap.address)
           assert.equal(ethSwapEthBalance.toString(), web3.utils.toWei('1','ether'))


           const event = result.logs[0].args
           assert.equal(event.account, investor)
           assert.equal(event.token, token.address)
           assert.equal(event.amount.toString(), tokens('100').toString())
           assert.equal(event.rate.toString(), '100')
           
        })
    })
    describe("Token Sales", async() => {
        let result
       before(async() => {
           //approve the transfer
           await token.approve(ethSwap.address, tokens('100'), {from : investor})
           //transfer the token
           result = await ethSwap.sellTokens(tokens('100'), {from : investor})
        })
        it("Allows users to sell tokens ", async() => {
           let investorBalance = await token.balanceOf(investor)
           assert.equal(investorBalance.toString(), tokens('0'))
           let balance  = await token.balanceOf(ethSwap.address)
           assert.equal(balance.toString(), tokens('1000000'))
           let ethSwapEthBalance = await web3.eth.getBalance(ethSwap.address)
           assert.equal(ethSwapEthBalance.toString(), web3.utils.toWei('0','ether'))

           //check if event with emitted
           const event = result.logs[0].args
           assert.equal(event.account, investor)
           assert.equal(event.token, token.address)
           assert.equal(event.amount.toString(), tokens('100').toString())
           assert.equal(event.rate.toString(), '100')
           
           //test for failure blocking selling tokens more than owned by investor
           await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected;
        })
    })

    
})