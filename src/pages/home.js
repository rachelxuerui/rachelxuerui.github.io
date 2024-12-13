import '../App.css';
import React from 'react';
import { NavBar, ProjectCard } from '../components/homepage-components.js';


function Home() {

  // DEALING WITH NAVBAR LINKS

  const links = [
    { path: '/', label: 'Work' },
    { path: '/resume', label: 'Resume' },
    { path: '/about', label: 'About' }
  ];

  return (
    <>

    <NavBar links={links} activeLink='Work'/>

    <div class = "homepage-wrapper">
    <div class = "homepage-grid">

    <div class = "header-wrapper">
    <div class = "header">
      Rachel Xuerui Michelson 
    </div>
    <i><div className = "opaque">Associate Product Designer at ExpertVoice, Columbia University Alum, based in NYC.</div></i>
    <div>I care about thoughtful and intentional design, using root cause analysis to create lasting solutions.</div>
    <div>I currently work at ExpertVoice on the Tooling Team, designing interfaces to connect Brands with Experts, and optimizing internal tooling through design.</div>

    </div>
        <ProjectCard link = "taxonomy-mapping" company = "EXPERTVOICE" project = "Optimizing taxonomy mapping" description = "Identifying and designing for common user workflows for mapping taxonomies within product catalogs." photo = "/assets/taxonomy.gif"/>
        <ProjectCard company = "EXPERTVOICE" project = "Search suggestions" description = "Understanding search intention and improving search suggestions." photo = "../assets/search-suggest.png"/>
        <ProjectCard company = "EXPERTVOICE" project = "360 Review" description = "Designing a summary table for Product Sampling Campaigns to avoid major issues at launch." photo = "../assets/360.gif"/>
        <ProjectCard company = "EXPERTVOICE" project = "Temporary products" description = "Supporting products not yet in catalog for product sampling campaigns." photo = "../assets/temporary-products.gif"/>
        <ProjectCard company = "EXPERTVOICE" project = "Eva" description = "An internship project - helping consumers make purchase decisions with an AI chatbot." photo = "../assets/eva.jpg"/>
        <ProjectCard company = "EXPERTVOICE" project = "Android navigation" description = "Another internship project - redesigning the main android navigation." photo = "../assets/android.jpg"/>
        <ProjectCard company = "INFINITE GOODS" project = "Eco-label" description = "Redesigning a metric for sustainable fashion." photo = "../assets/eco-label.jpg"/>
        <ProjectCard company = "ADVANCED WEB DESIGN STUDIO" project = "Preppie" description = "Designing and coding an AI interview preparation tool in Flask." photo = "../assets/taxonomy.jpg"/>
        <ProjectCard company = "INTRODUCTION TO DATA VISUALIZATION" project = "Engineering a Top hit" description = "Analyzing trends in the Spotify dataset in Flask, D3.js, and Chart.js." photo = "../assets/taxonomy.jpg"/>
    
    </div>
    </div>

    </>

  );
}

export default Home;
