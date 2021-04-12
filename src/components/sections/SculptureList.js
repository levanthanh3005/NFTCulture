import React, { useState } from 'react';
import { Component } from 'react';

import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import Sculptures from "./Sculptures"

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

export default class ScruptureList extends Component {

  constructor(props) {
    super(props);
    this.state = {}
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

    this.state.tilesClasses = classNames(
      'tiles-wrap center-content',
      this.props.pushLeft && 'push-left'
    );
  }

  componentDidMount() {   
    if (!this.isMetaMaskConnected()) {
      this.onClickConnect();  
    }
  }


  isMetaMaskConnected(){ 
    return (this.state && this.state.accounts && this.state.accounts.length > 0)
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

  render() {
    return (
      <section
        className={this.state.outerClasses}
      >
        <div className="container">
          <div className={this.state.innerClasses}>
            <div className="hero-content">
              <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
                NFT CULTURE
              </h1>
            </div>
            
          <div className={this.state.innerClasses}>
            <div className={this.state.tilesClasses}>
              <Sculptures scrulpFrom={0} scrulpTo={10} />
            </div>
          </div>
          
          </div>
        </div>
      </section>
    )
  };
}

// Hero.propTypes = propTypes;
// Hero.defaultProps = defaultProps;

// export default Hero;