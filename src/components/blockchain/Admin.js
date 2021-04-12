import React, { useState } from 'react';
import { Component } from 'react';

import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';

import MetaMaskOnboarding from '@metamask/onboarding'
// eslint-disable-next-line camelcase
import { encrypt, recoverPersonalSignature, recoverTypedSignatureLegacy, recoverTypedSignature, recoverTypedSignature_v4 } from 'eth-sig-util'
import { ethers } from 'ethers'
import { toChecksumAddress } from 'ethereumjs-util'

import { hstBytecode, hstAddress, hstAbi, piggybankBytecode, piggybankAbi } from './constants.json'
import { nftBytecode, nftAddress, nftAbi } from './NFT.json'

import 'semantic-ui-css/semantic.min.css'

import Files from "react-files";
import axios from 'axios';

import {
  DateInput
} from "semantic-ui-calendar-react";


import './admin.css'

import BlockchainAPI from './BlockchainAPI'

const serverPath = "https://nftbackendculture.herokuapp.com";
// this.serverPath = "https://nftbackendculture.herokuapp.com";


// const propTypes = {
//   ...SectionProps.types
// }

// const defaultProps = {
//   ...SectionProps.defaults
// }

// const Hero = ({
//   className,
//   topOuterDivider,
//   bottomOuterDivider,
//   topDivider,
//   bottomDivider,
//   hasBgColor,
//   invertColor,
//   ...props
// }) => {

//   const [videoModalActive, setVideomodalactive] = useState(false);

let piggybankFactory


export default class Admin extends BlockchainAPI {

  constructor(props) {
    super(props);
    this.state = {
      contractStatus : "Not Click"
    }
    this.state.outerClasses = classNames(
      'hero section center-content',
      this.props.topOuterDivider && 'has-top-divider',
      this.props.bottomOuterDivider && 'has-bottom-divider',
      this.props.hasBgColor && 'has-bg-color',
      this.props.invertColor && 'invert-color',
      this.props.className
    );

    this.state.innerClasses = classNames(
      'hero-inner section-inner',
      this.props.topDivider && 'has-top-divider',
      this.props.bottomDivider && 'has-bottom-divider'
    );

    // this.fileReader = new FileReader();
    // this.fileReader.onload = event => {
    //   // event.preventDefault()
    //   var rsbob = event.target.result;
    //   var messageBytes = ethers.utils.toUtf8Bytes(rsbob);
    //   // console.log(ethers.utils.keccak256(messageBytes));
    //   var fileHash = ethers.utils.keccak256(messageBytes);
    //   this.setState({
    //     fileHash
    //   })

    //   var data = new FormData() 
    //   data.append('file', rsbob)
    //   console.log(data);

    //   axios.post(serverPath+"/upload", data, { // receive two parameter endpoint url ,form data 
    //   })
    //   .then(res => { // then print response status
    //     console.log(res.statusText)
    //   })
    //   // https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
    //   // https://github.com/krissnawat/simple-react-upload
    //   // 172.17.0.4:3000
    // };
    // console.log(ethers.utils);
  }

  componentDidMount() {
    // console.log(this);
    if (this.isMetaMaskInstalled()) {
      if (!this.isMetaMaskConnected()) {
        this.connectAndLoadExistContract();
      }
    } else {

    }
  }


  // isMetaMaskConnected(){ 
  //   return (this.state && this.state.accounts && this.state.accounts.length > 0)
  // }

  // async addAsset (e) {
  //     const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
  //     const tokenSymbol = 'TUT';
  //     const tokenDecimals = 18;
  //     const tokenImage = 'http://placekitten.com/200/300';

  //     try {
  //       // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  //       var ethereum = window.ethereum;

  //       const wasAdded = await ethereum.request({
  //         method: 'wallet_watchAsset',
  //         params: {
  //           type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //           options: {
  //             address: tokenAddress, // The address that the token is at.
  //             symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //             decimals: tokenDecimals, // The number of decimals in the token
  //             image: tokenImage, // A string url of the token logo
  //           },
  //         },
  //       });

  //       if (wasAdded) {
  //         console.log('Thanks for your interest!');
  //       } else {
  //         console.log('Your loss!');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //   }
  // }

