var React = require('react');

/**
 * Displays a stylized list containing product offers.
 */
var ProductOffers = React.createClass({

  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render: function() {
    let offers = this.props.promotions;
    return (
      <ul className="theme-offers product-offers">
        {offers.map(function(offer, index) {
          return (
            <li key={'offer-' + index}>
              {offer.Description[0].shortDescription}
            </li>
          );
        })}
      </ul>
    )
  }

});

module.exports = ProductOffers;
