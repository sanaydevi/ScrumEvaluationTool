import React, { Component } from 'react'

export default class NumberDisplay extends Component {
  render() {
    return(
      <div className="number-display">
        <div className={this.props.notAvailable ? 'not-available': 'number-display-number'}>
          <span>{this.props.number}</span>
        </div>
        <div className="number-display-title">
          <h3>{this.props.statistic}</h3>
        </div>
      </div>
    );
  }
}