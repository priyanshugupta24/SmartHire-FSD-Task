import React, { useState, useEffect } from 'react';
import "./TestPage.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function TestPage() {
    const history = useNavigate();
    let { id } = useParams();
    let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [fullscreen, setFullScreen] = useState(null);
    const startTime = Date.now();
    const endTime = startTime + 10 * 60 * 1000;
    const [minutes, setMinutes] = useState(((endTime - startTime) / 1000) / 60);
    const [seconds, setSeconds] = useState(((endTime - startTime) / 1000) % 60);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [questions, setQuestions] = useState([]);
    const [option1, setOption1] = useState([]);
    const [option2, setOption2] = useState([]);
    const [option3, setOption3] = useState([]);
    const [option4, setOption4] = useState([]);
    const [optedAns, setOptedAns] = useState({
        question1: [false, false, false, false],
        question2: [false, false, false, false],
        question3: [false, false, false, false],
        question4: [false, false, false, false],
        question5: [false, false, false, false],
        question6: [false, false, false, false],
        question7: [false, false, false, false],
        question8: [false, false, false, false],
        question9: [false, false, false, false],
        question10: [false, false, false, false]
    });
    const [colorCode, setColorCode] = useState([]);
    // blue,gray,gray,gray,gray,gray,gray,gray,gray,gray
    useEffect(() => {
        const getColorCode = () => {
            const color = localStorage.getItem("colourCode");
            console.log("This is ", color);
            let cQuestion = localStorage.getItem("currentQuestion");
            if (color === null || color === "null") {
                console.log("0")
                let colorCoding = [];
                for (let i = 0; i < 10; i++) {
                    colorCoding.push("gray");
                }
                colorCoding[currentQuestion - 1] = "blue";
                setColorCode(colorCoding);
                localStorage.setItem("colourCode", colorCoding);
            }
            else {
                let newColor = color.split(",");
                setColorCode(newColor);
            }
            if (cQuestion === null || cQuestion === "null") {
                localStorage.setItem("currentQuestion", currentQuestion);
            }
            else {
                setCurrentQuestion(parseInt(cQuestion));
            }
        }
        const getAns = async (optedAns, userId) => {
            try {
                const form = {
                    userId: userId,
                    optedAns: optedAns
                }
                const response = await axios.post("http://localhost:5126/api/getAns", form, {
                    headers: {
                        "Content-type": "application/json"
                    },
                    withCredentials: true,
                });
                console.log(id)
                setOptedAns(response.data.ans);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        const checkAnsStatus = async (optedAns, userId) => {
            try {
                const form = {
                    userId: userId,
                    optedAns: optedAns
                }
                const response = await axios.post("http://localhost:5126/api/checkAnsStatus", form, {
                    headers: {
                        "Content-type": "application/json"
                    },
                    withCredentials: true,
                });
                console.log("The Promise is : ",response.data.msg)
                if(response.data.msg === false){
                    toast('Reminder to Save Answers', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        var fetchQuestions = async () => {
            try {
                const response = await axios.get("http://localhost:5126/api/fetchQuestions");
                const fetchedQuestions = response.data;
                let questionList = []
                let option1List = []
                let option2List = []
                let option3List = []
                let option4List = []
                for (let i = 1; i <= Object.keys(fetchedQuestions).length; i++) {
                    const question = fetchedQuestions[`question${i}`]["question"]
                    const option1Current = fetchedQuestions[`question${i}`]["option1"]
                    const option2Current = fetchedQuestions[`question${i}`]["option2"]
                    const option3Current = fetchedQuestions[`question${i}`]["option3"]
                    const option4Current = fetchedQuestions[`question${i}`]["option4"]
                    questionList.push(question);
                    option1List.push(option1Current);
                    option2List.push(option2Current);
                    option3List.push(option3Current);
                    option4List.push(option4Current);
                }
                setQuestions(questionList);
                setOption1(option1List);
                setOption2(option2List);
                setOption3(option3List);
                // setOption1(option4 => [...option4,option4Current]);
                setOption4(option4List);
                console.log(questions, Object.keys(fetchedQuestions).length)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        var initialTimerPing = async (startTime, endTime, remainingTime, id) => {
            try {
                const form = {
                    startTime: startTime,
                    endTime: endTime,
                    remainingTime: remainingTime,
                    userId: id
                }
                const response = await axios.post("http://localhost:5126/api/initalTimer", form, {
                    headers: {
                        "Content-type": "application/json"
                    },
                    withCredentials: true,
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
        var checkTimerBackend = async (remainingTime, id) => {
            try {
                const form = {
                    remainingTime: remainingTime,
                    userId: id
                }
                const response = await axios.post("http://localhost:5126/api/testTimer", form, {
                    headers: {
                        "Content-type": "application/json"
                    },
                    withCredentials: true,
                });
                // console.log(response.data.msg);
                return response.data.msg;
            } catch (error) {
                console.error('Error:', error);
            }
        }
        const getTime = async(id) => {
            const currentTime = Date.now();
            const remainingTime = endTime - currentTime;
            if (remainingTime <= 0) {
                clearInterval(interval);
                console.log("Finshed");
                await endTest(optedAns, id)
                return;
            }
            if (parseInt((remainingTime / 1000)) % 120 === 0) {
                const timeStoredInLS = localStorage.getItem("remainingTime");
                if (Math.abs(parseInt(timeStoredInLS) - 2 * 60 * 1000 - remainingTime) >= 1500) {
                    console.log("Problem Hai", Math.abs(parseInt(timeStoredInLS) - 2 * 60 * 1000 - remainingTime))
                    endTest(optedAns, id)
                    return;
                }
                else {
                    // console.log(checkAnsStatus(optedAns, id),optedAns)
                    // checkAnsStatus(optedAns, id)
                    console.log("Sahi Hai 1")
                }
                localStorage.setItem('remainingTime', JSON.stringify(remainingTime));
            }
            if (parseInt((remainingTime / 1000)) % 120 === 0) {
                if (checkTimerBackend(remainingTime, id) === true) {
                    console.log("Problem Hai 2", checkTimerBackend(remainingTime, id))
                    endTest(optedAns, id)
                    return;
                }
                else {
                    console.log("Sahi Hai 2")
                }
            }
            const minutesNow = parseInt((remainingTime / 1000) / 60);
            const secondsNow = parseInt((remainingTime / 1000) % 60);
            setMinutes(minutesNow);
            setSeconds(secondsNow);
        }
        localStorage.setItem('remainingTime', JSON.stringify(endTime - Date.now()));
        const fake = () => {
            console.log("Fake")
            clearInterval(interval);
        }
        const fullScreen = localStorage.getItem("fullScreen");
        if (fullScreen === "true") setFullScreen(true);
        else setFullScreen(false);
        initialTimerPing(startTime, endTime, endTime - Date.now(), id);
        fetchQuestions();
        getAns(optedAns, id);
        getColorCode();
        const interval = setInterval(() => getTime(id), 1000);
        // const interval = setInterval(() => fake(), 1000);
        return () => clearInterval(interval);
    }, [])

    const requestFullscreen = () => {
        const targetEle = document.documentElement;
        if (targetEle.requestFullscreen) {
            targetEle.requestFullscreen();
        } else if (targetEle.webkitRequestFullscreen) {
            targetEle.webkitRequestFullscreen();
        } else if (targetEle.msRequestFullscreen) {
            targetEle.msRequestFullscreen();
        }
        localStorage.setItem('fullScreen', JSON.stringify(true));
        setFullScreen(true);
    };

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            setFullScreen(false);
            localStorage.setItem('fullScreen', JSON.stringify(false));
        }
    };
    const handleQuestionChange = (index) => {
        console.log(1, colorCode[currentQuestion - 1], currentQuestion)
        if (colorCode[currentQuestion - 1] === "yellow") colorCode[currentQuestion - 1] = "yellow";
        if (colorCode[index] === "yellow") colorCode[index] = "yellow";
        else colorCode[index] = "blue";
        const ans = optedAns[`question${currentQuestion}`];
        if (colorCode[currentQuestion - 1] !== "yellow") {
            if (ans[0] !== true && ans[1] !== true && ans[2] !== true && ans[3] !== true) {
                colorCode[currentQuestion - 1] = "red";
            }
            else colorCode[currentQuestion - 1] = "green";
        }
        setColorCode(colorCode);
        localStorage.setItem("colourCode", colorCode);
        setCurrentQuestion(index + 1);
        localStorage.setItem("currentQuestion", index + 1);
    }
    const handleOptionChange = (questionNum, optionIndex) => {
        setOptedAns((prevOptedAns) => {
            const newOptedAns = { ...prevOptedAns };
            newOptedAns[`question${questionNum}`][optionIndex] = !prevOptedAns[`question${questionNum}`][optionIndex];
            return newOptedAns;
        });
    };
    const mark = (currentQuestion) => {
        colorCode[currentQuestion - 1] = "yellow"
        setColorCode(colorCode);
        localStorage.setItem("colourCode", colorCode);
        if(currentQuestion+1 <11){
            colorCode[currentQuestion] = "blue";
            setCurrentQuestion(currentQuestion + 1);
            localStorage.setItem("currentQuestion", currentQuestion + 1);
        }
    }
    const prev = (currentQuestion) => {
        if (currentQuestion >= 2) {
            handleQuestionChange(currentQuestion - 2)
            setCurrentQuestion(currentQuestion - 1)
            localStorage.setItem("currentQuestion", currentQuestion - 1);
        }
    }
    const clearResponse = (questionNum) => {
        for (let optionIndex = 0; optionIndex < 4; optionIndex++) {
            setOptedAns((prevOptedAns) => {
                const newOptedAns = { ...prevOptedAns };
                newOptedAns[`question${questionNum}`][optionIndex] = false;
                return newOptedAns;
            });
        }
        saveAns(optedAns, id);
    }
    const endTest = (optedAns, id) => {
        saveAns(optedAns, id);
        localStorage.setItem("currentQuestion", null);
        localStorage.setItem("colourCode", null);
        history('/end-page');
    }
    const saveAns = async (optedAns, userId) => {
        try {
            const form = {
                userId: userId,
                optedAns: optedAns
            }
            const response = await axios.post("http://localhost:5126/api/saveAns", form, {
                headers: {
                    "Content-type": "application/json"
                },
                withCredentials: true,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const nextAndSave = async (currentQuestion) => {
        if (currentQuestion <= 9) {
            handleQuestionChange(currentQuestion)
            setCurrentQuestion(currentQuestion + 1)
            localStorage.setItem("currentQuestion", currentQuestion + 1);
        }
        saveAns(optedAns, id);
    }
    document.addEventListener('keydown', function (event) {
        // Check for Alt key and S key press
        event.preventDefault()
        if (event.altKey && event.key === 's') {
            saveAns(optedAns, id)
            console.log("ans saved")
            event.stopPropagation();
        }
        if (event.altKey && event.key === '1') {
            console.log(1)
            setCurrentQuestion(1);
            handleQuestionChange(0);
        }
        if (event.altKey && event.key === '9') {
            setCurrentQuestion(10);
            handleQuestionChange(9);
        }
    });
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return (
        <>
            {
                !fullscreen &&
                (<>
                    <button onClick={requestFullscreen}>Go Fullscreen</button>
                    <div>Your Test Timer is On.Please Return to Full Screen to Continue The Test..</div>
                </>)
            }
            {
                fullscreen &&
                (<>
                    <div>
                        <div className="container1">
                            <div className="question" style={{ whiteSpace: 'pre-wrap' }}>Question {currentQuestion}. <br />{questions[currentQuestion - 1]}</div>
                            <div className="container2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ height: "5vh" }}> <g> <path fill="none" d="M0 0h24v24H0z" /> <path d="M17.618 5.968l1.453-1.453 1.414 1.414-1.453 1.453a9 9 0 1 1-1.414-1.414zM11 8v6h2V8h-2zM8 1h8v2H8V1z" /> </g> </svg>
                                <div className="timer">{minutes}:{seconds}</div>
                            </div>
                        </div>
                        <hr />
                        <form>
                            <div className="container3">
                                <div className="options">
                                    <label htmlFor="option1">
                                        <input type="checkbox" className="radio" id="option1" value="1" checked={optedAns[`question${currentQuestion}`][0]} onChange={() => handleOptionChange(currentQuestion, 0)} />{option1[currentQuestion - 1]}
                                    </label><br />
                                    <label htmlFor="option2">
                                        <input type="checkbox" className="radio" id="option2" value="2" checked={optedAns[`question${currentQuestion}`][1]} onChange={() => handleOptionChange(currentQuestion, 1)} />{option2[currentQuestion - 1]}
                                    </label><br />
                                    <label htmlFor="option3">
                                        <input type="checkbox" className="radio" id="option3" value="3" checked={optedAns[`question${currentQuestion}`][2]} onChange={() => handleOptionChange(currentQuestion, 2)} />{option3[currentQuestion - 1]}
                                    </label><br />
                                    <label htmlFor="option4">
                                        <input type="checkbox" className="radio" id="option4" value="4" checked={optedAns[`question${currentQuestion}`][3]} onChange={() => handleOptionChange(currentQuestion, 3)} />{option4[currentQuestion - 1]}
                                    </label>

                                </div>
                                <div className="question-list">
                                    <ul className="question-list-ul">
                                        {list.map((item, index) => (
                                            <li key={index} className="question-no" style={{ backgroundColor: colorCode[index] }} onClick={() => handleQuestionChange(index)}>
                                                {/* Center question number using flexbox */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {item}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="container4">
                                <div className="prev" onClick={() => { prev(currentQuestion) }}>Previous Question</div>
                                <div className="mark" onClick={() => mark(currentQuestion)}>Mark For Review And Next</div>
                                <div className="clear-response" onClick={() => clearResponse(currentQuestion)}>Clear Response</div>
                                <div className="next" onClick={() => nextAndSave(currentQuestion)}>Save And Next</div>
                                <div className="end" onClick={() => endTest(optedAns, id)}>End Test</div>
                            </div>
                        </form>
                    </div>
                </>)
            }
            <ToastContainer />
        </>
    );
}

export default TestPage;
