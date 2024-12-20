import React from 'react';
import '../App.css';
import { NavBar } from '../components/homepage-components.js';
import { Paragraph, ProjectIntro, ProjectSection, Cards } from '../components/project-page-components.js';

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
            image = "../assets/taxonomy/splash.gif"
            description = "Identifying and designing for common user workflows for mapping taxonomies within product catalogs." 
            team = "Tooling"
            duration = "4 weeks"
            collaborators = "Sam Bowers (PM), Mike Kowdley (Tech Lead), Jon Smith (Director of Ecomm)"
            />

            <ProjectSection 
            label = "PROBLEM"
            text = "Commerce Operations Specialists struggle to efficiently assign taxonomy to products in new catalogs with existing tooling."
            />

            <Paragraph
            header = "STORE ADMIN"
            paragraphs = {["An internal tool where Commerce Operations Specialists upload product catalogs and assign taxonomy."]}
            />

            <Paragraph
            header = "CURRENT EXPERIENCE"
            images = {[["../assets/taxonomy/machine-learning.gif"]]}
            paragraphs = {["There is an app in Store Admin for Unmapped Products, a work queue of all unmapped products from all catalogs with machine learning suggestions."]}
            />

            <ProjectSection 
            label = "INSIGHT"
            text = "Commerce Operations Specialists are not using the Unmapped Products app."
            />

            <Paragraph
            header = "RESEARCH INSIGHTS"
            paragraphs = {[
                "Commerce Operations Specialists tend to work within their own brands and catalogs, leading to discomfort and uncertainty when working on products in catalogs they are unfamiliar with.",
                "The product cards in Unmapped Products lack the level of information they can get in Products."
            ]}
            />

            <Paragraph
            images = {[["../assets/taxonomy/products.png","Products App"],["../assets/taxonomy/unmapped.png",["Unmapped Products App"]]]}
            />

            <Paragraph
            paragraphs = {["When working in a catalog that was just uploaded, they prefer to use the batch command tool in the products app to quickly assign taxonomies along similar traits, then map any remaining products individually."]}
            />

            <ProjectSection
            label = "SOLUTION"
            text = "Improve and optimize for the main workflows."
            />

            <Cards 
            header="MAIN USER FLOWS" 
            text={[["BULK MAPPING", "Users upload catalogs, and map products to an ExpertVoice product taxonomy using batch assignments."], 
                ["MAPPING", "Once most products have been assigned taxonomy with batch assignments, individually map the remaining products."],
                ["LEAFING", "When a child taxonomies have been added, go through and reassign each product to one of those new child taxonomies."],
                ["FIXING GENDER ERRORS", "Assign products to the correct gender trait and gendered taxonomy based on name and description."],
            ]} 
            />

        
        </div>
        </>
    );
};

export default TaxonomyMapping;