  // async onClickConnect(e){
  //   const ethereum = window.ethereum;
  //   console.log(this)
  //   try {
  //     let accounts = await ethereum.request({
  //       method: 'eth_requestAccounts',
  //     })
  //     this.setState({
  //       accounts
  //     })
  //     console.log(this)

  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async deployButton() {
  //     let contract
  //     let self = this;
  //     self.state.contractStatus = 'Deploying'

  //     try {
  //       contract = await this.piggybankFactory.deploy()
  //       await contract.deployTransaction.wait()
  //     } catch (error) {
  //       self.state.contractStatus = 'Deployment Failed'
  //       throw error
  //     }

  //     if (contract.address === undefined) {
  //       return
  //     }

  //     console.log(`Contract mined! address: ${contract.address} transactionHash: ${contract.transactionHash}`)
  //     self.state.contractStatus = 'Deployed'
      
  //     console.log(contract)
  //   }

  // async initContract() {
  //   try {
  //     // We must specify the network as 'any' for ethers to allow network changes
  //     this.ethereum = window.ethereum;
  //     this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  //     this.nftFactory = new ethers.ContractFactory(
  //       nftAbi,
  //       nftBytecode,
  //       this.ethersProvider.getSigner(),
  //     )
  //     console.log(this.nftFactory);
  //     this.piggybankFactory = new ethers.ContractFactory(
  //       piggybankAbi,
  //       piggybankBytecode,
  //       this.ethersProvider.getSigner(),
  //     )
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  // async getAccountsButton (){
  //   try {
  //     const _accounts = await this.ethereum.request({
  //       method: 'eth_accounts',
  //     })
  //     // console.log(_accounts);
  //     this.setState({
  //       getAccountsResult : _accounts[0] || 'Not able to get accounts'
  //     })
  //   } catch (err) {
  //     // console.error(err)
  //     this.setState({
  //       getAccountsResult : `Error: ${err.message}`
  //     })
  //   }
  // }

  // async requestPermissionsButton(){
  //   try {
  //     const permissionsArray = await this.ethereum.request({
  //       method: 'wallet_requestPermissions',
  //       params: [{ eth_accounts: {} }],
  //     })
  //     this.setState({
  //       permissionsResult : this.getPermissionsDisplayString(permissionsArray)
  //     })
  //   } catch (err) {
  //     console.error(err)
  //     this.setState({
  //       permissionsResult : `Error: ${err.message}`
  //     })
  //   }
  // }

  // async getPermissionsButton(){
  //   try {
  //     const permissionsArray = await this.ethereum.request({
  //       method: 'wallet_getPermissions',
  //     })
  //     this.setState({
  //       permissionsResult : this.getPermissionsDisplayString(permissionsArray)
  //     })

  //     console.log(this.state);

  //   } catch (err) {
  //     console.error(err)
  //     this.setState({
  //       permissionsResult : `Error: ${err.message}`
  //     })
  //   }
  // }

  // getPermissionsDisplayString (permissionsArray) {
  //   if (permissionsArray.length === 0) {
  //     return 'No permissions found.'
  //   }
  //   const permissionNames = permissionsArray.map((perm) => perm.parentCapability)
  //   return permissionNames.reduce((acc, name) => `${acc}${name}, `, '').replace(/, $/u, '')
  // }

  // async createToken() {
  //   const name_ = 'NFT'
  //   const symbol_ = "NFT"

  //   try {
  //       this.ethereum = window.ethereum;
  //       this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  //       this.nftFactory = new ethers.ContractFactory(
  //         nftAbi,
  //         nftBytecode,
  //         this.ethersProvider.getSigner(),
  //       )

  //       this.contract = await this.nftFactory.deploy(
  //         name_,
  //         symbol_
  //       )
  //     await this.contract.deployTransaction.wait()
  //     if (this.contract.address === undefined) {
  //       return undefined
  //     }

  //     console.log(`Contract mined! address: ${this.contract.address} transactionHash: ${this.contract.transactionHash}`)
  //     this.setState({
  //       tokenAddress : this.contract.address
  //     })
  //     // transferTokens.disabled = false
  //     // approveTokens.disabled = false
  //     // transferTokensWithoutGas.disabled = false
  //     // approveTokensWithoutGas.disabled = false

  //     console.log(this.contract)
  //     // return contract
  //   } catch (error) {
  //     this.state.tokenAddress = 'Creation Failed'
  //     throw error
  //   }
  // }

  // async transferTokens() {
  //   const result = await this.contract.transfer('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '15000', {
  //     from: this.state.accounts[0],
  //     gasLimit: 60000,
  //     gasPrice: '20000000000',
  //   })
  //   console.log('result', result)
  // }

  // async approveTokens (){
  //   const result = await this.contract.approve('0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4', '70000', {
  //     from: this.state.accounts[0],
  //     gasLimit: 60000,
  //     gasPrice: '20000000000',
  //   })
  //   console.log(result)
  // }

  // async transferTokensWithoutGas(){
  //   const result = await this.contract.transfer('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '15000', {
  //     gasPrice: '20000000000',
  //   })
  //   console.log('result', result)
  // }

  // async approveTokensWithoutGas() {
  //   const result = await this.contract.approve('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '70000', {
  //     gasPrice: '20000000000',
  //   })
  //   console.log(result)
  // }

  // async getTokenBalances() {
  //   // const result = await this.contract.approve('0x2f318C334780961FB129D2a6c30D0763d9a5C970', '70000', {
  //   //   gasPrice: '20000000000',
  //   // })
  //   // console.log(result)
  //   var addr = this.state.addrCkBalance;
  //   if (!addr) {
  //     addr = this.state.accounts[0];
  //   }
  //   console.log(this);
  //   console.log(addr);
  //   // this.contract = new ethers.Contract(
  //   //   // Replace this with the address of your deployed contract
  //   //   nftAddress,
  //   //   nftAbi,
  //   //   this.ethersProvider.getSigner()
  //   // );
  //   console.log(this.contract);
  //   var balance = await this.contract.balanceOf(addr);
  //   console.log(balance);
  //   this.setState({
  //     tokenBalance  : balance.toString(),
  //     addrCkBalance : addr
  //   })
  // }

  // async initExistToken() {
  //   this.contract = new ethers.Contract(
  //     // Replace this with the address of your deployed contract
  //     nftAddress,
  //     nftAbi,
  //     this.ethersProvider.getSigner()
  //   );
  //   // await this.getTokenBalances();
  //   this.setState({
  //     tokenAddress : nftAddress
  //   })
  // }

  handleInputChange(event) {
      event.preventDefault();
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
  }

  handleDateChange(event, { name, value }){
    event.preventDefault();
    // console.log(name);
    // console.log(value);
    this.setState({
      [name]: value 
    });
  };

  async mintToken(){
    const result = await this.contract.mint('100000', {
      gasPrice: '20000000000',
    })
    console.log('result', result)
  }

  async buildNFTToken(fileHash){
    const result = await this.contract.buildNFT(fileHash, {
      gasPrice: '20000000000',
    })
    console.log('result', result);
  }

  async getNFTList(){
    const result = await this.contract.getNFTList()
    console.log('getNFTList');
    console.log(result);

    var children = result.map((value, index)=> {
      return (<><a href={serverPath+"/"+value+".jpeg"} style={{color:"black"}}>{index} : {value}</a><br/></>)
    })
    // console.log(ls)
    this.setState({
      NFTList : children
    })
  }

  saveNFTContent(callback) {
    var content = JSON.stringify({
      content: this.state.txtNFTContent,
      title: this.state.txtNFTTitle
    });
    var fileHash = this.state.fileHash;

    // console.log(content);

    axios.post(serverPath+"/content/"+fileHash, {
        content: content
      },{})
      .then(res => { // then print response status
        console.log(res.statusText);
        callback();
      })

  }

  onChangeFileHandler(event) {

    // console.log(event.target.files[0])
    var selectedFile = event.target.files[0];
    // var data = new FormData();

    // data.append('file', selectedFile)
    // console.log(data);

    // axios.post("http://192.168.1.103:3006/upload", data, { // receive two parameter endpoint url ,form data 
    // })
    // .then(res => { // then print response status
    //   console.log(res.statusText)
    // })

    var self = this;
    var fr = new FileReader();
    // console.log(selectedFile);

    var reader = new FileReader();
    reader.onload = function() {
      var arrayBuffer = this.result;
      var array = new Uint8Array(arrayBuffer);
      var binaryString = String.fromCharCode.apply(null, array);
      // console.log(binaryString);
      var messageBytes = ethers.utils.toUtf8Bytes(binaryString);
      // console.log(ethers.utils.keccak256(messageBytes));
      var fileHash = ethers.utils.keccak256(messageBytes);
      
      // selectedFile.name = fileHash+".jpeg";

      var data = new FormData();

      data.append('file', selectedFile)

      // console.log(data);

      axios.post(serverPath+"/upload/"+fileHash, data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText);
        self.setState({
          fileHash
        })
        self.saveNFTContent(function() {
          self.buildNFTToken(fileHash);
        });
      })

      // console.log(fileHash);
    }
    reader.readAsArrayBuffer(selectedFile);
  }

  async createBid () {
    var myDate = this.state.bidDeadline.split("-");
    var bidDeadlineTimeStamp = ((new Date( myDate[2], myDate[1] - 1, myDate[0])).getTime())/1000;
    // console.log(bidDeadlineTimeStamp);
    // console.log(this.state.bidImgHash);
    // console.log(this.state.bidLatestPrice);

    const result = await this.contract.buildBidding(
      this.state.bidImgHash,
      bidDeadlineTimeStamp,
      this.state.bidLatestPrice, {
      gasPrice: '20000000000',
    })
    console.log('result', result);

  }

  async completeBid() {
    const result = await this.contract.completeBid(
      this.state.bidImgHashToRead, {
      gasPrice: '20000000000',
    })
    console.log('result', result);
  }

  render() {
    return (
      <section
        className={this.state.outerClasses}
      >

        <section>
          <div class="row">
            
            <div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">
                    Basic Actions
                  </h4>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    disabled={this.isMetaMaskConnected()}
                    onClick={this.onClickConnect.bind(this)}
                  >
                    {this.isMetaMaskConnected() ? "Connected" : "Lets connect"}
                  </button>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="getAccounts"
                    onClick={this.getAccountsButton.bind(this)}
                  >
                    eth_accounts
                  </button>

                  <p class="info-text alert alert-secondary">
                    eth_accounts result: <span id="getAccountsResult">{this.state.getAccountsResult}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">
                    Permissions Actions
                  </h4>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="requestPermissions"
                    onClick={this.requestPermissionsButton.bind(this)}
                  >
                    Request Permissions
                  </button>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="getPermissions"
                    onClick={this.getPermissionsButton.bind(this)}
                  >
                    Get Permissions
                  </button>

                  <p class="info-text alert alert-secondary">
                    Permissions result: <span id="permissionsResult">{this.state.permissionsResult}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="row">

            <div
              class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch"
            >
              <div class="card full-width">
                <div class="card-body">
                  <h4 class="card-title">
                    Send Tokens
                  </h4>

                  <p class="info-text alert alert-success">
                    Token: <span id="tokenAddress">{this.state.tokenAddress}</span>
                  </p>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="createToken"
                    onClick={this.createToken.bind(this)}
                  >
                    Create Token
                  </button>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.initExistToken.bind(this)}
                  >
                    Load Token
                  </button>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="transferTokens"
                    onClick={this.transferTokens.bind(this)}
                  >
                    Transfer Tokens
                  </button>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.getTokenBalances.bind(this)}
                  >
                    Get Token balances
                  </button>
                  <p class="info-text alert alert-success">
                    Address: <input value={this.state.addrCkBalance} onChange={(e)=>this.handleInputChange(e)} name="addrCkBalance" />
                  </p>
                  <p class="info-text alert alert-success">
                    Balance: <span id="tokenBalance">{this.state.tokenBalance}</span>
                  </p>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    id="approveTokensWithoutGas"
                    onClick={this.mintToken.bind(this)}
                  >
                    Mint Tokens
                  </button>

                </div>
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch"
            >
              <div class="card full-width">
                <div class="card-body">
                  <h4 class="card-title">
                    Create NFT
                  </h4>

                  <label class="btn btn-primary btn-lg btn-block mb-3">
                    Enter content here and then upload file
                  </label>

                  <p class="info-text alert alert-success">
                    Product Title: <input value={this.state.txtNFTTitle} onChange={(e)=>this.handleInputChange(e)} name="txtNFTTitle" />
                  </p>

                  <label class="btn btn-primary btn-lg btn-block mb-3">
                    <textarea name="txtNFTContent" rows="4" cols="40" style={{color:"black"}} onChange={(e)=>this.handleInputChange(e)} />
                  </label>

                  <label class="btn btn-primary btn-lg btn-block mb-3">
                      <i className="fa fa-download loadCert">
                              Load a file
                              <input type="file" name="file" onChange={this.onChangeFileHandler.bind(this)}/>
                            </i>
                  </label>

                  <p class="info-text alert alert-success">
                    File hash: <a href={serverPath+"/"+this.state.fileHash+".jpeg"} style={{color:"black"}}>{this.state.fileHash}</a>
                    <br/>
                    Content link: <a href={serverPath+"/"+this.state.fileHash+".txt"} style={{color:"black"}}>{this.state.fileHash}</a>
                  </p>
                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.getNFTList.bind(this)}
                  >
                    Get NFT List
                  </button>
                  <p class="info-text alert alert-success">
                    {this.state.NFTList}
                  </p>
                </div>
              </div>
            </div>


            <div
              class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch"
            >
              <div class="card full-width">
                <div class="card-body">
                  <h4 class="card-title">
                    Create Bid
                  </h4>

                  <p class="info-text alert alert-success">
                    Image hash: <input value={this.state.bidImgHash} onChange={(e)=>this.handleInputChange(e)} name="bidImgHash" />
                  </p>
                  <p class="info-text alert alert-success">
                    Deadline: 
                    <DateInput
                        name="bidDeadline"
                        placeholder="Date"
                        value={this.state.bidDeadline}
                        iconPosition="left"
                        onChange={this.handleDateChange.bind(this)}
                      />
                  </p>
                  <p class="info-text alert alert-success">
                    Initial Price: <input value={this.state.bidLatestPrice} onChange={(e)=>this.handleInputChange(e)} name="bidLatestPrice" />
                  </p>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.createBid.bind(this)}
                  >
                    Create Bid
                  </button>

                </div> 
              </div>
            </div>

          </div>
        </section>

        <section>
          <div class="row">

            <div
              class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch"
            >
              <div class="card full-width">
                <div class="card-body">
                  <h4 class="card-title">
                    Read Token
                  </h4>

                  <p class="info-text alert alert-success">
                    Image hash: <input value={this.state.bidImgHashToRead} onChange={(e)=>this.handleInputChange(e)} name="bidImgHashToRead" />
                  </p>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.readNFT.bind(this)}
                  >
                    Read Bid
                  </button>

                  <p class="info-text alert alert-success">
                    {this.state.bidImgHashToReadRs}
                  </p>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.completeBid.bind(this)}
                  >
                    Complete Bid
                  </button>

                </div> 
              </div>
            </div>

            <div
              class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 d-flex align-items-stretch"
            >
              <div class="card full-width">
                <div class="card-body">
                  <h4 class="card-title">
                    Update NFT Content
                  </h4>

                  <p class="info-text alert alert-success">
                    File hash: <input value={this.state.fileHash} onChange={(e)=>this.handleInputChange(e)} name="fileHash" />
                  </p>

                  <p class="info-text alert alert-success">
                    Product Title: <input value={this.state.txtNFTTitle} onChange={(e)=>this.handleInputChange(e)} name="txtNFTTitle" />
                  </p>

                  <label class="btn btn-primary btn-lg btn-block mb-3">
                    <textarea name="txtNFTContent" rows="4" cols="40" style={{color:"black"}} onChange={(e)=>this.handleInputChange(e)} />
                  </label>

                  <button
                    class="btn btn-primary btn-lg btn-block mb-3"
                    onClick={this.saveNFTContent.bind(this, function(){})}
                  >                    
                    Save NFT Content Only
                  </button>

                </div> 
              </div>
            </div>

          </div>
        </section>

      </section>
    )
  };
}