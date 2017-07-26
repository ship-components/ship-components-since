// External
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ms from 'ms';

/**
 * Displays a counter since a timestamp
 * @type    {React}
 */
export default class Since extends Component {

  /**
   * Setup
   * @param    {Object}    props
   */
  constructor(props) {
    super(props);
    this.loop = this.loop.bind(this);
  }

  /**
   * Start
   */
  componentDidMount() {
    this.loop();
  }

  /**
   * Performance check
   * @param    {Object}    nextProps
   * @return   {Boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.timestamp !== this.props.timestamp ||
           nextProps.className !== this.props.className;
  }

  /**
   * Cleanup
   */
  componentWillUnmount() {
    clearTimeout(this.updateId);
  }

  /**
   * Causes a forcedUpdate so view actually updates
   */
  loop() {
    // The meat and potatoes
    this.forceUpdate();

    // Loop
    this.updateId = setTimeout(this.loop, this.getInterval());
  }

  /**
   * Determine how frequently to update the component
   * @return    {[type]}
   */
  getInterval() {
    const diff = Math.abs(Date.now() - this.props.timestamp);

    // If the timestamp just happened update more frequently
    if (diff < 1000) {
      return 300;
    } else if (diff < 60000) {
      return 1000;
    }

    return 10000;
  }

  /**
   * Render
   * @return    {React}
   */
  render() {
    const {
      timestamp,
      className,
      showPrefix,
      showSuffix
    } = this.props;

    // Get the ms since the timestamp
    const diff = Math.abs(Date.now() - timestamp);

    // Determine if it is after or before now
    const inFuture = Date.now() < timestamp;

    return (
      <this.props.tag
        className={classNames(className)}
      >
        {inFuture && showPrefix ? 'in ' : ''}
        {diff < 1000 ? 0 : ms(diff)}
        {!inFuture && showSuffix ? ' ago' : ''}
      </this.props.tag>
    );
  }
}

/**
 * Defauts
 * @type    {Object}
 */
Since.defaultProps = {
  showPrefix: true,
  showSuffix: false,
  className: undefined,
  tag: 'span'
};

/**
 * Type Checks
 * @type    {Object}
 */
Since.propTypes = {
  showPrefix: PropTypes.bool,
  showSuffix: PropTypes.bool,
  timestamp: PropTypes.number.isRequired,
  className: PropTypes.string,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};
