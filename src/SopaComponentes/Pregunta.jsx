import "./Pregunta.css";
import React, { useEffect, useState } from "react";
import winSound from '../Sounds/gana.mp3';
import failSound from '../Sounds/pierde.mp3';



const audioWin = new Audio(winSound);
const audioFail = new Audio(failSound);


function Pregunta(props) {
    const [clase, setClase] = useState("");
    const [claseF, setClaseF] = useState("");
    const [answerSelected, setAnswerSelected] = useState(false);



    return (
        <div className="fondoPre">
            <div className="cuerpoPre">
                <h4>Cual es la definición de: {props.palabra}</h4>

                {props.posicionRespuestaCorrecta < 1 ? (
                    <div>
                        <p
                            className={clase}
                            onClick={() => {
                                if (!answerSelected) {
                                    setClase(clase === "" ? "correcta" : "");
                                    props.respuesta(true);
                                    setAnswerSelected(true);
                                    audioWin.play();

                                }
                            }}
                        >
                            {props.respCorrecta}
                        </p>
                        <p
                            className={claseF}
                            onClick={() => {
                                if (!answerSelected) {

                                    setClaseF(claseF === "" ? "falsa" : "");
                                    props.respuesta(false);
                                    setAnswerSelected(true);
                                    audioFail.play();

                                }
                            }}
                        >
                            {props.respFalsa}
                        </p>
                    </div>
                ) : (
                    <div>
                        <p
                            className={claseF}
                            onClick={() => {
                                if (!answerSelected) {

                                    setClaseF(claseF === "" ? "falsa" : "");
                                    props.respuesta(false);
                                    setAnswerSelected(true);
                                    audioFail.play();

                                }
                            }}
                        >
                            {props.respFalsa}
                        </p>
                        <p
                            className={clase}
                            onClick={() => {
                                if (!answerSelected) {

                                    setClase(clase === "" ? "correcta" : "");
                                    props.respuesta(true);
                                    setAnswerSelected(true);
                                    audioWin.play();


                                }
                            }}
                        >
                            {props.respCorrecta}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pregunta;