import React, { useState } from "react";
import { useCountdownTimer } from "use-countdown-timer";

import { IoMic, IoPause } from "react-icons/io5";
import { useRecorder } from "./RecorderContext";

const recordingErrorMessages = {
  media_aborted: "Die Mikrofonaufnahme wurde unterbrochen.",
  permission_denied: "Kein Mikrofonzugriff. Bitte erlaube den Mikrofonzugriff in den Geräteeinstellungen.",
  no_specified_media_found: "Es wurde kein Mikrofon gefunden.",
  media_in_use: "Das Mikrofon wird bereits von einer anderen App verwendet.",
  invalid_media_constraints: "Das Mikrofon unterstützt die angeforderten Einstellungen nicht.",
  no_constraints: "Der Browser unterstützt die Audioaufnahme nicht.",
  recorder_error: "Die Aufnahme ist fehlgeschlagen. Bitte erneut versuchen.",
};

const RecordControls = ({ record, onStopped, recorder }) => {
  const timer = 3000;
  const [saveError, setSaveError] = useState("");

  const { countdown, start, pause } = useCountdownTimer({
    timer,
    onExpire: () => recorder.stopSlot(record),
  });

  const isActiveSlot = recorder.activeSlot === record;
  const status = isActiveSlot ? recorder.status : "idle";
  const recordingError =
    isActiveSlot &&
    recorder.error &&
    status !== "recording" &&
    status !== "stopped" &&
    (recordingErrorMessages[recorder.error] ??
      "Die Aufnahme ist fehlgeschlagen.");

  return (
    <div className="record">
      <div>
        <button
          className={"button button-" + status}
          onClick={() => {
            if (isActiveSlot && (status === "recording" || status === "paused")) {
              pause();
              recorder.stopSlot(record);
            } else if (recorder.activeSlot === null || isActiveSlot) {
              setSaveError("");
              recorder.startSlot(record, {
                onStart: start,
                onStopped,
                onSaveError: () =>
                  setSaveError(
                    "Aufnahme konnte nicht gespeichert werden. Prüfe den verfügbaren Gerätespeicher."
                  ),
              });
            } else {
              return;
            }
          }}
          disabled={
            (recorder.activeSlot !== null && !isActiveSlot) ||
            status === "acquiring_media" ||
            status === "stopped" ||
            status === "stopping"
          }
        >
          {isActiveSlot && status === "recording" ? <IoPause /> : <IoMic />}
        </button>
      </div>
      <div>{countdown / 1000}</div>
      {(recordingError || saveError) && (
        <p className="recording-error" role="alert">
          {recordingError || saveError}
        </p>
      )}
    </div>
  );
};

const Record = (props) => {
  const recorder = useRecorder();

  if (!recorder.supported) {
    return (
      <p className="recording-error" role="alert">
        Dieser Browser unterstützt keine Audioaufnahme.
      </p>
    );
  }

  return <RecordControls {...props} recorder={recorder} />;
};

export default Record;
