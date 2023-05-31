import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import { Routes } from 'react-router';
import Juego from './Pantallas/juego';
import Inicio from './Pantallas/inicio';
import Registro from './Pantallas/registro';
import Temas from './Pantallas/temas';
import soundFile from './Sounds/music.m4a';
import Music from './ComponentesGenericos/Music';

const root = ReactDOM.createRoot(document.getElementById('root'));


function App() {

  return (
    <React.StrictMode>
      <Music/>
      <Router>
        <Routes>
          <Route exact path="/juego" element={<Juego/>} />
          <Route exact path="/" element={<Inicio/>} />
          <Route exact path="/registro" element={<Registro/>} />
          <Route exact path="/temas" element={<Temas/>} />
        </Routes>
      </Router>  
    </React.StrictMode>
  );
}

root.render(<App/>);

reportWebVitals();
