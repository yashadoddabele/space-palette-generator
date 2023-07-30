import React from 'react';
import {useState} from 'react';
import './App.css';
import {motion} from 'framer-motion';
import axios from 'axios';

const abt = "space palette generator";

const About = () => {
    return (
        <motion.aside 
        initial={{ width: 300 }}
        animate={{ width: 600 }}
        transition={{duration: 0.7}}>
        <div className="about">
            <p> This app generates a color palette for<br/>any image/gif from the
            <a href="https://apod.nasa.gov/apod/astropix.html"> NASA APOD API</a>.<br/>
            The archive goes back to June 16, 1995, so <br/>any date after that can be palette-ified.<br/>
            Make sure to input in YYYY-MM-DD format!</p>
        </div>
        </motion.aside>
    );
}

const App = () => {
    //the user input date
    const [date, setDate] = useState("");
    //the nasa image
    const [url, setUrl] = useState('');
    //the palette
    const [result, setResult] = useState(null);
    //trigger about 
    const [showAbout, setShowAbout] = useState(false);
    const [aboutName, setAboutName] = useState("about");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (event) => {
         setDate(event.target.value);
     }
    
    const handleClick = () => {
        console.log(date);

        //fetch from backend
        axios.post('/generate', {input: date})
        .then(response => {
            setResult(response.data.palette);
            if (response.data.palette === "failed") {
                setErrorMessage("Sorry, please enter a valid date after June 16, 1995.");}
            setUrl(response.data.image);
        })
        .catch(error => {
            console.error('Error fetching:', error);
        });

    }

    const triggerAbout = () => {
        if (aboutName === "about") {
            setShowAbout(true);
            setAboutName("close");
        }
        else {
            setShowAbout(false);
            setAboutName("about");
        }
    }

    return (
        <motion.div className="app">
            <motion.div className="abtbutton">
                <motion.button 
                initial={{size: 0, opacity: 0}} 
                animate={{size: 1, opacity: 1}}
                transition={{delay: 0.5, duration: 2}}
                className="about" onClick={triggerAbout} whileHover={{scale: 1.1}}
                >{aboutName}
                </motion.button>
                {showAbout && <About />}
            </motion.div>
            <motion.h1 
                initial={{size: 0, opacity: 0}} 
                animate={{size: 1, opacity: 1}}
                transition={{delay: 0.5, duration: 2}}> {abt} </motion.h1>
            <motion.div className="container">
            <motion.div className="search"
                initial={{size: 0, opacity: 0}} 
                animate={{size: 1, opacity: 1}}
                transition={{delay: 2.2, duration: 1.3}}
            >
                <input placeholder="YYYY-MM-DD"
                onChange={handleChange}
                    />
                <motion.button onClick={handleClick} type="submit" 
                    whileHover={{scale: 1.1, boxShadow: "0px 0px 8px black"}}>
                    generate
                </motion.button>
                {errorMessage && <motion.div className="error">{errorMessage}</motion.div>}
                {result && !errorMessage && <motion.div className="result">
                    <p> your palette:</p>
                    <img src={`data:image/png;base64,${result}`} alt="palette" />
                    <p></p>
                    <p> based on this day's image:</p>
                    <img src={url} alt="img"></img>
                </motion.div>}
                {(result || errorMessage) && <motion.div className="reset">
                    <motion.button className="reset" onClick={ () => {
                    setDate("");
                    setResult(null);
                    setErrorMessage(null);
                    setUrl('');}} whileHover={{scale: 1.1}}
                    >reset</motion.button>
                    </motion.div>
                }
            </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default App;