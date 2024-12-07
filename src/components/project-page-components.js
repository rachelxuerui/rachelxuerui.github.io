import React from 'react';
import '../App.css';

  function ProjectOverview(props) {
    return (
      <div className = "project-overview-wrapper">
        <div className = "project-overview-item">
          <div className = "opaque">TEAM</div>
          <div>{props.team}</div>
        </div>
        <div className = "project-overview-item">
          <div className = "opaque">ROLE</div>
          <div>{props.role}</div>
        </div>
        <div className = "project-overview-item">
          <div className = "opaque">DURATION</div>
          <div>{props.duration}</div>
        </div>
        <div className = "project-overview-item">
          <div className = "opaque">COLLABORATORS</div>
          <div>{props.collaborators}</div>
        </div>
      </div>
    )
  }
  
  
  function ProjectIntro(props) {
    return (
  
      <div className = "project-intro-wrapper">
  
        <div className = "project-page-heading">
            <div className = "opaque">{props.company}</div>
            <div className = "header">{props.name}</div>
            <div>{props.description}</div>
        </div>
        <ProjectOverview team = {props.team} role = 'Product Designer' duration = {props.duration} collaborators = {props.collaborators} />
        <div classname = "project-intro-photo"><img src = {props.image}></img></div>
  
      </div>
  
    )
  }
  
  function ProjectSection(props) {
    return (
  
      <div className = "project-section-wrapper">
  
        <div className = "opaque">{props.label}</div>
        <div className = "project-section-text">{props.text}</div>
  
      </div>
    )
  }

export {ProjectIntro, ProjectOverview, ProjectSection}