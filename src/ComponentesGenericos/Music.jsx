import './Music.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/music.m4a';


const audio = new Audio(soundFile);

function Music(props) {

    const [isPlaying, setIsPLaying] = useState(false);

    function playSound() {

        if (!isPlaying) {
            audio.play();
            audio.addEventListener('ended', function () {
                audio.currentTime = 0;
                audio.play();
            });
            setIsPLaying(true);
        } else {
            audio.pause()
            audio.currentTime = 0;
            
            setIsPLaying(false);
        }


    }

    function onPress() {
        playSound();
    }

    return (
        <button onClick={() => { onPress() }} className='musicBtn'> {isPlaying?
            "🔊"
            :
            "🔈"
            } </button>
    );
}

export default Music;