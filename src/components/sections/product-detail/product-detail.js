var React = require('react');

/**
 * Component that displays additional product information (highlights)
 */
var ProductDetail = React.createClass({

  /**
   * Renders the component
   *
   * NOTE: By default, React escapes HTML to prevent XSS attacks. As a result,
   * we must use dangerouslySetInnerHTML to render the apropriate value.
   *
   * @return {String} HTML markup for the component
   */
  render: function() {

    let features = this.props.features;

    return (
      <div className="product-detail">
        <h3 className="title">Product Highlights</h3>
        <ul>
          {features.map(function(feature, index) {
            return <li
              key={'feature-' + index}
              dangerouslySetInnerHTML={{__html: feature}}>
            </li>;
          })}
        </ul>
      </div>
    )

  }
});

module.exports = ProductDetail;
