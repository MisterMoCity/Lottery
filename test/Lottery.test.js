const assert = require('assert');
const { ENGINE_METHOD_STORE } = require('constants');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('can I enter the lottery', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        const players = await lottery.methods.getPLayers().call({
            from: accounts[0]
        });
        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);

    });

    it('allows multiple account to enter the lottery', async () => {

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });


        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('10', 'ether')
        });
        const players = await lottery.methods.getPLayers().call({
            from: accounts[0]
        });

        //  console.log(players)


        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length);

    });

    //check that this joint to ensure that if fails
    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({

                from: account[0],
                value: 0
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }

    });

    //check that only a manager can pick the winner
    it(' only manager can call  pickWinner', async () => {

        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }

    });

    it('sends money to the winner and resets the players array', async () => {

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        const initalBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const differance = finalBalance - initalBalance;

        assert(differance > web3.utils.toWei('9.8', 'ether'));

        const getPLayers = await lottery.methods.getPLayers().call({
            from: accounts[0]
        })

        assert.strictEqual(0, getPLayers.length);

    });

});
