import React from 'react';
import CookiesCard from "../components/cookies";
import LandingPage from '../pages/Landing/LandingPage';

const Home = () => {
    return (
        <div >
            <LandingPage />
            <div >
                <CookiesCard />
            </div>
        </div>
    );
};

export default Home;
