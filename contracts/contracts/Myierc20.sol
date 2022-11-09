// SPDX-License-Identifier:MIT
 pragma solidity 0.8.17;
interface IERC20 {

    //某地址余额
    function balanceOf(address account) external view returns (uint256);

    //转账时触发转账事件
    event Transfer(address indexed from, address indexed to, uint256 value);
    //授权时触发授权事件
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract MyERC20 is IERC20{

    //余额
    mapping(address => uint256)public balances;
    //总量
    uint256 public total = 10;
    bool is_checkin =false;
    //代币名
    string public constant name = "lytcoin";
    //简称
    string public constant symbol = "lc";
    //小数点
    uint8 public constant decimals = 18;
    //拥有者
    address owner;

    constructor() {
        owner=msg.sender;
        balances[msg.sender] = total;//注册送10积分
    }

    //余额查看
    function balanceOf(address account)override public view returns (uint256) {
        return balances[account];
    }

    //增发
    function mint(address account, uint256 amount) public virtual {
        
        total += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    //销毁
    function burn(address account,uint256 amount) public virtual {
        balances[account] = balances[account] - amount;
        total -= amount;
        emit Transfer(account, address(0), amount);
    }
}
