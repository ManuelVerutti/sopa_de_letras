import React, { useState, useEffect } from 'react';
import "./sopadeletras.css"
import Pausa from '../ComponentesGenericos/Pausa';
import VictoriaReporte from './VictoriaReporte';
import Pregunta from './Pregunta';
import soundFile from '../Sounds/pop.mpeg';

function WordSearch(props) {

    const [claseP, setClaseP] = useState("");
    const [words, setWords] = useState(props.words);
    const [significados, setSignificados] = useState(props.significados);
    const [grid, setGrid] = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [iniSelec, setIniSelec] = useState({});
    const [finSelec, setFinSelec] = useState({});
    const [wordPosFinal, setWordPosFinal] = useState([]);
    const [enableSecondTouch, setEnableSecondTouch] = useState(false);
    const [tiempo, setTiempo] = useState(0);
    const [puntos, setPuntos] = useState(0);
    const [aciertos, setAciertos] = useState(0);
    const [paused, setPaused] = useState(false);
    const [victoria, setVictoria] = useState(false);
    const [enPregunta, setEnPregunta] = useState(false);
    const [palabraPreg, setPalabraPreg] = useState("");
    const [respCor, setRespCor] = useState("");
    const [respFal, setRespFal] = useState("");
    const [posicionRespuestaCorrecta, setPosicionRespuestaCorrecta] = useState(0);
    const wordSize = 18;


    function playSound() {
        const audio = new Audio(soundFile);
        audio.play();
    }
    
    useEffect(() => {
        setAciertos(0);
        setPuntos(0);
        setTiempo(0);
        setGrid(createGrid(words));
    }, [props.words])

    useEffect(() => {
        if (!paused) {
            if (aciertos < props.words.length || enPregunta) {

                if (localStorage.getItem("primeraVez") == "true") {
                    alert("Para resaltar las palabras, primero toca la primera letra y luego la última de cada palabra que deseas destacar.");
                    localStorage.setItem("primeraVez", false);
                }
                let tempTiempo = tiempo;
                const interval = setInterval(() => setTiempo(tempTiempo + 1), 1000);
                return () => {
                    clearInterval(interval);
                };
            } else {
                if (!victoria) {
                    setVictoria(true);

                    let storedProgreso = JSON.parse(localStorage.getItem("progreso"));
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

                    if (!storedProgreso) {
                        console.log("entra !Stored")
                        const progreso = [{
                            nombre: currentUser.nombre,
                            datos: [{ tema: props.tema, puntos: puntos, tiempo: tiempo, palabras: words, fecha: new Date(Date.now()) }]
                        }
                        ];
                        let tempStored = progreso;
                        localStorage.setItem("progreso", JSON.stringify(tempStored));

                    } else 
                    {

                        console.log("entra Stored")

                        let usuarioEncontrado = false;
                        for (let i = 0; i < storedProgreso.length; i++) {
                            if (storedProgreso[i].nombre === currentUser.nombre) {
                                storedProgreso[i].datos.push({
                                    tema: props.tema,
                                    puntos: puntos,
                                    tiempo: tiempo,
                                    palabras: words,
                                    fecha: new Date(Date.now())
                                });
                                usuarioEncontrado = true;
                                break;
                            }
                        }

                        if (!usuarioEncontrado) {
                            storedProgreso.push({
                                nombre: currentUser.nombre,
                                datos: [{
                                    tema: props.tema,
                                    puntos: puntos,
                                    tiempo: tiempo,
                                    palabras: words,
                                    fecha: new Date(Date.now())
                                }]
                            });
                        }

                        localStorage.setItem("progreso", JSON.stringify(storedProgreso));
                    }
                }

            }
        }
    })

    useEffect(() => {
        if (isSelected) {
            checkWord();
            console.log(wordPosFinal);
        }
        setIsSelected(false);
    }, [isSelected])

    const createGrid = (words) => {
        console.log(words);
        let grid = [];
        let wordPos = [];
        


        //create a grid with random letters
        for (let i = 0; i < wordSize; i++) {
            let row = []
            for (let j = 0; j < wordSize; j++) {
                row.push(randomLetter())
            }
            grid.push(row)
        }
        //place the words in the grid
        words.forEach((word, index) => {
            let placed = false
            let attempts = 0
            while (!placed && attempts < 1000) {
                let row = Math.floor(Math.random() * wordSize)
                let col = Math.floor(Math.random() * wordSize)
                let direction = Math.floor(Math.random() * 8)
                if (canPlaceWord(row, col, direction, word, grid, wordPos, index)) {
                    placeWord(row, col, direction, word, grid, index, wordPos)
                    placed = true
                }
                attempts++
            }
            if (!placed) {
                console.log(`Could not place word ${word}`)
            }
        })
        console.log(wordPos);
        setWordPosFinal(wordPos);
        return grid
    }

    const randomLetter = () => {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
    }

    function checkAnswer(correcta) {
        if (correcta) {

            let tempPuntos = puntos;
            setPuntos(tempPuntos + 1);
            setTimeout(() => {
                setEnPregunta(false);

                setClaseP(claseP === "" ? "aniP" : "");
                setTimeout(() => {
                    setClaseP(claseP === "aniP" ? "" : "");
                }, 1000);
            }, 1000);
        }
        else {
            setTimeout(() => {
                setEnPregunta(false);
            }, 1000);
        }


    }

    const canPlaceWord = (row, col, direction, word, grid, wordPos, index) => {
        //iterate over wordPos array
        let lettersPos = [word.length]

        if (direction === 0) {
            if (row - word.length < -1) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col, y: row - i, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 1) {
            if (col + word.length > wordSize) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col + i, y: row, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 2) {
            if (row + word.length > wordSize) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col, y: row + i, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 3) {
            if (col - word.length < -1) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col - i, y: row, d: direction }
                }
                if (index == 0) { return true }
            }
        } else if (direction === 4) {
            if (row - word.length < -1 || col - word.length < -1) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col - i, y: row - i, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 5) {
            if (row + word.length > wordSize || col - word.length < -1) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col - i, y: row + i, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 6) {
            if (row - word.length < -1 || col + word.length > wordSize) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col + i, y: row - i, d: direction }
                }
                if (index == 0) { return true }
            }

        } else if (direction === 7) {
            if (row + word.length > wordSize || col + word.length > wordSize) {
                return false
            } else {
                for (let i = 0; i < word.length; i++) {
                    lettersPos[i] = { x: col + i, y: row + i, d: direction }
                }
                if (index == 0) { return true }
            }
        }
        //Cruces
        if (index != 0) {

            let flatArray = [].concat(...wordPos);
            let crusada = false
            for (let i = 0; i < flatArray.length; i++) {
                for (let letter = 0; letter < lettersPos.length; letter++) {
                    if (flatArray[i].x === lettersPos[letter].x && flatArray[i].y === lettersPos[letter].y && word[letter] !== grid[flatArray[i].y][flatArray[i].x]) {
                        console.log("cruce rechaso letra distinta")
                        crusada = true;
                    } else if (flatArray[i].x === lettersPos[letter].x && flatArray[i].y === lettersPos[letter].y && word[letter] === grid[flatArray[i].y][flatArray[i].x] && flatArray[i].d == lettersPos[letter].d) {
                        console.log("cruce rechaso por dirección")
                        crusada = true;
                    } else if (flatArray[i].x === lettersPos[letter].x && flatArray[i].y === lettersPos[letter].y && word[letter] === grid[flatArray[i].y][flatArray[i].x] && flatArray[i].d !== lettersPos[letter].d) {
                        console.log("cruce aceptado")
                    }
                }
            }
            if (crusada) {
                return false;
            } else {
                console.log("Palabra colocada: " + word)
                return true;
            }
        } else {
            return true;
        }

    }

    const startSelect = (x, y) => {
        if (!enableSecondTouch) {
            console.log("tocó1")
            
            setIniSelec({ x: x, y: y });
            let casilla = document.getElementById(x + "," + y);
            casilla.classList.add('letraSelecting');
            setEnableSecondTouch(true);
        } else {
            console.log("tocó2")
            let casillaAnterior = document.getElementById(iniSelec.x + "," + iniSelec.y);
            casillaAnterior.classList.remove('letraSelecting');
            setFinSelec({ x: x, y: y });
            let casilla = document.getElementById(x + "," + y);
            casilla.classList.add('letraSelecting');
            setIsSelected(true);
            setEnableSecondTouch(false);
        }
    }

    function checkWord() {

        let wordPosState = wordPosFinal
        for (let i = 0; i < wordPosFinal.length; i++) {
            if (wordPosFinal[i][0].x == iniSelec.x && wordPosFinal[i][0].y == iniSelec.y && wordPosFinal[i][wordPosFinal[i].length - 1].x == finSelec.x && wordPosFinal[i][wordPosFinal[i].length - 1].y == finSelec.y) {
                console.log("Encontrada la palabra: " + words[i])
                for (let j = 0; j < wordPosFinal[i].length; j++) {
                    let casilla = document.getElementById(wordPosFinal[i][j].x + "," + wordPosFinal[i][j].y);
                    wordPosState[i][j].encontrada = true
                    casilla.classList.remove('letra');
                    casilla.classList.add('letraSelected');
                }
                let tempAciertos = aciertos
                setAciertos(tempAciertos + 1);
                console.log(aciertos);
                let tempPuntos = puntos;
                setPuntos(tempPuntos + 1);
                let palabra = document.getElementById("p" + i);
                palabra.classList.add('pSelected');
                setPosicionRespuestaCorrecta(Math.random() * 2);
                setEnPregunta(true);
                setPalabraPreg(words[i]);
                let indiceAleatorio = Math.floor(Math.random() * significados.length);
                if (indiceAleatorio == i) {
                    if(indiceAleatorio >= significados.length - 1){

                        indiceAleatorio = indiceAleatorio - 1;
                    }else{
                        indiceAleatorio = indiceAleatorio + 1;
                    }
                }
                setRespCor(significados[i]);
                setRespFal(significados[indiceAleatorio]);
            } else {
                setIniSelec(finSelec);
                setEnableSecondTouch(true);
            }
        }
        setWordPosFinal(wordPosState);

    }
    const placeWord = (row, col, direction, word, grid, index, wordPos) => {
        let lettersPos = []
        for (let i = 0; i < word.length; i++) {
            if (direction === 0) {
                grid[row - i][col] = word[i]
                lettersPos[i] = { x: col, y: row - i, d: direction, encontrada: false }
            } else if (direction === 1) {
                grid[row][col + i] = word[i]
                lettersPos[i] = { x: col + i, y: row, d: direction, encontrada: false }
            } else if (direction === 2) {
                grid[row + i][col] = word[i]
                lettersPos[i] = { x: col, y: row + i, d: direction, encontrada: false }
            } else if (direction === 3) {
                grid[row][col - i] = word[i]
                lettersPos[i] = { x: col - i, y: row, d: direction, encontrada: false }
            } else if (direction === 4) {
                grid[row - i][col - i] = word[i]
                lettersPos[i] = { x: col - i, y: row - i, d: direction, encontrada: false }
            } else if (direction === 5) {
                grid[row + i][col - i] = word[i]
                lettersPos[i] = { x: col - i, y: row + i, d: direction, encontrada: false }
            } else if (direction === 6) {
                grid[row - i][col + i] = word[i]
                lettersPos[i] = { x: col + i, y: row - i, d: direction, encontrada: false }
            } else if (direction === 7) {
                grid[row + i][col + i] = word[i]
                lettersPos[i] = { x: col + i, y: row + i, d: direction, encontrada: false }
            }
        }
        wordPos[index] = lettersPos
    }
    //onMouseDown={() => startSelect(j,i)} id={j+","+i} onMouseUp={() => endSelect(j,i)}
    function handlePause() {
        setPaused(false);
    }

    return (
        <div>
            {paused &&
                <Pausa modificarPausa={handlePause} />
            }
            {victoria &&
                <VictoriaReporte tiempo={tiempo} words={words} puntos={puntos} tema={props.tema} />
            }
            {enPregunta &&
                <Pregunta posicionRespuestaCorrecta={posicionRespuestaCorrecta} palabra={palabraPreg} respCorrecta={respCor} respFalsa={respFal} respuesta={checkAnswer} />
            }

            <p className='titulo'>{props.tema}</p>
            <div className='estadisticas'>
                <div>
                    <img onTouchEnd={() => { playSound(); setPaused(true) }} className='pauseIcon' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAYFBMVEX///8AAAAwMDDg4OAYGBjw8PDc3Nzl5eVra2v6+vokJCSnp6fW1taKiopLS0vp6enAwMDv7+8QEBC+vr4fHx9PT09wcHCpqallZWWBgYGfn59YWFgrKyv29vYjIyNOTk5bYkiNAAACt0lEQVR4nO2dyXIUQQwFrcF4GcCYxWwe4P//kisRvVZVT4SUkXnuw6TD9htVq6SbGxERERERERERERERERERERERERERAo/3K7Q9/rH7Q7w+Dhhs8SZW+DR5/G7l6dvuD3G+zPwwj2LN8Pbt5PE1w1P3hzjF5/cjEqskMYx4HrFYI41hvBvRWCGPYXwY8VgmkWE8jIgskskwnn6PqCyQyjCukRq5DK+RGskMr5Aa6Qzj14jODPkMj06NhIbxbURoQkbDY1MjpWGc+yuxCTkNI45LjayG8WXE6n/SGh5Wa+Q1PCo1EhseVGtkNoynI06oUhvG1wNSI7fhEamR3XC81khvOJwa+Q1HU6OA4WBqVDCMl5HUKGE4lBo1DEdSo4phf2qUMexOjTqG8RNv2HlCVcmwr9YoZdh1QlXLsCc1qhm2n1CVM2xOjXqGrbVGQcPGWqOiYdt7jZKGcWpIjZqGLalR1XB/rVHWML7jDfemRmHD+IE3jJc9qVHacFdq1DbckxrVDbdTo7zhZq1R33DrhApguFFrEAzXUwNhGOfpzRCYYcQd3nA5NTCGi523HMOlWgNkGA+zh/4kw/kTKpRhXGZqDZZh/Jn+orIMLzPJjzLE/x3i/5fi8xD/nQb/vZReW+Drw1d6jY8/p8GfteHPS/Fn3sspwTA8raQEwhD//hD/Dhj/Hh/fi4Hvp6H3ROH72po62isa4vtL8T3C+D5vfK8+/b4F/s4M/t4T/u5a5631Oob4O6T4e8D0u9z4+/j4mQpjM/gKGOJnm+Dn0+BnDNHnROFnff2lz2vDz9zDz03Ez77Ezy+lz6Cd62buJaUhfhY0fp43fiY7fq4+fTcCfr8FfkcJfs8MflcQft8TfmcXfe8afXcef/8hf4flVUmxh1REREREREREREREREREREREREREpJF/C1JHvBLhekcAAAAASUVORK5CYII=" alt="" />
                </div>
                <p>{Math.floor(tiempo / 60) + ":" + (tiempo % 60)}</p>
                <p>{aciertos + "/" + props.words.length}</p>
                <p className={claseP} id="puntos">Puntos: {puntos}</p>
            </div>
            <table className='sopa'>
                <tbody>
                    {grid.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td onTouchEnd={() => { playSound(); startSelect(j, i) }} id={j + "," + i} className='letra' key={j}>{cell}</td >
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='palabras'>
                {props.words.map((word, i) => (
                    <p id={"p" + i} key={i}>{word}</p>
                ))}
            </div>
        </div>
    );
}

export default WordSearch;