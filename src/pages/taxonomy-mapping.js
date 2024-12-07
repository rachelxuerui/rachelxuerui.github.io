import React from 'react';
import '../App.css';
import { BodyText, NavBar } from '../components/homepage-components.js';
import { ProjectIntro, ProjectSection} from '../components/project-page-components.js';

const TaxonomyMapping = () => {

    const links = [
        { path: '/', label: 'Work' },
        { path: '/resume.js', label: 'Resume' },
        { path: '/about.js', label: 'About' }
      ];

    return (
        <>
        <NavBar links={links} activeLink='Work'/>
        <div class = "project-page-wrapper">
            <ProjectIntro 
            company = "EXPERTVOICE" 
            name = "Optimizing taxonomy mapping" 
            description = "Identifying and designing for common user workflows for mapping taxonomies within product catalogs." 
            team = "Tooling"
            duration = "4 weeks"
            collaborators = "Sam Bowers (PM), Mike Kowdley (Tech Lead), Jon Smith (Director of Ecomm)"
            />

            <ProjectSection 
            label = "PROBLEM"
            text = "Commerce Operations Specialists struggle to efficiently assign taxonomy to products in new catalogs with existing tooling."
            />
        </div>
        </>
    );
};

export default TaxonomyMapping;