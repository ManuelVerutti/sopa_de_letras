import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/pop.mpeg';
import './Tutorial.css';

function Tutorial(props) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const handleButtonClick = () => {
    setVisible(false);
  };

  if (!visible) {
    return null; // No mostrar el componente si no es visible
  }

  return (
    <div className='fondoTuto'>
      <div className='card'>
        <video autoPlay loop>
          <source src="Medios\tuto.mp4" type='video/mp4' />
        </video>
        <p>
          Primero toca la primera letra y luego la última de cada palabra que deseas seleccionar.
        </p>
        <button onClick={handleButtonClick}>Cerrar</button>
      </div>
    </div>
  );
}

export default Tutorial;
