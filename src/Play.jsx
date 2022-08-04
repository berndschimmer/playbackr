import React, { useState, useEffect } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <button className="button" onClick={toggle}>
        {playing ? <IoPause /> : <IoPlay />}
      </button>
    </div>
  );
};

export default Player;
