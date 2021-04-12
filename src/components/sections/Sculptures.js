// Ref: https://reactscript.com/small-react-treeview-component/
import React, { Component } from 'react';
import Image from '../elements/Image';


import { ethers } from 'ethers'
import { nftBytecode, nftAddress, nftAbi } from '../blockchain/NFT.json'

import BlockchainAPI from '../blockchain/BlockchainAPI'

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

export default class Sculptures extends BlockchainAPI {

	constructor(props) {
		super(props);
		this.state = {
			sculptures : [],
			scrulpFrom : this.props.scrulpFrom || 0,
			scrulpTo : this.props.scrulpTo || 5
		}
		console.log(this.state)
	}

	componentDidMount() {   
	    if (this.isMetaMaskInstalled()) {
			if (!this.isMetaMaskConnected()) {
				this.onClickConnect();
				this.initExistToken();
				// if (this.isMetaMaskConnected()) {
				this.loadData();
				// }
			}
		} else {

		}
	}

	async onClickConnect(e){
		this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any')

		const ethereum = window.ethereum;
		// console.log(this)
		try {
		  let accounts = await ethereum.request({
		    method: 'eth_requestAccounts',
		  })
		  this.setState({
		    accounts
		  })
		  // console.log(this)

		} catch (error) {
		  console.error(error)
		}
	}


	isMetaMaskConnected(){ 
		return (this.state && this.state.accounts && this.state.accounts.length > 0)
	}

	async initExistToken() {
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

	async loadData() {
		const result = await this.contract.getNFTList()
		// console.log(result);
		var index = 0;
		var lsRs = [];
		var self = this;
		var loop = function(index) {
			if (index >= result.length) {
				return;
			}
			self.loadEachData(result[index], async function(data){
				// lsRs.push(data);
				lsRs.push({
					key : data.fileHash,
					title: data.name
					})
				self.setState({
					sculptures : lsRs
				})
				await timeout(200);
				loop(index+1);	
			})
		}
		loop(0);
	}

	async loadEachData(fileHash, callback) {


		const result = await this.contract.getNFTInfor(
		  fileHash, {
		  gasPrice: '20000000000',
		})
		// console.log('result', result);


		var imgs = [
		  {
		   "image": this.serverPath+"/"+fileHash+".jpeg"
		  },
		  {
		   "image": this.serverPath+"/"+fileHash+".jpeg"
		  },
		  {
		   "image": this.serverPath+"/"+fileHash+".jpeg"
		  }
		];

		var information = (<>
		    <span>{"- Still bidding?:"+(result[1]==true ? "Yes, lets bidding" : "No, the bid has been stopped!")}</span><br/>
		    <span>{"- Deadline:"+new Date(parseInt(result[2].toString()) * 1000)}</span><br/>
		    <span>{"- Latest bidder:"+result[4]}</span><br/>
		  </>)
		var self = this;
		fetch(this.serverPath+"/content/"+fileHash)
		  .then(response => response.text())
		  .then(data => {
		    // console.log(data)
		    var jdata = JSON.parse(data);

		    var description = jdata.content.split("\n").map((value, index)=> {
		      return (<><span>{value}</span><br/></>)
		    })

		    callback({
		      name: jdata.title,
		      images: imgs,
		      price: parseInt(result[3].toString()),
		      isBidding: (result[1] == true),
		      description,
		      fileHash,
		      information
		    })
		    // console.log(self);
		  });
	}

	render() {
		// console.log(this.state);
		return (	
			<>
				{this.state.sculptures.map(sculpture =>
					<a href={"/sculpture/"+ sculpture.key }>
				        <div className="tiles-item" data-reveal-delay="200">
			              <div className="tiles-item-inner">
			                <div className="features-tiles-item-header">
			                  <div className="features-tiles-item-image mb-16">
			                    <Image
			                      src={this.serverPath+"/"+sculpture.key+".jpeg"}
			                      width={500}
			                      height={500} />
			                  </div>
			                </div>
			                <div className="features-tiles-item-content">
			                  <h4 className="mt-0 mb-8">
			                    {sculpture.title}
			                    </h4>
			                </div>
			              </div>
			            </div>
		            </a>
		            )
		        }
            </>
    	)
	}

	  //   loadData() {
  //   	var sculptures = [

		//     {
		//     	key : "1",
		//         title: "My first post",
		//         description: "This is my first post with more content inside",
		//         image: "1.jpeg"
		//     },
		//     {
		//     	key : "2",
		//         title: "My second post",
		//         description: "This is my second post with more content inside",
		//         image: "2.jpeg"
		//     },
		//     {
		//     	key : "3",
		//         title: "My third post",
		//         description: "This is my third post with more content inside",
		//         image: "3.jpeg"
		//     },
		//     {
		//     	key : "4",
		//         title: "My fourth post",
		//         description: "This is my fourth post with more content inside",
		//         image: "4.jpeg"
		//     },
		//     {
		//     	key : "5",
		//         title: "My fifth post",
		//         description: "This is my fifth post with more content inside",
		//         image: "5.jpeg"
		//     },
		//     {
		//     	key : "6",
		//         title: "My sixth post",
		//         description: "This is my sixth post with more content inside",
		//         image: "6.jpeg"
		//     },
		//     {
		//     	key : "7",
		//         title: "My second post",
		//         description: "This is my second post with more content inside",
		//         image: "2.jpeg"
		//     },
		//     {
		//     	key : "8",
		//         title: "My third post",
		//         description: "This is my third post with more content inside",
		//         image: "3.jpeg"
		//     },
		//     {
		//     	key : "9",
		//         title: "My fourth post",
		//         description: "This is my fourth post with more content inside",
		//         image: "4.jpeg"
		//     },
		//     {
		//     	key : "10",
		//         title: "My fifth post",
		//         description: "This is my fifth post with more content inside",
		//         image: "5.jpeg"
		//     },
		//     {
		//         title: "My fifth post",
		//         description: "This is my fifth post with more content inside",
		//         image: "5.jpeg"
		//     },
		//     {
		//     	key : "11",
		//         title: "My sixth post",
		//         description: "This is my sixth post with more content inside",
		//         image: "6.jpeg"
		//     },
		//     {
		//     	key : "12",
		//         title: "My second post",
		//         description: "This is my second post with more content inside",
		//         image: "2.jpeg"
		//     },
		//     {
		//     	key : "13",
		//         title: "My third post",
		//         description: "This is my third post with more content inside",
		//         image: "3.jpeg"
		//     },
		//     {
		//     	key : "14",
		//         title: "My fourth post",
		//         description: "This is my fourth post with more content inside",
		//         image: "4.jpeg"
		//     },
		//     {
		//     	key : "15",
		//         title: "My fifth post",
		//         description: "This is my fifth post with more content inside",
		//         image: "5.jpeg"
		//     }
		// ]
		// console.log(sculptures)
		// var maxNumOfScrulptures = sculptures.length;
		// var numOfPage = parseInt(maxNumOfScrulptures / 6) + (maxNumOfScrulptures % 6 > 0 ? 1 : 0)
		// this.setState({ 
		// 	maxNumOfScrulptures,
		// 	numOfPage,
		// 	sculptures : sculptures.slice(this.state.scrulpFrom, ( this.state.scrulpTo - this.state.scrulpFrom + 1))
		// });
		// console.log(this.state)
  //   }

}