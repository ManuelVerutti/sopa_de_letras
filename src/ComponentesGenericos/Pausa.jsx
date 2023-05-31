import './Pausa.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/pop.mpeg';



function Pausa(props) {

    function playSound() {
        const audio = new Audio(soundFile);
        audio.play();
      }

    const navigate = useNavigate();
    return (
        <div className='fondo'>
            <div className='botones'>
                <button onClick={()=> {playSound(); props.modificarPausa()}}>Reanudar</button>
                <button onClick={()=> {playSound();window.location.reload(true)}} >Repetir</button>
                <button onClick={()=>{playSound(); navigate("/temas")}}>Volver al Menú</button>
            </div>
        </div>
    );
}

export default Pausa;