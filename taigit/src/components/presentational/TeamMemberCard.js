import React, { Component } from 'react'

export default class TeamMemberCard extends Component {
  render() {
    return(
      <div className="team-member-card">
        <div className="team-member-picture">
          <img alt='team member' src={this.props.pictureUrl}/>
        </div>
        <div className="team-member-info">
          <h3>{this.props.name}</h3>
          <p>GitHub Id: {this.props.githubId}</p>
          <p>Taiga Id: {this.props.taigaId}</p>
        </div>
      </div>
    );
  }
}