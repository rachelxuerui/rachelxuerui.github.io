import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
  
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
            className={`nav-item ${link.label === activeLink ? 'active' : 'opaque'}`}
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
      navigate(props.link)
      // if (props.mobile) {
      //   navigate(props.link);
      // } else {
      //   props.onClick();
      // }
    };
  
    return (
      <div className="project-card" onClick={handleClick}>
        <div className="project-photo"><img src = {props.photo} alt = "project"></img></div>
  
        <div className="project-card-text">
            <div className="twelve">{props.company}</div>
            <div className="eighteen">{props.project}</div>
          <div className="opaque">{props.description}</div>
        </div>
      </div>
    );
  }

  function Footer() {
    return (
      <div className = "footer">feet</div>
    )
  }

export {NavBar, ProjectCard, Footer};