var React = require('react');

/**
 * [ProductQuantity description]
 * @type {[type]}
 */
var ProductQuantity = React.createClass({

  /**
   * Set initial state properties
   *
   * @return {Object} state initial props used throughout all other
   *                        child components
   */
  getInitialState: function() {
    return {
      quantity: 1,
      isMinQuantity: true
    }
  },

  /**
   * Determine if this is the minimum quantity allowed for product.
   * @return {Boolean} [description]
   */
  isMinQuantity: function(quantity){
    return (quantity === this.props.minQuantity)
  },

  /**
   * Determine if this is the maximum quantity allowed for product.
   *
   * @return {Boolean} isMaxQuantity
   */
  isMaxQuantity: function(quantity){
    return (quantity === this.props.maxQuantity)
  },

  /**
   * Increment and set State Quantity by 1
   */
  addQuantity: function() {
    let quantity = this.state.quantity + 1;
    this.setState({
      quantity: quantity,
      isMinQuantity: this.isMinQuantity(quantity),
      isMaxQuantity: this.isMaxQuantity(quantity)
    });
  },

  /**
   * Decrement and set State Quantity by 1
   */
  decQuantity: function() {
    let quantity = this.state.quantity - 1;

    this.setState({
      quantity: quantity,
      isMinQuantity: this.isMinQuantity(quantity),
      isMaxQuantity: this.isMaxQuantity(quantity)
    })

  },

  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render: function() {
    return (
      <div className="product-quantity">
        <div className="label">Quantity</div>
        <div className="controls">
          <button
          disabled={this.state.isMinQuantity}
          onClick={this.decQuantity}>
            &#8722;
          </button>
          <strong>{this.state.quantity}</strong>
          <button
          disabled={this.state.isMaxQuantity}
          onClick={this.addQuantity}>
            &#43;
          </button>
        </div>
      </div>
    )
  }
});

module.exports = ProductQuantity;
