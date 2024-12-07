import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function BodyText(props) {
    return <div class = "body">{props.text}</div>
  }
  
function NavBar({ links, activeLink }) {
    const navigate = useNavigate();
    const handleClick = (path) => {
      navigate(path);
    };
  
    return (
      <div className="nav-wrapper">
        {links.map((link) => (
          <div
            key={link.label}
            className={`nav-item ${link.label === activeLink ? 'active' : 'nav-link'}`}
            onClick={() => handleClick(link.path)}
          >
              {link.label}
          </div>
        ))}
      </div>
    );
  }
  
  
  function ProjectCard(props) {
  
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(props.link);
    };
  
  
    return (
      <div className="project-card" onClick={handleClick}>
        <div className="project-photo"><img src = {props.photo} alt = "project"></img></div>
  
        <div className="project-card-text">
            <div className="twelve">{props.company}</div>
            <div className="eighteen">{props.project}</div>
          <div className="project-description">{props.description}</div>
        </div>
      </div>
    );
  }

export {BodyText, NavBar, ProjectCard};