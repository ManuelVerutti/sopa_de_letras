import './Back.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/pop.mpeg';



function Back(props) {

    function playSound() {
        const audio = new Audio(soundFile);
        audio.play();
      }

    const navigate = useNavigate();

    function onPress () {
        playSound();
        navigate(props.destino);
    }

    return (
        <button onClick={()=>{onPress()}} className='backBtn'> {"<"} </button>
    );
}

export default Back;