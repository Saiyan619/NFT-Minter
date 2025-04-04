// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract NiyiToken is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    
    // Constants
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.0005 ether;
    uint256 public maxMintPerAddress = 20;
    
    // Tracking
    mapping(address => uint256) public mintCount;
    
    // Events
    event NFTMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);
    
    constructor(address initialOwner) 
        ERC721("NiyiToken", "NTK") 
        Ownable(initialOwner) 
    {}
    
    // Minting Functions
    function mintNFT(string memory _tokenURI) public payable returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(mintCount[msg.sender] < maxMintPerAddress, "Mint limit reached");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        mintCount[msg.sender]++;
        
        emit NFTMinted(msg.sender, tokenId, _tokenURI);
        
        return tokenId;
    }
    
    function ownerMint(address to, string memory _tokenURI) public onlyOwner returns (uint256) {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        emit NFTMinted(to, tokenId, _tokenURI);
        
        return tokenId;
    }
    
    // Overrides for multiple inheritance
    function _update(address to, uint256 tokenId, address auth) 
        internal 
        virtual 
        override(ERC721, ERC721Enumerable) 
        returns (address) 
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount) 
        internal 
        virtual 
        override(ERC721, ERC721Enumerable) 
    {
        super._increaseBalance(account, amount);
    }
    
    // View Functions
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }
    
    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Management Functions
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    function setMaxMintPerAddress(uint256 newLimit) public onlyOwner {
        maxMintPerAddress = newLimit;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    // Required Overrides
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721Enumerable, ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
    
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
}