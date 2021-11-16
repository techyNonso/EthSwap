require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('@truffle/hdwallet-provider')
const infuraKey = "d0dc45555a2743d19db5b23c8a5babb0"

const fs =  require("fs")
const mnemonic = fs.readFileSync(".secret").toString().trim()

module.exports = {
  networks: {
      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*" // Match any network id
      },
      ropsten:{
        provider: new HDWalletProvider(
        mnemonic,
        `https://ropsten.infura.io/v3/${infuraKey}`
      ),
      network_id: 3,
      gas: 5500000,
      confirmations:2,
      timeoutBlocks:200,
      skipDryRun:true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:'0.5.0',
      optimizer: {
        enabled: true,
        runs: 200
      },
      //evmVersion: 'petersburg'
    }
  }
}
