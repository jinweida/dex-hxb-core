// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import './interface/IMasterChef.sol';
import './uniswapv2/interfaces/IUniswapV2Factory.sol';
import './uniswapv2/interfaces/IUniswapV2Pair.sol';
import './interface/IBXH.sol';
import './interface/IOracle.sol';
import './interface/ITokenLock.sol';
import './uniswapv2/libraries/TransferHelper.sol';

contract SwapMining is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private _whitelist;

    //lock half 
    address public tokenLock;

    // BXH tokens created per block
    uint256 public bxhPerBlock;
    // The block number when BXH mining starts.
    uint256 public startBlock;
    // How many blocks are halved
    uint256 public halvingPeriod = 1576800;
    // Total allocation points
    uint256 public totalAllocPoint = 0;
    IOracle public oracle;
    // router address
    address public router;
    // factory address
    IUniswapV2Factory public factory;
    // bxh token address
    IBXH public bxh;
    // Calculate price based on BUSD-T
    address public targetToken;
    // pair corresponding pid
    mapping(address => uint256) public pairOfPid;

    // pair corresponding pid
    // mapping(address => address) public references;

    constructor(
        IBXH _bxh,
        IUniswapV2Factory _factory,
        IOracle _oracle,
        address _router,
        address _targetToken,
        uint256 _bxhPerBlock,
        uint256 _startBlock,
        address _tokenLock
    ) public {
        bxh = _bxh;
        factory = _factory;
        oracle = _oracle;
        router = _router;
        targetToken = _targetToken;
        bxhPerBlock = _bxhPerBlock;
        startBlock = _startBlock;
        tokenLock = _tokenLock;
    }

    
    struct UserInfo {
        uint256 quantity;       // How many LP tokens the user has provided
        uint256 blockNumber;    // Last transaction block
    }

    struct PoolInfo {
        address pair;           // Trading pairs that can be mined
        uint256 quantity;       // Current amount of LPs
        uint256 totalQuantity;  // All quantity
        uint256 allocPoint;     // How many allocation points assigned to this pool
        uint256 allocBXHAmount; // How many BXHs
        uint256 lastRewardBlock;// Last transaction block
    }

    PoolInfo[] public poolInfo;
    event SwapMining(
        address pair,
        address user,
        uint256 amount,
        uint256 quantity
    );

    event ShareToSuper(
        address pair,
        address user,
        address superUser,
        uint256 shareAmount,
        uint256 quantity 
    );

    event ReferenceUpdate(
        address user,
        address lastReference,
        address changeReference
    );
    event TakerWithdraw(  
        address pair,
        address to,
        uint256 reward 
    );
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;


    function poolLength() public view returns (uint256) {
        return poolInfo.length;
    }

    // function setReference(address parent) public {
    //     require(references[msg.sender]==address(0x0),"already bind super");
    //     require(msg.sender!=parent,"cannot bind self");
    //     references[msg.sender] = parent;
    //     emit ReferenceUpdate(msg.sender,address(0x0),parent);
    // }

    // function changeReference(address from,address parent) public onlyOwner{
    //     emit ReferenceUpdate(from,references[from],parent);
    //     references[from] = parent;
    // }
    

    function addPair(uint256 _allocPoint, address _pair, bool _withUpdate) public onlyOwner {
        require(_pair != address(0), "_pair is the zero address");
        if (_withUpdate) {
            massMintPools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
        pair : _pair,
        quantity : 0,
        totalQuantity : 0,
        allocPoint : _allocPoint,
        allocBXHAmount : 0,
        lastRewardBlock : lastRewardBlock
        }));
        pairOfPid[_pair] = poolLength() - 1;
    }

    // Update the allocPoint of the pool
    function setPair(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massMintPools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    function setTokenLock(address _address) public onlyOwner {
        require(_address != address(0), "address is not 0");
        tokenLock = _address;
        TransferHelper.safeApprove(address(bxh), tokenLock, uint256(- 1));
    }


    // Set the number of bxh produced by each block
    function setBXHPerBlock(uint256 _newPerBlock) public onlyOwner {
        massMintPools();
        bxhPerBlock = _newPerBlock;
    }

    // Only tokens in the whitelist can be mined MDX
    function addWhitelist(address _addToken) public onlyOwner returns (bool) {
        require(_addToken != address(0), "SwapMining: token is the zero address");
        return EnumerableSet.add(_whitelist, _addToken);
    }

    function delWhitelist(address _delToken) public onlyOwner returns (bool) {
        require(_delToken != address(0), "SwapMining: token is the zero address");
        return EnumerableSet.remove(_whitelist, _delToken);
    }

    function getWhitelistLength() public view returns (uint256) {
        return EnumerableSet.length(_whitelist);
    }

    function isWhitelist(address _token) public view returns (bool) {
        return EnumerableSet.contains(_whitelist, _token);
    }

    function getWhitelist(uint256 _index) public view returns (address){
        require(_index <= getWhitelistLength() - 1, "SwapMining: index out of bounds");
        return EnumerableSet.at(_whitelist, _index);
    }

    function setHalvingPeriod(uint256 _block) public onlyOwner {
        halvingPeriod = _block;
    }

    function setRouter(address newRouter) public onlyOwner {
        require(newRouter != address(0), "SwapMining: new router is the zero address");
        router = newRouter;
    }

    function setOracle(IOracle _oracle) public onlyOwner {
        require(address(_oracle) != address(0), "SwapMining: new oracle is the zero address");
        oracle = _oracle;
    }

    // At what phase
    function phase(uint256 blockNumber) public view returns (uint256) {
        if (halvingPeriod == 0) {
            return 0;
        }
        if (blockNumber > startBlock) {
            return (blockNumber.sub(startBlock).sub(1)).div(halvingPeriod);
        }
        return 0;
    }

    function phase() public view returns (uint256) {
        return phase(block.number);
    }

    function reward(uint256 blockNumber) public view returns (uint256) {
        uint256 _phase = phase(blockNumber);
        return bxhPerBlock.div(2 ** _phase);
    }

    function reward() public view returns (uint256) {
        return reward(block.number);
    }

    // Rewards for the current block
    function getBXHReward(uint256 _lastRewardBlock) public view returns (uint256) {
        require(_lastRewardBlock <= block.number, "SwapMining: must little than the current block number");
        uint256 blockReward = 0;
        uint256 n = phase(_lastRewardBlock);
        uint256 m = phase(block.number);
        // If it crosses the cycle
        while (n < m) {
            n++;
            // Get the last block of the previous cycle
            uint256 r = n.mul(halvingPeriod).add(startBlock);
            // Get rewards from previous periods
            blockReward = blockReward.add((r.sub(_lastRewardBlock)).mul(reward(r)));
            _lastRewardBlock = r;
        }
        blockReward = blockReward.add((block.number.sub(_lastRewardBlock)).mul(reward(block.number)));
        return blockReward;
    }

    // Update all pools Called when updating allocPoint and setting new blocks
    function massMintPools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            mint(pid);
        }
    }

    function mint(uint256 _pid) public returns (bool) {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return false;
        }
        uint256 blockReward = getBXHReward(pool.lastRewardBlock);
        if (blockReward <= 0) {
            return false;
        }
        // Calculate the rewards obtained by the pool based on the allocPoint
        uint256 bxhReward = blockReward.mul(pool.allocPoint).div(totalAllocPoint);
        bxh.mint(address(this), bxhReward);
        // Increase the number of tokens in the current pool
        pool.allocBXHAmount = pool.allocBXHAmount.add(bxhReward);
        pool.lastRewardBlock = block.number;
        return true;
    }


    // swapMining only router
    function swap(address account, address input, address output, uint256 amount) public onlyRouter returns (bool) {
        require(account != address(0), "SwapMining: taker swap account is the zero address");
        require(input != address(0), "SwapMining: taker swap input is the zero address");
        require(output != address(0), "SwapMining: taker swap output is the zero address");
        if (poolLength() <= 0) {
            return false;
        }

        if (!isWhitelist(input) || !isWhitelist(output)) {
            return false;
        }

        address pair = IUniswapV2Factory(factory).getPair(input, output);

        PoolInfo storage pool = poolInfo[pairOfPid[pair]];
        // If it does not exist or the allocPoint is 0 then return
        if (pool.pair != pair || pool.allocPoint <= 0) {
            return false;
        }
        uint256 quantity = getQuantity(output, amount, targetToken);
        if (quantity <= 0) {
            return false;
        }
        mint(pairOfPid[pair]);
        pool.quantity = pool.quantity.add(quantity);
        pool.totalQuantity = pool.totalQuantity.add(quantity);
        UserInfo storage user = userInfo[pairOfPid[pair]][account];
        user.quantity = user.quantity.add(quantity);
        user.blockNumber = block.number;
        if (address(oracle) != address(0)) {
            IOracle(oracle).update(input, output);
        }
        emit SwapMining(pair,account,amount,quantity);
        return true;
    }

    // The user withdraws all the transaction rewards of the pool
    function takerWithdraw() public {
        uint256 userSub;
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            PoolInfo storage pool = poolInfo[pid];
            UserInfo storage user = userInfo[pid][msg.sender];
            if (user.quantity > 0) {
                mint(pid);
                // The reward held by the user in this pool
                uint256 userReward = pool.allocBXHAmount.mul(user.quantity).div(pool.quantity);
                pool.quantity = pool.quantity.sub(user.quantity);
                pool.allocBXHAmount = pool.allocBXHAmount.sub(userReward);
                user.quantity = 0;
                user.blockNumber = block.number;
                userSub = userSub.add(userReward);
                emit TakerWithdraw(pool.pair,msg.sender,userReward);
            }
        }
        if (userSub <= 0) {
            return;
        }
        // bxh.transfer(msg.sender, userSub);
        safeTokenTransfer(msg.sender, userSub);
    }

    function getTakerReward(address account) public view returns (uint256){
        uint256 userSub;
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            PoolInfo storage pool = poolInfo[pid];
            UserInfo storage user = userInfo[pid][account];
            if (user.quantity > 0) {
                uint256 userReward = pool.allocBXHAmount.mul(user.quantity).div(pool.quantity);
                userSub = userSub.add(userReward);
            }
        }
        return userSub;
    }
    // Get rewards from users in the current pool
    function getUserReward(uint256 _pid) public view returns (uint256, uint256){
        require(_pid <= poolInfo.length - 1, "SwapMining: Not find this pool");
        uint256 userSub;
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][msg.sender];
        if (user.quantity > 0) {
            uint256 blockReward = getBXHReward(pool.lastRewardBlock);
            uint256 bxhReward = blockReward.mul(pool.allocPoint).div(totalAllocPoint);
            userSub = userSub.add((pool.allocBXHAmount.add(bxhReward)).mul(user.quantity).div(pool.quantity));
        }
        //bxh available to users, User transaction amount
        return (userSub, user.quantity);
    }


    // Get details of the pool
    function getPoolInfo(uint256 _pid) public view returns (address, address, uint256, uint256, uint256, uint256){
        require(_pid <= poolInfo.length - 1, "SwapMining: Not find this pool");
        PoolInfo memory pool = poolInfo[_pid];
        address token0 = IUniswapV2Pair(pool.pair).token0();
        address token1 = IUniswapV2Pair(pool.pair).token1();
        uint256 bxhAmount = pool.allocBXHAmount;
        uint256 blockReward = getBXHReward(pool.lastRewardBlock);
        uint256 bxhReward = blockReward.mul(pool.allocPoint).div(totalAllocPoint);
        bxhAmount = bxhAmount.add(bxhReward);
        //token0,token1,Pool remaining reward,Total /Current transaction volume of the pool
        return (token0, token1, bxhAmount, pool.totalQuantity, pool.quantity, pool.allocPoint);
    }

    modifier onlyRouter() {
        require(msg.sender == router, "SwapMining: caller is not the router");
        _;
    }

    function getQuantity(address outputToken, uint256 outputAmount, address anchorToken) public view returns (uint256) {
        uint256 quantity = 0;
        if (outputToken == anchorToken) {
            quantity = outputAmount;
        } else if (IUniswapV2Factory(factory).getPair(outputToken, anchorToken) != address(0)) {
            quantity = IOracle(oracle).consult(outputToken, outputAmount, anchorToken);
        } else {
            uint256 length = getWhitelistLength();
            for (uint256 index = 0; index < length; index++) {
                address intermediate = getWhitelist(index);
                if (IUniswapV2Factory(factory).getPair(outputToken, intermediate) != address(0) && IUniswapV2Factory(factory).getPair(intermediate, anchorToken) != address(0)) {
                    uint256 interQuantity = IOracle(oracle).consult(outputToken, outputAmount, intermediate);
                    quantity = IOracle(oracle).consult(intermediate, interQuantity, anchorToken);
                    break;
                }
            }
        }
        return quantity;
    }


     function safeTokenTransfer(address _to, uint256 _amount) internal {
        uint256 bal = bxh.balanceOf(address(this));
        if (_amount > bal) {
            _amount = bal;
        }

        //share to upper
        (uint256 upperFee,uint256 upperFeeTotal) = factory.getReferAmount(_to, _amount);
        if(upperFee>0){
            bxh.mint(address(factory), upperFee);
            factory.rewardUpper(_to,address(bxh),upperFee,upperFeeTotal);  
        }   

        if (tokenLock != address(0) && ITokenLock(tokenLock).lockRate() > 0) {
            ITokenLock(tokenLock).getReward(_to);
            uint256 lock = ITokenLock(tokenLock).calLockAmount(_amount);
            ITokenLock(tokenLock).lockToken(_to, lock);
            _amount = _amount.sub(lock);
        }
        bxh.transfer(_to, _amount);
       
    }
}
