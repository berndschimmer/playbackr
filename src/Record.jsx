import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

import { IoMic } from "react-icons/io5";

const Record = ({ record, onStopped }) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(computedSecond);
        setMinute(computedMinute);

        setCounter((counter) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: false,
    onStop: (blobUrl, blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener("loadend", function () {
        const base64FileData = reader.result.toString();
        const mediaFile = {
          size: blob.size,
          type: blob.type,
          src: base64FileData,
        };
        localStorage.setItem("record_" + record, JSON.stringify(mediaFile));
        onStopped(mediaFile);
      });
    },
  });
  return (
    <div className="record">
      <div>
        <button
          className={"button button-" + status}
          onClick={() => {
            if (!isActive) {
              startRecording();
            } else {
              pauseRecording();
              stopRecording();
              setSecond("00");
              setMinute("00");
            }
            setIsActive(!isActive);
          }}
        >
          <IoMic />
        </button>
      </div>
      <div>
        <span className="minute">{minute}</span>
        <span>:</span>
        <span className="second">{second}</span>
      </div>
    </div>
  );
};

export default Record;
