// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Myierc20.sol";

contract Student {
    MyERC20 myERC20;

    struct proposal{
        uint id;
        uint state;
        address proposer;
        string title;
        string detail;
        uint256 start_time;
    }
    uint public len=0;

    struct vote_list{
        address[] voter_addr;
        bool[] is_agree;
    }

    mapping(uint256 => vote_list) voter_list_map; 

    mapping(uint => proposal) public proposals;
    mapping(address=>bool) is_signin;

    constructor(){
        myERC20 = new MyERC20();
    }
    function signin() external {
    require(is_signin[msg.sender] == false, "This student has checked in already");
        myERC20.mint(msg.sender, 50);
        is_signin[msg.sender]=true;
    }

    function getPoint() view external returns (uint256){
        uint256 temp_point = myERC20.balanceOf(msg.sender);
        return temp_point;
    }


    function submitProposal(uint id, string memory title, string memory detail, uint256 start_time) public {
        myERC20.burn(msg.sender,10);
        proposals[id].id=id;
        proposals[id].state=0;
        proposals[id].proposer=msg.sender;
        proposals[id].title=title;
        proposals[id].detail=detail;
        proposals[id].start_time=start_time;
        len=len+1;
    }

    function vote(uint256 id, bool choice) public {
        myERC20.burn(msg.sender, 1);
        voter_list_map[id].voter_addr.push(msg.sender);
        voter_list_map[id].is_agree.push(choice);
    }

    function voteResult(uint256 id) public returns (bool){
        int flag = 0;
        for(uint i = 0; i < voter_list_map[id].voter_addr.length; i++){
            if (voter_list_map[id].is_agree[i]) flag++;
            else flag--;
        }
        if (flag > 0) {
            for (uint i = 0; i < len; i++) {
                if (proposals[i].id == id) {
                    myERC20.mint(msg.sender,50);
                }
            }
            return true;
        }else 
            return false;

    }
    function updateState() public {
        uint lastUpdated = block.timestamp;
        for (uint i = 0; i < len; i++) {
                if (lastUpdated- 1 minutes> proposals[i].start_time) {
                    proposals[i].state=1;
                }
            }

    }



}
