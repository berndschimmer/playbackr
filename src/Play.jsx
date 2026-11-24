import React, { useState, useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoTrashSharp } from "react-icons/io5";
import "./Delete.css";

const useAudio = (blob) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState("");

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      setPlayError("");
      audio.play().catch((error) => {
        setPlaying(false);
        setPlayError(
          error.name === "NotAllowedError"
            ? "Der Browser hat die Wiedergabe blockiert. Bitte erneut versuchen."
            : "Die Aufnahme konnte nicht abgespielt werden."
        );
      });
      return;
    }

    audio.pause();
  };

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const onPlay = () => {
      setPlayError("");
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);

    audioRef.current = audio;
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.pause();
      URL.revokeObjectURL(url);
      audioRef.current = null;
    };
  }, [blob]);

  return [playing, toggle, playError];
};

const Player = ({ blob, onDelete }) => {
  const [playing, toggle, playError] = useAudio(blob);

  return (
    <div>
      <div>
        <button className="button" onClick={toggle}>
          {playing ? <IoPause /> : <IoPlay />}
        </button>
        {playError && (
          <p className="recording-error" role="alert">
            {playError}
          </p>
        )}
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
