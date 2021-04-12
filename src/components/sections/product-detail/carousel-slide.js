import React, { Component } from 'react';

/**
 * Carousel slide
 */
export default class CarouselSlide extends Component {


  /**
   * Checks to see if the index passed is the active (current) slide.
   * @param  {Number} index index of the active slide
   * @return {Boolean}
   */

  constructor(props) {
    super(props);
  }

  isActiveSlide(){
    return this.props.index === this.props.currentSlide
  }
  

  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render() {
    let activeClassName = (this.isActiveSlide() ? 'is-active' : null)
    return (
      <li className={activeClassName}>
        <img src={this.props.image} />
      </li>
    )

  }
}