import React, { Component } from 'react';

/**
 * [ProductBuyActions description]
 * @type {[type]}
 */
export default class ProductBuyActions extends Component {


  /**
   * Determine wether or not hte product is available in store.
   * @return {Boolean}
   */

  constructor(props) {
    super(props);
  }


  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render() {

    return (
      <div className="product-buy-actions">
        <div className="row no-gutter">
            <div className="col-xs-12 col-sm-6">
              <button className="btn btn-secondary btn-lg btn-full">
                Pickup in Store
              </button>
            </div>
            <div className="col-xs-12 col-sm-6">
              <button className="btn btn-primary btn-lg btn-full">Add to Cart</button>
            </div>
        </div>
      </div>
    )
  }
};
