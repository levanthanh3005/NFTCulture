import React, { useState, useRef, useEffect } from 'react';
import { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';
import { Image } from 'semantic-ui-react'


// const propTypes = {
//   navPosition: PropTypes.string,
//   hideNav: PropTypes.bool,
//   hideSignin: PropTypes.bool,
//   bottomOuterDivider: PropTypes.bool,
//   bottomDivider: PropTypes.bool
// }

// const defaultProps = {
//   navPosition: '',
//   hideNav: false,
//   hideSignin: false,
//   bottomOuterDivider: false,
//   bottomDivider: false
// }

// const Header = ({
//   className,
//   navPosition,
//   hideNav,
//   hideSignin,
//   bottomOuterDivider,
//   bottomDivider,
//   ...props
// }) => {

import { ethers } from 'ethers'
import { nftBytecode, nftAddress, nftAbi } from '../blockchain/NFT.json'


import BlockchainAPI from '../blockchain/BlockchainAPI'

export default class Header extends BlockchainAPI {

  constructor(props) {
    super(props);
    this.state = {}

  }

  // const [isActive, setIsactive] = useState(false);

  // setIsactive(bool){
  //   this.setState({
  //     isActive : bool
  //   })
  // }  

  // useEffect() {
  //   this.state.isActive && this.openMenu();
  //   document.addEventListener('keydown', this.keyPress);
  //   document.addEventListener('click', this.clickOutside);
  //   return () => {
  //     document.removeEventListener('keydown', this.keyPress);
  //     document.removeEventListener('click', this.clickOutside);
  //     this.closeMenu();
  //   };
  // };  

  // openMenu(){
  //   document.body.classList.add('off-nav-is-active');
  //   this.setIsactive(true);
  // }

  // closeMenu(){
  //   document.body.classList.remove('off-nav-is-active');
  //   this.setIsactive(false);
  // }

  // keyPress(e){
  //   this.state.isActive && e.keyCode === 27 && this.closeMenu();
  // }

  // clickOutside(e){
  //   this.closeMenu();
  // }


  componentDidMount() {   
    // if (!this.isMetaMaskConnected()) {
    //   // this.onClickConnect();
    //   // this.initExistToken();
    //   // this.loadData();
    //   this.allConnect();
    // }
    if (this.isMetaMaskInstalled()) {
      if (!this.isMetaMaskConnected()) {
        this.allConnect();
      }
    } else {

    }
  }

  async allConnect() {
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
      var addr = accounts[0];
      console.log(addr);
      console.log(this);
      var balance = await this.contract.balanceOf(addr);
      // console.log(balance);


      this.setState({
        accounts,
        tokenAddress : nftAddress,
        userAddress  : addr,
        userAmount : balance.toString()
      })
      // console.log(this)

    } catch (error) {
      console.error(error)
    }
  }

  // async onClickConnect(e){
  //   this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')

  //   const ethereum = window.ethereum;
  //   // console.log(this)
  //   try {
  //     let accounts = await ethereum.request({
  //       method: 'eth_requestAccounts',
  //     })
  //     this.setState({
  //       accounts
  //     })
  //     // console.log(this)

  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  // isMetaMaskConnected(){ 
  //   return (this.state && this.state.accounts && this.state.accounts.length > 0)
  // }

  async requestPermissionsButton(){
    try {
      var ethereum = window.ethereum;
      const permissionsArray = await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      let accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      var addr = accounts[0];
      var balance = await this.contract.balanceOf(addr);
      console.log(balance);


      this.setState({
        accounts,
        userAddress  : addr,
        userAmount : balance.toString()
      })

      // console.log(permissionsArray);

    } catch (err) {
      console.error(err)
      this.setState({
        permissionsResult : `Error: ${err.message}`
      })
    }
  }

  render() {

    const classes = classNames(
      'site-header',
      this.props.bottomOuterDivider && 'has-bottom-divider',
      this.props.className
    );

    return (
      <header
        {...this.props}
        className={classes}
      >
        <div className="container">
          <div className={
            classNames(
              'site-header-inner',
              this.props.bottomDivider && 'has-bottom-divider'
            )}>
            <Logo />
            {!this.props.hideNav &&
              <>

                
                <nav
                  className={
                    classNames(
                      'header-nav',
                      this.state.isActive && 'is-active'
                    )}>
                  <div className="header-nav-inner">
                    <ul className={
                      classNames(
                        'list-reset text-xs',
                        this.props.navPosition && `header-nav-${this.props.navPosition}`
                      )}>
                      <li>
                        <Link>{this.state.userAddress}</Link>
                        <Link>{this.state.userAmount} NFT</Link>
                      </li>
                    </ul>

                    <div
                      className="button button-primary button-wide-mobile button-sm" 
                      onClick={this.requestPermissionsButton.bind(this)}>
                      <Image src={require("../../assets/images/metamask-logo-vector.svg")} alt="React Logo" width={30} />
                        Access Metamask
                    </div>
                    
                  </div>
                </nav>
              </>}
          </div>
        </div>
      </header>
    );
  }
}

// Header.propTypes = propTypes;
// Header.defaultProps = defaultProps;

// export default Header;
