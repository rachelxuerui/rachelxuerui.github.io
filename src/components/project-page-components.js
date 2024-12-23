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
        <img src = {props.image} alt = {props.alt}></img>
  
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

  function Paragraph(props) {
    const images = props.images || [];
    const paragraphs = props.paragraphs || [];

    return (
        <div className="paragraph">

            {props.header && <div className="opaque">{props.header}</div>}

            {paragraphs.length > 0 && paragraphs.map((paragraph, index) => (
                <div className="body" key={index}>{paragraph}</div>
            ))}

            {images.length > 0 && (
                <div className="images">
                    {images.map((imageData, index) => {
                        const [imageUrl, caption] = imageData; 
                        return (
                            <div className="image-with-text" key={index}>
                                <div>
                                    <img src={imageUrl} alt={`image-${index}`} />
                                </div>
                                {caption && <div className="opaque">{caption}</div>}
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

function Cards(props) {
 return (
  <div className = "cards-wrapper">
    <div className = "opaque">{props.header}</div>

    {props.text.length > 0 && (
      <div className = "cards">
          {props.text.map((cardData, index) => {
              const [header, text] = cardData;
              return (
                  <div className="card" key={index}>
                      <div className = "opaque">{header}</div>
                      {text}
                  </div>
              );
          })}
      </div>
  )}
</div>

 )
}

function Solution(props) {
  return (
    <div className="solution-wrapper">
      {props.isImageFirst ? (
        <>
          <div className="right"><img src={props.image} alt="solution" /></div>
          <div className="left">
            <div className="twenty-four">{props.header}</div>
            <div className="solution-text-wrapper">
              <div className="opaque">WHAT</div>
              {props.what}
            </div>
            <div className="solution-text-wrapper">
              <div className="opaque">WHY</div>
              {props.why}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="left">
            <div className="twenty-four">{props.header}</div>
            <div className="solution-text-wrapper">
              <div className="opaque">WHAT</div>
              {props.what}
            </div>
            <div className="solution-text-wrapper">
              <div className="opaque">WHY</div>
              {props.why}
            </div>
          </div>
          <div className="right"><img src={props.image} alt="solution" /></div>
        </>
      )}
    </div>
  );
}




export {ProjectIntro, ProjectOverview, ProjectSection, Paragraph, Cards, Solution}