var React = require('react');

/**
 * Displays secondary (lower priority) actions
 */
var ProductSecondaryActions = React.createClass({

  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render: function() {
    return (
      <div className="product-secondary-actions">
        <div className="row no-gutter">
          <div className="col-xs-4">
            <button className="btn btn-full">Add to Registry</button>
          </div>
          <div className="col-xs-4">
            <button className="btn btn-full">Add to List</button>
          </div>
          <div className="col-xs-4">
            <button className="btn btn-full">Share</button>
          </div>
        </div>
      </div>
    )
  }

});

module.exports = ProductSecondaryActions;
