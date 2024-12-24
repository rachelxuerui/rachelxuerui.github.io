import React, { useState } from 'react';
import '../App.css';
import { NavBar, Footer } from '../components/homepage-components.js';
import { Paragraph, ProjectIntro, ProjectSection, Cards, Solution } from '../components/project-page-components.js';



const TaxonomyMapping = ({ showNavBar = true }) => { // Accept showNavBar as a prop
    const links = [
        { path: '/', label: 'Work' },
        { path: '/resume.js', label: 'Resume' },
        { path: '/about.js', label: 'About' }
    ];



    return (
        <>
        {showNavBar && <NavBar links={links} activeLink="Work"/>}
        <div className = "project-page-wrapper">
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

            <Cards 
            header="MAIN USER FLOWS" 
            text={[["BULK MAPPING", "Users upload catalogs, and map products to an ExpertVoice product taxonomy using batch assignments."], 
                ["MAPPING", "Once most products have been assigned taxonomy with batch assignments, individually map the remaining products."],
                ["LEAFING", "When a child taxonomies have been added, go through and reassign each product to one of those new child taxonomies."],
                ["FIXING GENDER ERRORS", "Assign products to the correct gender trait and gendered taxonomy based on name and description."],
            ]} 
            />

            <ProjectSection
            label = "SOLUTION"
            text = "Improve upon and optimize for the main workflows."
            />

            <Solution
            header = "Dashboard"
            what = "A list of catalogs with unmapped products, unleafed products, and products with gender inconsistencies."
            why = "Because users prefer working within their own catalogs, this provides easy entry points into catalogs with problems that need to be addressed."
            image = "../assets/taxonomy/dashboard.png"
            />

            <Solution
            header = "Batch Command Side Panel"
            what = "A side panel for bulk assigning taxonomy to products with ML powered suggestions."
            why = "Improving upon batch commands by allowing users to scroll the products selected for confirmation, as well as by introducing ML suggestions."
            image = "../assets/taxonomy/batch.gif"
            />

            <Solution
            header = "Mapping Side Panel"
            what = "A side panel for individually assigning taxonomy to products with ML powered suggestions."
            why = "For any products in a catalog that were uncaught by batch commands."
            image = "../assets/taxonomy/mapping.gif"
            />

            <Solution
            header = "Refining Side Panel"
            what = "A side panel for refining the taxonomy of products assigned to taxonomies that now have new child nodes, and are therefore no longer a leaf node."
            why = "So every product can be assigned to the most specific leaf node, increasing product relevance."
            image = "../assets/taxonomy/leafing.gif"
            />

            <Footer/>


        
        </div>
        </>
    );
};

export default TaxonomyMapping;