const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider('security tooth physical identify output marine wish empty small popular inflict okay',
'https://ropsten.infura.io/v3/5e361895058440fdbc887dbedec63f84');

//new instance of the web3 provider for the ropsten network... use this web3 instance to interace with the web3 instance
const web3 = new Web3(provider);

const deploy = async () => {

    //get a list of accounts via our wallet

    const accounts = await web3.eth.getAccounts();

    console.log('attempting to deploy to an account', accounts[0]);

const result =  await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments:['Yo'] })
        .send({ gas: '1000000', from: accounts[0] });

console.log('Contract is deploy to', result.options.address);

}

deploy();



