import './juego.css';
import React from 'react';
import WordSearch from '../SopaComponentes/sopa8dir';
import Header_Footer from '../ComponentesGenericos/Header_Footer';
import { useState, useEffect } from 'react';

function Juego() {

  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // mientras queden elementos sin mezclar
    while (currentIndex !== 0) {

      // elegir un elemento aleatorio
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // intercambiar el elemento actual con el aleatorio
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const [words, setWords] = useState(JSON.parse(localStorage.getItem("subtema")).palabras);
  const [significados, setSignificados] = useState(JSON.parse(localStorage.getItem("subtema")).definiciones);
  const [tema, setTema] = useState(JSON.parse(localStorage.getItem("subtema")).titulo);

  if (words.length > 8) {


    let tempArray = words.map((word, index) => {
      return { word: word, significado: significados[index] };
    });

    tempArray = shuffle(tempArray).slice(0, 8);

    let tempWords = tempArray.map(obj => obj.word);
    let tempSig = tempArray.map(obj => obj.significado);

    setWords(tempWords);
    setSignificados(tempSig);

  }

  return (
    <div className='nivel'>
      <Header_Footer />
      <div className="cuerpo">
        <WordSearch words={words} significados={significados} tema={tema} />
      </div>
    </div>
  );
}

export default Juego;