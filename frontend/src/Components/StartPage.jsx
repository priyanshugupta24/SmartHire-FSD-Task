import React from 'react';
import { NavLink } from 'react-router-dom';
import "./StartPage.css"

function StartPage() {
    function generateRandomNumber() {
        return Math.floor(Math.random() * 100000) + 1;
    }      
    const fullscreen = () => {
        const targetEle = document.documentElement; // Fullscreen the entire document
        if (targetEle.requestFullscreen) {
            targetEle.requestFullscreen();
        } else if (targetEle.webkitRequestFullscreen) {
            targetEle.webkitRequestFullscreen();
        } else if (targetEle.msRequestFullscreen) {
            targetEle.msRequestFullscreen();
        }
        localStorage.setItem('fullScreen', JSON.stringify(true));
    }

    return (
        <div className="button-container">
            <NavLink to={`/testpage/${generateRandomNumber()}`} className="start-test" onClick={fullscreen}>Start Test</NavLink>
            <div>Tips : </div>
            <div>alt + s to Save the Current Question<br/>alt + 1 to jump to Question 1<br/> alt + 9 to jump to Last Question</div>
            <div></div>
            <div>Dont Exit FullScreen.</div>
        </div>
    );
}

export default StartPage;
