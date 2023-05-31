import React, { useState, useEffect } from 'react';
import Subtema from '../ComponentesGenericos/Subtema';
import Back from '../ComponentesGenericos/Back';
import './temas.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import soundFile from '../Sounds/pop.mpeg';




var temas = {
    bio: {},
    pT: {},
    cC: {}
};

fetch('Biodiversidad.json')
    .then(res => res.json())
    .then(data => {
        temas.bio = data.filter(obj => obj.PALABRAS !== "" && obj.DEFINICIONES !== "" && obj.DEFINICIONES !== "0" && obj.PALABRAS.length <= 14);

    })
    .catch(err => console.error(err));
fetch('CambioClimatico.json')
    .then(res => res.json())
    .then(data => {
        temas.cC = data.filter(obj => obj.PALABRAS !== "" && obj.DEFINICIONES !== "" && obj.DEFINICIONES !== "0" && obj.PALABRAS.length <= 14);

    })
    .catch(err => console.error(err));
fetch('Planificacion.json')
    .then(res => res.json())
    .then(data => {
        temas.pT = data.filter(obj => obj.PALABRAS !== "" && obj.DEFINICIONES !== "" && obj.DEFINICIONES !== "0" && obj.PALABRAS.length <= 14);
        console.log(temas.pT);
    })
    .catch(err => console.error(err));



function Temas() {

    function playSound() {
        const audio = new Audio(soundFile);
        audio.play();
    }

    const [subtemaOn, setSubtemaOn] = useState(false);
    const [temaSelec, setTemaSelec] = useState(1);
    const navigate = useNavigate();

    const handleDownload = async () => {
        playSound();
        // Buscar los datos del usuario seleccionado
        let storedProgreso = JSON.parse(localStorage.getItem("progreso"));
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!storedProgreso) {

            alert('No existen datos de partidas');
        } else {
            let datosUsuario;
            for (let i = 0; i < storedProgreso.length; i++) {
                if (storedProgreso[i].nombre === currentUser.nombre) {
                    datosUsuario = storedProgreso[i].datos;
                    break;
                }
            }
            if (!datosUsuario) {
                alert('No existen datos de partidas con este usuario');

            } else {
                // Crear un arreglo con los encabezados de la tabla
                let anteEncabezados = ["Nombre", "Apellidos", "Curso", "Organización", "Residencia" , "Teléfono" ];
                let datosAnteEncabezados = [currentUser.nombre,currentUser.apellidos,currentUser.curso, currentUser.organizacion, currentUser.municipio + ", " + currentUser.departamento, currentUser.telefono];
                let encabezados = ["Fecha", "Tema", "Puntos", "Tiempo", "Palabras"];
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

                // Crear un arreglo con los datos de la tabla
                let datosTabla = [];
                datosTabla.push(anteEncabezados);
                datosTabla.push(datosAnteEncabezados);
                datosTabla.push(encabezados);
                for (let i = 0; i < datosUsuario.length; i++) {
                    let fila = [];
                    fila.push(new Date(datosUsuario[i].fecha).toLocaleDateString('es-ES', options));
                    fila.push(datosUsuario[i].tema);
                    fila.push(datosUsuario[i].puntos);
                    fila.push(`Tiempo: ${Math.floor(datosUsuario[i].tiempo / 60) + ":" + (datosUsuario[i].tiempo % 60)}`);
                    fila.push(datosUsuario[i].palabras.join(', '));
                    datosTabla.push(fila);
                }

                // Crear una hoja de cálculo utilizando la biblioteca SheetJS
                let ws = XLSX.utils.aoa_to_sheet(datosTabla);
                let wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Datos de progreso");

                const dataToWrite = new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }));
                const dataToWriteBase64 = btoa(String.fromCharCode.apply(null, dataToWrite));

                const fileName = "Progreso_" + currentUser.nombre + ".xlsx";
                await Filesystem.writeFile({
                    path: fileName,
                    data: dataToWriteBase64,
                    directory: Directory.Documents,
                    encoding: Filesystem.Encoding.UTF8
                });

                XLSX.writeFile(wb, "Progreso_" + currentUser.nombre + ".xlsx");

                console.log(datosTabla);


                //PDF

                const doc = new jsPDF({
                    format: 'a3' // especifica el tamaño de página en A3
                });
                doc.setFontSize(8);

                let y = 20;

                for (let i = 0; i < datosTabla.length; i++) {
                    for (let j = 0; j < datosTabla[i].length; j++) {
                        const cell = datosTabla[i][j].toString();
                        if (cell.length > 35) {
                            doc.text(cell.substring(0, 30), j * 50, y + i * 10);
                            doc.text(cell.substring(30), j * 50, y + 5 + i * 10);
                        } else {
                            doc.text(cell, j * 50, y + i * 10);
                        }
                    }
                }

                const pdfData = doc.output('datauristring');

                await Filesystem.writeFile({
                    path: "Resultados_" + currentUser.nombre + ".pdf",
                    data: pdfData,
                    directory: Directory.Documents
                });


                // Guardar el archivo PDF
                doc.save('Progreso_' + currentUser.nombre + '.pdf');

                toast("Archivo guardado en Documentos", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }

    };

    function cerrarSub() {
        setSubtemaOn(false);
    }

    return (
        <div className='fondoTemas'>


            <Back destino="/" />

            {(subtemaOn && temaSelec == 1) &&
                <Subtema cerrarSub={cerrarSub} tema={temas.bio} />
            }
            {(subtemaOn && temaSelec == 2) &&
                <Subtema cerrarSub={cerrarSub} tema={temas.pT} />
            }
            {(subtemaOn && temaSelec == 3) &&
                <Subtema cerrarSub={cerrarSub} tema={temas.cC} />
            }

            <div className='cuerpoTemas'>
                <div className='headerTemas'>
                    <img src="Medios\logo-colibri-03.webp" alt="" />
                </div>
                <h3>Selecciona el tema</h3>
                <button className='btn' onClick={() => { playSound(); setSubtemaOn(true); setTemaSelec(1); }} >Biodiversidad</button>
                <button className='btn' onClick={() => { playSound(); setSubtemaOn(true); setTemaSelec(2); }} >Planificación territorial</button>
                <button className='btn' onClick={() => { playSound(); setSubtemaOn(true); setTemaSelec(3); }} >Cambio Climático</button>
                <button className='btn' onClick={handleDownload} >Descargar Reporte</button>

                <ToastContainer />

            </div>
        </div>
    );
}

export default Temas;