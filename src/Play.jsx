import React, { useState, useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoTrashSharp } from "react-icons/io5";
import "./Delete.css";

const useAudio = (blob) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying((current) => !current);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const onEnded = () => setPlaying(false);

    audioRef.current = audio;
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      URL.revokeObjectURL(url);
      audioRef.current = null;
    };
  }, [blob]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    playing ? audio.play() : audio.pause();
  }, [playing]);

  return [playing, toggle];
};

const Player = ({ blob, onDelete }) => {
  const [playing, toggle] = useAudio(blob);

  return (
    <div>
      <div>
        <button className="button" onClick={toggle}>
          {playing ? <IoPause /> : <IoPlay />}
        </button>
      </div>
      <div className="delete">
        <button className="delete" onClick={onDelete}>
          <IoTrashSharp />
        </button>
      </div>
    </div>
  );
};

export default Player;
