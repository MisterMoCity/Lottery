pragma solidity ^0.4.17;

//define contract

contract  Lottery {
    
    address public manager;
    address[] public players;


function Lottery() public {
    
    manager = msg.sender;
   
   }
   
function enter() public payable {
    
    //used for validation; ensure that folks entering into the lottery have to send in at least .01 ether
    require(msg.value > .01 ether);
    
    players.push(msg.sender);

    }
    
function random() public view returns (uint) {
    
    return uint(keccak256(block.difficulty, now, players));
    
    }
    
function pickWinner() public restricted {
    uint index = random() % players.length;  
    players[index].transfer(this.balance); //take money out of the contract and send to the winner
    players = new address[](0);
    
    }
    
    
    //funcation modifier that will help with duplicative code
    modifier restricted() {
            //require statement enforces security
        require(msg.sender == manager);
        _;// run all the code inside of the funcation that are associated with restricted
        
    }
    
    function getPLayers() public view returns (address[]) {
        return players;
    }

}

