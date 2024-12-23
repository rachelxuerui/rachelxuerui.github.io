import '../App.css';
import React, { useState } from 'react';
import { NavBar, ProjectCard } from '../components/homepage-components.js';
import Modal from '../components/modal';
import TaxonomyMapping from './taxonomy-mapping.js';

function Home() {

  const links = [
    { path: '/', label: 'Work' },
    { path: '/resume', label: 'Resume' },
    { path: '/about', label: 'About' }
  ];

  // dealing with modal
  const [activeProject, setActiveProject] = useState(null);

  const isMobile = () => window.innerWidth <= 800; 

  const openModal = (project) => {
    if (!isMobile()) {
      setActiveProject(project);
    }
  };

  const closeModal = () => {
    setActiveProject(null);
  };

  const projects = [
    {
      link: 'taxonomy-mapping',
      company: "EXPERTVOICE",
      project: "Optimizing taxonomy mapping",
      description: "Identifying and designing for common user workflows for mapping taxonomies within product catalogs.",
      photo: "/assets/taxonomy.gif",
      component: <TaxonomyMapping showNavBar={false} />
    },
    {
      company: "EXPERTVOICE",
      project: "Search suggestions",
      description: "Understanding search intention and improving search suggestions.",
      photo: "../assets/search-suggest.png",
    },
    {
      company: "EXPERTVOICE",
      project: "Temporary products",
      description: "Supporting products not yet in catalog for product sampling campaigns.",
      photo: "../assets/temporary-products.gif",
    },
    {
      company: "EXPERTVOICE",
      project: "Eva",
      description: "An internship project - helping consumers make purchase decisions with an AI chatbot.",
      photo: "../assets/eva.jpg",
    },
    {
      company: "EXPERTVOICE",
      project: "Android navigation",
      description: "Another internship project - redesigning the main android navigation.",
      photo: "../assets/android.jpg",
    },
    {
      company: "INFINITE GOODS",
      project: "Eco-label",
      description: "Redesigning a metric for sustainable fashion.",
      photo: "../assets/eco-label.jpg",
    },
    {
      company: "ADVANCED WEB DESIGN STUDIO",
      project: "Preppie",
      description: "Designing and coding an AI interview preparation tool in Flask.",
      photo: "../assets/taxonomy.jpg",
    },
    {
      company: "INTRODUCTION TO DATA VISUALIZATION",
      project: "Engineering a Top hit",
      description: "Analyzing trends in the Spotify dataset in Flask, D3.js, and Chart.js.",
      photo: "../assets/taxonomy.jpg",
    },
  ];

  return (
    <>

    <NavBar links={links} activeLink='Work'/>

    <div className = "homepage-wrapper">
    <div className = "homepage-grid">

    <div className = "header-wrapper">
    <div className = "header">
      Rachel Xuerui Michelson 
    </div>
    <i><div className = "opaque">Associate Product Designer at ExpertVoice, Columbia University Alum, based in NYC.</div></i>
    {/* <div>I care about thoughtful and intentional design, using root cause analysis to create lasting solutions.</div> */}
    <div>Currently at ExpertVoice on the Tooling Team, designing interfaces to connect Brands with Experts, and optimizing internal tooling through design.</div>

    </div>

       
    {projects.map((project, index) => (
            <ProjectCard
              key={index}
              company={project.company}
              project={project.project}
              description={project.description}
              photo={project.photo}
              link={project.link}
              onClick={() => openModal(project)}
              mobile = {isMobile()}
            />
          ))}

    {activeProject && (
      <Modal onClose={closeModal} projectLink={activeProject.link}>
        {activeProject.component}
      </Modal>
    )}


    </div>
    </div>

    </>

  );
}

export default Home;
