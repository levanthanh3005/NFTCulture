import React, { useState } from 'react';
import { Component } from 'react';

import MetaMaskOnboarding from '@metamask/onboarding'
// eslint-disable-next-line camelcase
import { encrypt, recoverPersonalSignature, recoverTypedSignatureLegacy, recoverTypedSignature, recoverTypedSignature_v4 } from 'eth-sig-util'
import { ethers } from 'ethers'
import { toChecksumAddress } from 'ethereumjs-util'

import { hstBytecode, hstAddress, hstAbi, piggybankBytecode, piggybankAbi } from './constants.json'
import { nftBytecode, nftAddress, nftAbi } from './NFT.json'

import {
  DateInput
} from "semantic-ui-calendar-react";


export default class BlockchainAPI extends Component {
	
	constructor(props) {
		super(props);
		this.state = {}
		this.serverPath = "https://nftbackendculture.herokuapp.com";
	}

	async connectAndLoadExistContract() {
	    this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')

	    const ethereum = window.ethereum;
	    // console.log(this)
	    try {
	      let accounts = await ethereum.request({
	        method: 'eth_requestAccounts',
	      })

	      this.contract = new ethers.Contract(
	        // Replace this with the address of your deployed contract
	        nftAddress,
	        nftAbi,
	        this.ethersProvider.getSigner()
	      );
	      // var addr = accounts[0];
	      // var balance = await this.contract.balanceOf(addr);
	      // // console.log(balance);


	      this.setState({
	        accounts,
	        tokenAddress : nftAddress
	      })
	      // console.log(this)

	    } catch (error) {
	      console.error(error)
	    }
	  }

	isMetaMaskConnected(){ 
		return (this.state && this.state.accounts && this.state.accounts.length > 0)
	}

	isMetaMaskInstalled() {
		const { isMetaMaskInstalled } = MetaMaskOnboarding

		return isMetaMaskInstalled();
	}

