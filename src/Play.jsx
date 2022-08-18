import React, { useState, useEffect } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoTrashSharp } from "react-icons/io5";
import "./Delete.css";

const useAudio = (url, record) => {
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
// onclick function for delete props (record) from above
// localStorage.delete(record)?

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <div>
        <button className="button" onClick={toggle}>
          {playing ? <IoPause /> : <IoPlay />}
        </button>
      </div>
      <div className="delete">
        <IoTrashSharp />
      </div>
    </div>
  );
};

export default Player;
