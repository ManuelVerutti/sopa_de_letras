import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './registro.css';
import Back from '../ComponentesGenericos/Back';
import soundFile from '../Sounds/pop.mpeg';


//Cambios hechos 

function Registro() {

  function playSound() {
    const audio = new Audio(soundFile);
    audio.play();
  }

  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [curso, setCurso] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const [departamentos, setDepartamentos] = useState([]);
  const [colombia, setColombia] = useState({});
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    fetch('colombia.json')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setColombia(data);
        setDepartamentos(data.map(item => item.departamento));
      })
      .catch(err => console.error(err));
  }, []);

  const handleDepartamentoChange = e => {
    setDepartamento(e.target.value);
    console.log(e.target.value);
    
    console.log(departamentos);

    const result = colombia.find(({ departamento }) => departamento === e.target.value);

    console.log(result)
    setCiudades(result.ciudades);
  };


  const handleMunicipioChange = e => {
    console.log("selec muni " + e.target.value)
    setMunicipio(e.target.value);
  };

  function registro() {

    console.log(nombre, apellidos, organizacion, telefono, curso, correo, "nuni " + municipio, "depto" + departamento)
    if (!nombre || nombre === "" || !apellidos || apellidos === "" || !telefono || telefono === "" || !municipio || municipio === "" || !departamento || departamento === "") {
      let camposFaltantes = [];
      if (!nombre || nombre === "") {
        camposFaltantes.push("Nombre");
      }
      if (!apellidos || apellidos === "") {
        camposFaltantes.push("Apellidos");
      }
      if (!telefono || telefono === "") {
        camposFaltantes.push("Teléfono");
      }
      if (!municipio || municipio === "") {
        camposFaltantes.push("Municipio");
      }
      if (!departamento || departamento === "") {
        camposFaltantes.push("Departamento");
      }
    
      alert("Faltan los siguientes campos por completar: " + camposFaltantes.join(", "));
    }
    
    else {
      if (terminosAceptados) {

        const storedData = JSON.parse(localStorage.getItem("userData"));

        const newUser = {
          nombre: nombre,
          apellidos: apellidos,
          organizacion: organizacion,
          curso: curso,
          telefono: telefono,
          correo: correo,
          municipio: municipio,
          departamento: departamento
        };


        if (!storedData) {
          let tempStored = [newUser];
          localStorage.setItem("userData", JSON.stringify(tempStored));

        } else {
          storedData.push(newUser);
          localStorage.setItem("userData", JSON.stringify(storedData));
        }

        navigate("/");

      } else {
        console.log("Confirme terminos y condiciones")
        
      alert('Debes aceptar los terminos y condiciones');
      }
    }
  }

  return (
    <div className='fondoRegistro'>
      <Back destino="/" />
      <div className='cuerpoRegistro'>
        <div className='headerRegistro'>
          <img src="Medios\icono.webp" alt="" />
        </div>
        <div className='registro'>
          <h3>Registro</h3>
          <div className='datos'>


            <div>
              <p>Nombre</p>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            <div>
              <p>Apellidos</p>
              <input type="text" value={apellidos} onChange={e => setApellidos(e.target.value)} />
            </div>

            <div>
              <p>Organización / Institución Educativa (opcional)</p>
              <input type="text" value={organizacion} onChange={e => setOrganizacion(e.target.value)} />
            </div>

            <div>
              <p>Curso (opcional)</p>
              <input type="number" value={curso} onChange={e => setCurso(e.target.value)} />
            </div>

            <div>
              <p>Telefono</p>
              <input type="number" value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>

            <div>
              <p>Correo electrónico (opcional)</p>
              <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
            </div>

            <div>
              <p>Departamento</p>
              <select value={departamento} onChange={handleDepartamentoChange}>
                
              <option>Selecciona un departamento</option>
                {departamentos.map(dep => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Municipio</p>
              <select value={municipio} onChange={handleMunicipioChange}>
                <option>Selecciona un municipio</option>
                {ciudades.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className='terminos'>
              <input className='checkBox' type="checkbox" checked={terminosAceptados} onChange={e => setTerminosAceptados(e.target.checked)} />
              <p className='pTerminos'>*Si he leído y presto mi consentimiento a los Términos de Uso del sitio y al procesamiento, al tratamiento y a la transferencia de mis datos personales conforme a lo dispuesto en las <a onClick={()=>{alert("Para leer los términos y condiciones asegúrate de tener conexión a internet");}} href="https://drive.google.com/file/d/16ex-Gn3wjXFArFAnuGWpcKWXAQRBmKfp/view?usp=sharing">Políticas de Privacidad y Terminos y Condiciones</a></p>
            </div>

            <button onTouchEnd={() => { playSound(); registro() }} >Registrarse</button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;