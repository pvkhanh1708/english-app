import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

const TypeContent = {
    char: 'char',
    word: 'word'
}

function getRandomSubstring(inputString, maxLength) {
    let result = '';
    for (let i = 0; i < maxLength; i++) {
        // Pick a random character from the input string
        let randomIndex = Math.floor(Math.random() * inputString.length);
        result += inputString[randomIndex];
    }

    return result;
}
function getRandomWord(words) {
    // Generate a random index from 0 to the length of the array minus 1
    const randomIndex = Math.floor(Math.random() * words.length);
    // Return the string at the random index
    return words[randomIndex];
}
function App() {
    const [getLocal, setGetLocal] = useState(false);
    const [content, setContent] = useState("");
    const [fontSize, setFontSize] = useState(100);
    const [type, setType] = useState(TypeContent.char);
    const [chars, setChars] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const [charsLength, setCharsLength] = useState(1);
    const [words, setWords] = useState([]);
    const [auto, setAuto] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [time, setTime] = useState(3);
    const [seconds, setSeconds] = useState(1);

    // Load state from localStorage on component mount
    useEffect(() => {
        const savedState = localStorage.getItem('appState');
        console.log('Init', savedState)
        if (savedState && !getLocal) {
            const state = JSON.parse(savedState);
            setFontSize(state.fontSize || 100);
            setType(state.type || TypeContent.char);
            setChars(state.chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            setCharsLength(state.charsLength || 1);
            setWords(state.words || []);
            setAuto(state.auto !== undefined ? state.auto : true);
            setTime(state.time || 3);
            setShowConfig(state.showConfig || false);
        }
        setGetLocal(true)
    }, []);

    // Save state to localStorage whenever relevant state changes
    useEffect(() => {
        if (getLocal) {
            const state = {
                fontSize,
                type,
                chars,
                charsLength,
                words,
                auto,
                time,
                showConfig
            };
            localStorage.setItem('appState', JSON.stringify(state));
        }
    }, [fontSize, type, chars, charsLength, words, auto, time, showConfig]);

    const updateContent = () => {
        if (!showConfig) {
            if (type === TypeContent.char) {
                setContent(getRandomSubstring(chars, charsLength))
            } else {
                setContent(getRandomWord(words))
            }
        }
    }

    useEffect(() => {
        if (seconds === 0) {
            if (auto) {
                updateContent()
            }
            setSeconds(time);
        }

        const timerId = setInterval(() => {
            setSeconds((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [seconds, auto, time]);

    const addWord = () => {
        setWords([...words, ""]);
    }

    const deleteWord = (index) => {
        let newWords = [...words];
        console.log(newWords)
        newWords.splice(index, 1);
        console.log(newWords)
        setWords(newWords);
    }

    const changeWord = (e, index) => {
        const newWords = [...words];
        newWords[index] = e.target.value;
        setWords(newWords);
    }
    return (
        <div className="app">
            <button className="btn-config" onClick={() => setShowConfig(!showConfig)}>
                <svg width={24} height={24} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
            </button>
            <div className="main" onClick={updateContent}>
                {auto === true && (
                    <span className="count">{seconds}</span>
                )}
                <span style={{fontSize: fontSize, fontWeight: 900, fontFamily: "Arial", letterSpacing: '0.5rem'}}>
                    {content}
                </span>
            </div>
            <div
                className={`modal ${showConfig ? 'active' : ''}`}
                onClick={updateContent}
            >
                <div style={{
                    position: "absolute",
                    top: 15,
                    right: 15
                }}
                onClick={() => setShowConfig(false)}
                >
                    <svg width={24} height={24} fill={'#667BC6'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                    </svg>
                </div>
                <h3>Cấu hình</h3>
                <div className="line">
                    <label>Loại:</label>
                    <button onClick={() => setType(TypeContent.char)}
                            className={`${type === TypeContent.char ? 'active' : ''}`}>Chữ
                    </button>
                    <button onClick={() => setType(TypeContent.word)}
                            className={`${type === TypeContent.word ? 'active' : ''}`}>Từ
                    </button>
                </div>
                <div className="line">
                    <label>Auto:</label>
                    <button onClick={() => setAuto(!auto)}>{auto ? "Có" : "Không"}</button>
                </div>
                <div className="line">
                    <label>Thời gian (s):</label>
                    <button onClick={() => setTime(time - 1 > 0 ? time - 1 : 1)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                        </svg>
                    </button>
                    {time}
                    <button onClick={() => setTime(time + 1)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </button>
                </div>
                <div className="line">
                    <label>Chữ:</label>
                    <input type="text" defaultValue={chars} onChange={(e) => setChars(e.target.value)}/>
                </div>
                <div className="line">
                    <label>Số chữ:</label>
                    <button onClick={() => setCharsLength(charsLength - 1 > 0 ? charsLength - 1 : 1)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                        </svg>
                    </button>
                    {charsLength}
                    <button onClick={() => setCharsLength(charsLength + 1)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </button>
                </div>
                <div className="line">
                    <label>Cỡ chữ:</label>
                    <button onClick={() => setFontSize(fontSize - 10 > 10 ? fontSize - 10 : 10)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                        </svg>
                    </button>
                    {fontSize}
                    <button onClick={() => setFontSize(fontSize + 10)}>
                        <svg width={20} height={20} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path
                                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                        </svg>
                    </button>
                </div>
                <div className="line">
                    <label>Từ:</label>
                    <div className="list">
                        {words.length > 0 && words.map((word, index) => {
                            return (
                                <div key={index} style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 10
                                }}>
                                    <input type="text" value={word}
                                           onChange={(e) => changeWord(e, index)}/>
                                    <svg onClick={() => deleteWord(index)} width={24} height={24} fill={'#667BC6'} xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 512 512">
                                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
                                    </svg>
                                </div>
                            )
                        })}
                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <button onClick={addWord}>
                                <svg width={24} height={24} fill={'#FDFFD2'} xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 448 512">
                                    <path
                                        d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
