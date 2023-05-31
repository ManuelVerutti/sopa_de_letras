import "./VictoriaReporte.css";
import React from 'react';
import jsPDF from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import soundFile from '../Sounds/pop.mpeg';



function VictoriaReporte(props) {


    const navigate = useNavigate();

    const handleDownload = async () => {

        const fechaActual = new Date(Date.now());
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear();
        const hora = fechaActual.getHours().toString().padStart(2, '0');
        const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
        const fechaFormateada = `${dia}-${mes}-${anio}_${hora}-${minutos}`;
        const user = JSON.parse(localStorage.getItem("currentUser"));

        const doc = new jsPDF();
        
        doc.text(`Resumen Sopa de Letras ${dia}/${mes}/${anio} - ${hora}:${minutos}`, 10, 10);
        doc.text(`Usuario: ${user.nombre} Curso: ${user.curso} Organización: ${user.organizacion}`, 10, 20);
        doc.text("Subtema: " + props.tema, 10, 30);
        doc.text("Puntos: " + props.puntos, 10, 40);
        doc.text(`Tiempo: ${Math.floor(props.tiempo / 60) + ":" + (props.tiempo % 60)}`, 10, 50);
        doc.text(`Palabras:`, 10, 60);
        props.words.map((word, i) => (
            doc.text(`   - ${word}`, 10, 80 + i * 10)
        ));

        const pdfData = doc.output('datauristring');

        await Filesystem.writeFile({
            path: "Resultados_" + user.nombre +"_"+ props.tema + "_" + fechaFormateada + ".pdf",
            data: pdfData,
            directory: Directory.Documents
        })
        console.log(Directory.Documents);

        toast("Archivo guardado en Documentos", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

    };

    return (
        <div className='fondoRepo'>
            <div className='menu'>
                <h4>Felicidades has ganado</h4>
                <div>

                    <p>Tiempo: {Math.floor(props.tiempo / 60) + ":" + (props.tiempo % 60)}</p>
                    <p>Puntos: {props.puntos}</p>
                    <p>Lista de palabras: </p>
                    <div className='palabrasRepo'>
                        {props.words.map((word, i) => (
                            <p key={i}>{word}</p>
                        ))}
                    </div>
                </div>


                <button onClick={handleDownload}>Descargar Reporte</button>
                <button onClick={() => { navigate("/temas") }} >Volver al Menú</button>
            </div>

            <ToastContainer />
        </div>
    );
}

export default VictoriaReporte;