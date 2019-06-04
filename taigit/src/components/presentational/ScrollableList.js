import React, { Component } from 'react'

export default class ScrollableList extends Component {
  render() {
    return(
      <div className="scroll-list">
        {this.props.items.map((item) => {
            return <div className="scroll-list-item" key={item}>
                    <div className="content">
                      <p>{item}</p>
                    </div>
                  </div>
          })}
      </div>
    );
  }
}