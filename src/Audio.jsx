import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from "react";

const RecordView = (props) => {
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [record, setRecord] = useState([]);

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
      }, 650);
    }

    return () => clearInterval(intervalId);
  }, [isActive, counter]);

  useEffect(() => {
    const record = JSON.parse(localStorage.getItem("record_" + props.record));
    if (record) {
      setRecord(record);
    }
  }, []);

  const {
    // status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: false,
    onStop: (blobUrl, blob) => {
      //   const audioElement = new Audio(record.src);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener("loadend", function () {
        const base64FileData = reader.result.toString();
        const mediaFile = {
          size: blob.size,
          type: blob.type,
          src: base64FileData,
        };
        localStorage.setItem(
          "record_" + props.record,
          JSON.stringify(mediaFile)
        );
      });
    },
  });
  // if (!mediaBlobUrl && record.size > 0) {
  //   const audioElement = new Audio(audio source);
  // }
  const playSound = () => {
    const audioElement = new Audio(record.src);
    audioElement.play();
  };

  return (
    <div>
      <div>
        {!mediaBlobUrl && record.size > 0 && (
          <div>
            <button
              style={{
                padding: "0.8rem 2rem",
                border: "none",
                marginLeft: "15px",
                fontSize: "1rem",
                cursor: "pointer",
                borderRadius: "5px",
                fontWeight: "bold",
                backgroundColor: "#42b72a",
                color: "white",
              }}
              onClick={() => {
                playSound();
              }}
            >
              play
            </button>
          </div>
        )}
        {/* {mediaBlobUrl && <div>test2</div>} */}
        {/* <audio className="cached audio" src={record.src} controls /> */}
        {/* {mediaBlobUrl && (
          <audio className="live audio" src={mediaBlobUrl} controls />
        )} */}
      </div>

      <div>
        <div>
          <span className="minute">{minute}</span>
          <span>:</span>
          <span className="second">{second}</span>
        </div>

        <div>
          <label
            style={{
              fontSize: "15px",
              fontWeight: "Normal",
            }}
            htmlFor="icon-button-file"
          >
            {!isActive && (
              <button
                style={{
                  padding: "0.8rem 2rem",
                  border: "none",
                  marginLeft: "15px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  backgroundColor: "#42b72a",
                  color: "white",
                }}
                onClick={() => {
                  startRecording();
                  setIsActive(!isActive);
                }}
              >
                Start
              </button>
            )}
            {isActive && (
              <button
                style={{
                  padding: "0.8rem 2rem",
                  border: "none",
                  backgroundColor: "#df3636",
                  marginLeft: "15px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  color: "white",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  pauseRecording();
                  stopRecording();
                  setIsActive(!isActive);
                }}
              >
                Stop
              </button>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
export default RecordView;
