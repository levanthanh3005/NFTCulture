// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */

// import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';


contract ERC20 {
    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    address _owner;
    uint256 _exchangeRate = 1000;//1 ether = 1000 token

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The defaut value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor (string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        _owner = msg.sender;
    }

    function setExchangeRate(uint256 exchangeRate_) public virtual {
        require (msg.sender == _owner);
        _exchangeRate = exchangeRate_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public virtual returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    event LogUint(string, uint);

    function buy() payable public {
        uint256 amountTobuy = msg.value * _exchangeRate / 1000000000000000000;
        uint256 nftBalance = balanceOf(address(this));
        require(amountTobuy > 0, "You need to send some ether");
        emit LogUint("Amount to buy", amountTobuy);
        require(amountTobuy <= nftBalance, "Not enough tokens in the reserve");
        _transfer(address(this), msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function sell(address payable receivedAddresss, uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
       // uint256 allowance = token.allowance(msg.sender, address(this));
        // require(allowance >= amount, "Check the token allowance");
        transferFrom(msg.sender, address(this), amount);
        uint256 ethAmount = amount / _exchangeRate;
        require(address(this).balance > ethAmount ,"We do not have enougth Eth for you");
        receivedAddresss.transfer(ethAmount);
        emit Sold(amount);
    }
    

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, msg.sender, currentAllowance - amount);

        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(msg.sender, spender, currentAllowance - subtractedValue);

        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function mint(uint256 amount) public virtual returns (bool) {
        require(msg.sender == _owner, "You  are not owner");
        _mint(address(this), amount);
        return true;
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    /**
        Voting here
    */
    
    struct NFT {
        bytes32 NFTId;
        address owner;
    }
    struct Bidding {
        bytes32 NFTId;
        uint256 deadline;
        uint256 latestBidPrice;
        address latestBidder;
    }

    // NFT[] private NFTs;
    // bidding[] private biddings;
    mapping (bytes32 => NFT) private NFTs;
    bytes32[] private NFTList;
    mapping (bytes32 => Bidding) private biddings;
    mapping (bytes32 => bool) private hideNFTs;

    function buildNFT(
        bytes32 NFTId
        ) public virtual {
        require (msg.sender == _owner);
        require (NFTs[NFTId].NFTId == 0, "The NFT has been exist");
        NFT memory newNFT = NFT(NFTId, msg.sender);
        NFTs[NFTId] = newNFT;
        NFTList.push(NFTId);
    }

    function buildBidding(
        bytes32 NFTId,
        uint256 deadline,
        uint256 latestBidPrice) public virtual {
        require (msg.sender == _owner);
        require (NFTs[NFTId].owner == msg.sender);
        
        emit LogUint("Current Time", block.timestamp);
        Bidding memory newB = Bidding(NFTId, deadline, latestBidPrice, msg.sender);
        biddings[NFTId] = newB;
    }

    function startBid(bytes32 NFTId, uint256 price) public virtual {
        // Ref: https://github.com/ConsenSysMesh/openzeppelin-solidity/blob/master/contracts/crowdsale/validation/TimedCrowdsale.sol
        Bidding memory bid = biddings[NFTId];

        require(block.timestamp < bid.deadline, "The bidding has been closed");
        require(bid.latestBidPrice < price, "Your bid is not enought");
        require(_balances[msg.sender] > price, "You do not have enough token");
        
        _transfer(address(this), biddings[NFTId].latestBidder, biddings[NFTId].latestBidPrice);
        //Return money to the previous bidder
        _transfer(msg.sender, address(this), price);
        
        biddings[NFTId].latestBidPrice = price;
        biddings[NFTId].latestBidder = msg.sender;
    }
    
    function startBidGreater20Percent(bytes32 NFTId, uint256 price) public virtual {
        // Ref: https://github.com/ConsenSysMesh/openzeppelin-solidity/blob/master/contracts/crowdsale/validation/TimedCrowdsale.sol
        Bidding memory bid = biddings[NFTId];

        require(block.timestamp < bid.deadline, "The bidding has been closed");
        require(bid.latestBidPrice < price, "Your bid is not enough");
        require(bid.latestBidPrice + bid.latestBidPrice/5 < price , "Your bid must be greater than 20%");
        require(_balances[msg.sender] > price, "You do not have enough token");
        
        _transfer(address(this), biddings[NFTId].latestBidder, biddings[NFTId].latestBidPrice);
        //Return money to the previous bidder
        _transfer(msg.sender, address(this), price);
        
        biddings[NFTId].latestBidPrice = price;
        biddings[NFTId].latestBidder = msg.sender;
    }

    function completeBid(bytes32 NFTId) public virtual {
        require (msg.sender == _owner);
        Bidding memory bid = biddings[NFTId];

        if(block.timestamp < bid.deadline) {
            biddings[NFTId].deadline = block.timestamp;
        }
        NFTs[NFTId].owner = bid.latestBidder;
    }
    function getNFTInfor(bytes32 NFTId) public view returns (address, bool, uint256, uint256, address,bool){ 
        //currentOwner, isCompleted, deadline,latestBidPrice, latestBidder 
        return ( 
                 NFTs[NFTId].owner, 
                 biddings[NFTId].deadline > block.timestamp,
                 biddings[NFTId].deadline,
                 biddings[NFTId].latestBidPrice,
                 biddings[NFTId].latestBidder,
                 hideNFTs[NFTId]
                );
    }
    
    function getNFTList() public view returns (bytes32[] memory){ 
        return NFTList;
    }
    
    function getNFTDisplayList() public view returns (bytes32[] memory){ 
        bytes32[] memory newLs = new bytes32[](NFTList.length);
        uint256 e;
        uint256 i = 0;
        for ( e = 0;e < NFTList.length;e++) {
            bytes32 v = NFTList[e];
            if (hideNFTs[v] == false) {
                newLs[i] = v;
                i = i + 1;
            }
        }
        return newLs;
    }
    
    function hideNFT(bytes32 NFTId) public virtual {
        require (msg.sender == _owner);
        hideNFTs[NFTId] = true;
    }
}