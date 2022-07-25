// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

//     __      _                ______      __
//    / /_  __(_)___  ____ _   / __/ /___ _/ /_
//   / / / / / / __ \/ __ `/  / /_/ / __ `/ __/
//  / / /_/ / / / / / /_/ /  / __/ / /_/ / /_
// /_/\__, /_/_/ /_/\__, /  /_/ /_/\__,_/\__/
//   /____/        /____/

/*//////////////////////////////////////////////////////////////
                        ERRORS
//////////////////////////////////////////////////////////////*/
error LF_PublicSaleNotOpen();
error LF_MintLimitExceeded();
error LF_ExceedsMaxSupply();
error LF_InsufficientPayment();

/**
 @title LayingFlat
 @notice The LayingFlat contract is used to create and manage a LayingFlat.
 @author javvvs
 */

contract LayingFlat is ERC721, IERC2981, ReentrancyGuard, Ownable {
    /*//////////////////////////////////////////////////////////////
                        INIT/CONSTRUCTOR
//////////////////////////////////////////////////////////////*/

    /// @notice Initialize the contract with the given parameters.
    /// @dev it takes a the URI and stores it as a state variable

    constructor(string memory customBaseURI_) ERC721("Laying Flat", "FLAT") {
        customBaseURI = customBaseURI_;
    }

    /*//////////////////////////////////////////////////////////////
                        EVENTS
//////////////////////////////////////////////////////////////*/

    event MintedAnNFT(address indexed to, uint256 indexed tokenId);

    /*//////////////////////////////////////////////////////////////
                        STATE VARIABLES
//////////////////////////////////////////////////////////////*/

    uint256 public constant MINT_LIMIT_PER_WALLET = 2;
    uint256 public constant MAX_SUPPLY = 20;
    uint256 public constant PRICE = 0.1 ether;
    uint16 private mintCounter = 1;
    bool public isPublicSaleActive;
    string private customBaseURI;
    string private customContractURI =
        "ipfs://bafybeiddblti7v4kmhda2neoggpr3jaikdz5rbp4xzzqqyjykotkmf45xy/";

    /*//////////////////////////////////////////////////////////////
                        CUSTOM MODIFIERS
//////////////////////////////////////////////////////////////*/

    modifier publicSaleActive() {
        if (!isPublicSaleActive) {
            revert LF_PublicSaleNotOpen();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        WRITE FUNCTIONS
//////////////////////////////////////////////////////////////*/

    ///@notice Mints a new token for the given address.
    ///@param _amount The amount of tokens to mint.
    ///@dev Note that the amount of tokens minted is limited to the MINT_LIMIT_PER_WALLET constant.
    ///it also checks if the total supply is not exceeded and if the payment is sufficient.
    ///Public sale is also checked and has a modifier to avoid reentrancy.

    function mint(uint256 _amount)
        public
        payable
        nonReentrant
        publicSaleActive
    {
        if (balanceOf(msg.sender) + _amount > MINT_LIMIT_PER_WALLET) {
            revert LF_MintLimitExceeded();
        } else if (mintCounter + _amount > MAX_SUPPLY) {
            revert LF_ExceedsMaxSupply();
        } else if (msg.value != PRICE * _amount) {
            revert LF_InsufficientPayment();
        } else {
            for (uint256 i = 0; i < _amount; i++) {
                _mint(msg.sender, mintCounter);
                emit MintedAnNFT(msg.sender, mintCounter);
                unchecked {
                    mintCounter++;
                }
            }
        }
    }

    ///@notice changes the public sale status
    ///@param _isPublicSaleActive The new status of the public sale.
    ///@dev This function is only available to the owner of the contract.

    function setIsPublicSaleActive(bool _isPublicSaleActive)
        external
        onlyOwner
    {
        isPublicSaleActive = _isPublicSaleActive;
    }

    function setContractURI(string memory customContractURI_)
        external
        onlyOwner
    {
        customContractURI = customContractURI_;
    }

    function setBaseURI(string memory customBaseURI_) external onlyOwner {
        customBaseURI = customBaseURI_;
    }

    /*//////////////////////////////////////////////////////////////
                        READ FUNCTIONS
//////////////////////////////////////////////////////////////*/

    function contractURI() public view returns (string memory) {
        return customContractURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return customBaseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(tokenId), ".token.json"));
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW AND ROYALTIES FUNCTIONS
//////////////////////////////////////////////////////////////*/

    address private constant payoutAddress1 =
        0x52aA63A67b15e3C2F201c9422cAC1e81bD6ea847;
    address private constant payoutAddress2 =
        0xc178ED301ADF2B73609B6d527386f21618c323c2;

    function withdraw() public nonReentrant onlyOwner {
        uint256 balance = address(this).balance;
        Address.sendValue(payable(payoutAddress1), (balance * 50) / 100);
        Address.sendValue(payable(payoutAddress2), (balance * 50) / 100);
    }

    ///@notice sets the royalties for secondary sales.
    ///Override function gets royalty information for a token (EIP-2981)
    ///@param salePrice as an input to calculate the royalties
    ///@dev conforms to EIP-2981

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (address(this), (salePrice * 1500) / 10000);
    }

    ///@notice override function to check if contract supports given interface
    ///@param interfaceId id of interface to check
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return (interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId));
    }
}
