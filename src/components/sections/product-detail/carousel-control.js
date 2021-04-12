import React, { Component } from 'react';

/**
 * Component that allows the user to interact with the carousel. Provides
 * Previous, Next Buttons as well as clickable thumbnails
 */
export default class CarouselControl extends Component {

  /**
   * Set initial state properties
   *
   * @return {Object} state initial props used throughout all other
   *                        child components
   */
  constructor(props) {
    super(props);
    this.state = {
      controlWidth: '',
      controlOffset: 0
    }
  }


  /**
   * Returns the width of the thumbnail
   *
   * TODO: The number is "hard-coded" this is because of time constraints.
   *       This function should return a dynamic value.
   *
   * @return {Number} width the width of the thumbnail
   */
  thumbWidth(){
      return 66;
  }


  /**
   * Invoked when a component is receiving new props.
   *
   * NOTE: This method is not called for the initial render.
   *
   * @param  {Object} newProps the new properties passed to the component
   */
  componentWillReceiveProps(newProps){
    let width = (newProps.totalSlides * this.thumbWidth());
    this.setState({
      controlWidth: width
    });
  }


  /**
   * Calculate the offset of the thumbnails based on active slide index.
   *
   * @param {Number} index index of the new active slide
   * @return {Number} offset the value to offset the UI controls (thumbnails) by.
   */
  getControlOffset(index) {
    let thumbWidth = this.thumbWidth();
    let offset = -(index * thumbWidth);
    let isSecondToFirst = (index === -1);
    let isSecondToLast = (index === this.props.totalSlides - 2);

    if (isSecondToFirst || isSecondToLast) {
      return false;
    }

    return offset;
  }


  /**
   * Checks to see if the index passed is the active (current) slide.
   * @param  {Number} index index of the active slide
   * @return {Boolean}
   */
  isActiveSlide(index){
    return index === this.props.currentSlide
  }


  /**
   * Add class to control thumbnail if conditions are met.
   *
   * @param  {Boolean} index index of the active slide
   * @return {String} className the class name to be used
   */
  className(index){
    if (this.isActiveSlide(index))
      return 'is-active'
  }


  /**
   * Go to the next slide
   */
  slideNext(){
    this.slideChange(this.props.currentSlide + 1);
  }


  /**
   * Go to the previous slide
   */
  slidePrev(){
    this.slideChange(this.props.currentSlide - 1);
  }


  /**
   * Invoked when the user triggers an action to change a slide.
   *
   * @param  {Number} index of the new active slide
   * @return {[type]}       [description]
   */
  slideChange(index){
    this.props.handleSlideChange(index);

    this.setState({
      controlOffset: this.getControlOffset(index - 1)
    });

  }


  /**
   * Renders the component
   * @return {String} HTML markup for the component
   */
  render() {

    let images = this.props.images;
    let firstClassName = this.props.isLeftDisabled ? 'is-first' : '';
    let lastClassName = this.props.isRightDisabled ? 'is-last' : '';

    let className = ['controls', firstClassName, lastClassName].join(' ')

    let style = {
          width: this.state.controlWidth,
          transform: `translateX(${this.state.controlOffset}px)`,
          WebkitTransition: 'transform .25s ease-in-out'
        }

    return(
      <div className="slide-control list-inline">
        <button
          className="btn btn-direction"
          disabled={this.props.isLeftDisabled}
          onClick={this.slidePrev}>
            &lsaquo;
        </button>
        <div className="controls-wrapper">
          <ul className={className} style={style}>
            {images.map(function(image, index) {
              return(
                <li key={'slide-' + index} className={this.className(index)}>
                  <a tabIndex="-1"
                    href="javascript:void(0)"
                    onClick={this.slideChange.bind(this, index)}>
                    <img
                      src={image.image} />
                  </a>
                </li>
              )
            }, this)}
          </ul>
        </div>
        <button
          className="btn btn-direction"
          disabled={this.props.isRightDisabled}
          onClick={this.slideNext.bind(this)}>
            &rsaquo;
        </button>
      </div>
    )
  }
}
