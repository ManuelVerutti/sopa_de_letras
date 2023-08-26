import './Music.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soundFile from '../Sounds/music.mp3';
import classNames from 'classnames';

const audio = new Audio(soundFile);

function Music(props) {
  const [isPlaying, setIsPlaying] = useState(false);

  function playSound() {
    if (!props.sound) {
      if (!isPlaying) {
        audio.play();
        audio.addEventListener('ended', function () {
          audio.currentTime = 0;
          audio.play();
        });
        setIsPlaying(true);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    } else {
      if (!isPlaying) {
        props.sound.play();
        props.sound.addEventListener('ended', function () {
          props.sound.currentTime = 0;
          props.sound.play();
        });
        setIsPlaying(true);
      } else {
        props.sound.pause();
        props.sound.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }

  function onPress() {
    playSound();
  }

  const musicBtnClasses = classNames('musicBtn', {
    active: isPlaying,
  });

  return (
    <img className={musicBtnClasses} onClick={onPress} src='Medios\sonido.webp'></img>
  );
}

export default Music;
