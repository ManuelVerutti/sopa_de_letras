import './Subtema.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/pop.mpeg';



function Subtema(props) {

  function playSound() {
    const audio = new Audio(soundFile);
    audio.play();
  }


  const titulos = [];

  // Recorrer el objeto y obtener los títulos
  for (let i = 0; i < props.tema.length; i++) {
    const titulo = props.tema[i].TITULO;
    if (!titulos.includes(titulo)) {
      titulos.push(titulo);
    }
  }
  const subtemas = [];

  for (let i = 0; i < titulos.length; i++) {
    const data = props.tema.filter(obj => obj.TITULO === titulos[i]);

    // Obtener un array con las palabras y un array con las definiciones
    const palabras = data.map(obj => obj.PALABRAS);
    const definiciones = data.map(obj => obj.DEFINICIONES);

    // Crear el objeto "subtema"
    const subtema = {
      titulo: titulos[i],
      palabras,
      definiciones,
    };

    subtemas.push(subtema);
  }

  let sub1 = { tiempo: "0", puntos: "0" }
  let sub2 = { tiempo: "0", puntos: "0" }
  try {
    sub1 = { tiempo: localStorage.getItem(props.tema.sub1.nombre).tiempo, puntos: localStorage.getItem(props.tema.sub1.nombre).puntos }
    sub2 = { tiempo: localStorage.getItem(props.tema.sub2.nombre).tiempo, puntos: localStorage.getItem(props.tema.sub2.nombre).puntos }
  } catch (error) {

  }

  const navigate = useNavigate();

  // Tiempo:{sub1.tiempo} Puntos:{sub1.puntos}
  //Tiempo:{sub2.tiempo} Puntos:{sub2.puntos}

  return (

    <div className='fondoSub'>
      <button onClick={() => { playSound(); props.cerrarSub() }} className='cierreSub'>x</button>
      <div className='botonesSub'>

        {subtemas.map((subtema, index) => (
          <button key={index} onClick={() => {
            playSound();
            localStorage.setItem("subtema", JSON.stringify(subtema));
            localStorage.setItem("primeraVez", true);
            navigate("/juego");
          }}>{subtema.titulo}</button>
        ))}

      </div>
    </div>
  );
}

export default Subtema;