import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import CTA from './CTA';


const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <Features></Features>
            <Testimonials></Testimonials>
            <CTA></CTA>
        </div>
    );
};

export default Home;