  async addAsset (e) {
      const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
      const tokenSymbol = 'TUT';
      const tokenDecimals = 18;
      const tokenImage = 'http://placekitten.com/200/300';

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        var ethereum = window.ethereum;

        const wasAdded = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage, // A string url of the token logo
            },
          },
        });

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
    }
  }

  async onClickConnect(e){
    const ethereum = window.ethereum;
    console.log(this)
    try {
      let accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      this.setState({
        accounts
      })
      console.log(this)

    } catch (error) {
      console.error(error)
    }
  }

  async deployButton() {
      let contract
      let self = this;
      self.state.contractStatus = 'Deploying'

      try {
        contract = await this.piggybankFactory.deploy()
        await contract.deployTransaction.wait()
      } catch (error) {
        self.state.contractStatus = 'Deployment Failed'
        throw error
      }

      if (contract.address === undefined) {
        return
      }

      console.log(`Contract mined! address: ${contract.address} transactionHash: ${contract.transactionHash}`)
      self.state.contractStatus = 'Deployed'
      
      console.log(contract)
    }

  async initContract() {
    try {
      // We must specify the network as 'any' for ethers to allow network changes
      this.ethereum = window.ethereum;
      this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      this.nftFactory = new ethers.ContractFactory(
        nftAbi,
        nftBytecode,
        this.ethersProvider.getSigner(),
      )
      console.log(this.nftFactory);
      this.piggybankFactory = new ethers.ContractFactory(
        piggybankAbi,
        piggybankBytecode,
        this.ethersProvider.getSigner(),
      )
    } catch (error) {
      console.error(error)
    }
  }


  async getAccountsButton (){
    try {
      const _accounts = await this.ethereum.request({
        method: 'eth_accounts',
      })
      // console.log(_accounts);
      this.setState({
        getAccountsResult : _accounts[0] || 'Not able to get accounts'
      })
    } catch (err) {
      // console.error(err)
      this.setState({
        getAccountsResult : `Error: ${err.message}`
      })
    }
  }

  async requestPermissionsButton(){
    try {
	    this.ethereum = window.ethereum;

      const permissionsArray = await this.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
      this.setState({
        permissionsResult : this.getPermissionsDisplayString(permissionsArray)
      })
    } catch (err) {
      console.error(err)
      this.setState({
        permissionsResult : `Error: ${err.message}`
      })
    }
  }

  async getPermissionsButton(){
    try {
      const permissionsArray = await this.ethereum.request({
        method: 'wallet_getPermissions',
      })
      this.setState({
        permissionsResult : this.getPermissionsDisplayString(permissionsArray)
      })

      console.log(this.state);

    } catch (err) {
      console.error(err)
      this.setState({
        permissionsResult : `Error: ${err.message}`
      })
    }
  }

  getPermissionsDisplayString (permissionsArray) {
    if (permissionsArray.length === 0) {
      return 'No permissions found.'
    }
    const permissionNames = permissionsArray.map((perm) => perm.parentCapability)
    return permissionNames.reduce((acc, name) => `${acc}${name}, `, '').replace(/, $/u, '')
  }

  async createToken() {
    const name_ = 'NFT'
    const symbol_ = "NFT"

    try {
        this.ethereum = window.ethereum;
        this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')
        this.nftFactory = new ethers.ContractFactory(
          nftAbi,
          nftBytecode,
          this.ethersProvider.getSigner(),
        )

        this.contract = await this.nftFactory.deploy(
          name_,
          symbol_
        )
      await this.contract.deployTransaction.wait()
      if (this.contract.address === undefined) {
        return undefined
      }

      console.log(`Contract mined! address: ${this.contract.address} transactionHash: ${this.contract.transactionHash}`)
      this.setState({
        tokenAddress : this.contract.address
      })
      // transferTokens.disabled = false
      // approveTokens.disabled = false
      // transferTokensWithoutGas.disabled = false
      // approveTokensWithoutGas.disabled = false

      console.log(this.contract)
      // return contract
    } catch (error) {
      this.state.tokenAddress = 'Creation Failed'
      throw error
    }
  }

  async transferTokens() {
    const result = await this.contract.transfer('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '15000', {
      from: this.state.accounts[0],
      gasLimit: 60000,
      gasPrice: '20000000000',
    })
    console.log('result', result)
  }

  async approveTokens (){
    const result = await this.contract.approve('0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4', '70000', {
      from: this.state.accounts[0],
      gasLimit: 60000,
      gasPrice: '20000000000',
    })
    console.log(result)
  }

  async transferTokensWithoutGas(){
    const result = await this.contract.transfer('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '15000', {
      gasPrice: '20000000000',
    })
    console.log('result', result)
  }

  async approveTokensWithoutGas() {
    const result = await this.contract.approve('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '70000', {
      gasPrice: '20000000000',
    })
    console.log(result)
  }

  async getTokenBalances() {
    // const result = await this.contract.approve('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '70000', {
    //   gasPrice: '20000000000',
    // })
    // console.log(result)
    var addr = this.state.addrCkBalance;
    if (!addr) {
      addr = this.state.accounts[0];
    }
    console.log(this);
    console.log(addr);
    // this.contract = new ethers.Contract(
    //   // Replace this with the address of your deployed contract
    //   nftAddress,
    //   nftAbi,
    //   this.ethersProvider.getSigner()
    // );
    console.log(this.contract);
    var balance = await this.contract.balanceOf(addr);
    console.log(balance);
    this.setState({
      tokenBalance  : balance.toString(),
      addrCkBalance : addr
    })
  }

  async initExistToken() {
    this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')

    this.contract = new ethers.Contract(
      // Replace this with the address of your deployed contract
      nftAddress,
      nftAbi,
      this.ethersProvider.getSigner()
    );
    // await this.getTokenBalances();
    this.setState({
      tokenAddress : nftAddress
    })
  }

	async readNFT () {
		const result = await this.contract.getNFTInfor(
		  this.state.bidImgHashToRead, {
		  gasPrice: '20000000000',
		})
		console.log('result', result);
		var bidImgHashToReadRs = (<>
		      <span>{"File Hash:"+this.state.bidImgHashToRead}</span><br/>
		      <span>{"Owner:"+result[0]}</span><br/>
		      <span>{"still bidding?:"+result[1]}</span><br/>
		      <span>{"Deadline:"+new Date(parseInt(result[2].toString()) * 1000)}</span><br/>
		      <span>{"Latest Bid:"+(result[3].toString())}</span><br/>
		      <span>{"Latest bidder:"+result[4]}</span><br/>
		    </>);
		this.setState({
		  bidImgHashToReadRs
		})
	}

}