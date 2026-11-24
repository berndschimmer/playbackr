import React, { useState, useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoTrashSharp } from "react-icons/io5";
import "./Delete.css";

const useAudio = (blob) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState("");

  const describePlaybackError = (audio, error) => {
    if (error?.name === "NotAllowedError") {
      return "Der Browser hat die Wiedergabe blockiert. Bitte erneut versuchen.";
    }

    const mediaError = audio.error?.code;
    const type = blob.type || "unbekannter MIME-Typ";
    return `Aufnahme nicht abspielbar (${type}, ${blob.size} Bytes${
      mediaError ? `, Medienfehler ${mediaError}` : ""
    }).`;
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      setPlayError("");
      audio.play().catch((error) => {
        setPlaying(false);
        setPlayError(describePlaybackError(audio, error));
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
    const onError = () => {
      setPlaying(false);
      setPlayError(describePlaybackError(audio));
    };

    audioRef.current = audio;
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("error", onError);
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
