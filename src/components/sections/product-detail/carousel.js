import React, { Component } from 'react';

import CarouselSlide from './carousel-slide';
import CarouselControl from './carousel-control';

/**
 * [Carousel description]
 * @type {[type]}
 */
export default class Carousel extends Component {

  /**
   * Sets the initial state properties on the components
   *
   * @return Object state
   *  {Number} currentSlide     Index of the current active slide
   *  {Boolean} isLeftDisabled  true if the currentSlide is 0
   *  {Boolean} isRightDisabled true if the currentSlide is the same as the
   *                            total length of the slides
   */
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      isLeftDisabled: true,
      isRightDisabled: false
    }
  }


  /**
   * Invoked when the user triggers an action to change a slide. Sets states to
   * be passed to child components.
   *
   * @param  {Number} index of the new active slide
   */
  slideChange (newCurrentSlide){
    // console.log(this);
    let isLeftDisabled = (newCurrentSlide === 0)
    let isRightDisabled = (newCurrentSlide === this.props.images.length - 1)

    this.setState({
      isLeftDisabled: isLeftDisabled,
      isRightDisabled: isRightDisabled,
      currentSlide: newCurrentSlide
    })
  }

  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render() {

    let images = this.props.images;

    return (
      <div className="carousel">
        <ul className="slides list-unstyled">
          {images.map(function(image, index) {
            return(
                <CarouselSlide
                  key={'slide-' + index}
                  image={image.image}
                  index={index}
                  currentSlide={this.state.currentSlide}
                />
            )
          }, this)}
        </ul>

        <CarouselControl
          handleSlideChange={this.slideChange.bind(this)}
          images={images}
          totalSlides={this.props.images.length}
          currentSlide={this.state.currentSlide}
          isLeftDisabled={this.state.isLeftDisabled}
          isRightDisabled={this.state.isRightDisabled}
        />

      </div>

    )
  }
}