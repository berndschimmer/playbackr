import React, { useEffect, useState } from "react";
import Record from "./Record";
import Play from "./Play";
import "./Button.css";
import { deleteRecording, getRecording } from "./recordingsDb";

const RecordView = (props) => {
  const [record, setRecord] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let active = true;
    setLoadState("loading");
    setStorageError("");

    getRecording(props.record)
      .then((savedRecording) => {
        if (active) {
          setRecord(savedRecording ?? null);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (active) {
          setStorageError("Aufnahme konnte nicht aus dem lokalen Speicher geladen werden.");
          setLoadState("error");
        }
      });

    return () => {
      active = false;
    };
  }, [props.record, loadAttempt]);

  const changeHandler = (freshRecorded) => {
    setRecord(freshRecorded);
    setStorageError("");
  };
  const deleteHandler = async () => {
    try {
      await deleteRecording(props.record);
      setRecord(null);
      setStorageError("");
    } catch {
      setStorageError("Aufnahme konnte nicht gelöscht werden. Bitte erneut versuchen.");
    }
  };

  return (
    <div>
      {loadState === "loading" && <div>Wird geladen …</div>}
      {loadState === "error" && (
        <div>
          <p className="recording-error" role="alert">{storageError}</p>
          <button onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
            Erneut versuchen
          </button>
        </div>
      )}
      {loadState === "ready" && record && (
        <Play blob={record.blob} onDelete={deleteHandler} />
      )}
      {loadState === "ready" && !record && (
        <Record
          record={props.record}
          onStopped={changeHandler}
        />
      )}
      {loadState === "ready" && storageError && (
        <p className="recording-error" role="alert">{storageError}</p>
      )}
    </div>
  );
};
export default RecordView;
