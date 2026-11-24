import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { saveRecording } from "./recordingsDb";

const RecorderContext = createContext(null);

const RecorderProviderContent = ({ children }) => {
  const [activeSlot, setActiveSlot] = useState(null);
  const callbacksRef = useRef(null);

  const handleStart = useCallback(() => {
    callbacksRef.current?.onStart();
  }, []);

  const handleStop = useCallback(async (_blobUrl, blob) => {
    const callbacks = callbacksRef.current;
    if (!callbacks) {
      return;
    }

    try {
      await saveRecording(callbacks.slot, blob);
      callbacks.onStopped({ blob, size: blob.size, type: blob.type });
    } catch {
      callbacks.onSaveError();
    } finally {
      callbacksRef.current = null;
      setActiveSlot(null);
    }
  }, []);

  const {
    error,
    status,
    startRecording,
    stopRecording,
    pauseRecording,
  } = useReactMediaRecorder({
    video: false,
    audio: { echoCancellation: false },
    // Keep the MIME type reported by MediaRecorder (for example audio/mp4 in Safari).
    blobPropertyBag: {},
    onStart: handleStart,
    onStop: handleStop,
  });

  const startSlot = useCallback(
    (slot, callbacks) => {
      if (activeSlot !== null && activeSlot !== slot) {
        return;
      }

      callbacksRef.current = { slot, ...callbacks };
      setActiveSlot(slot);
      startRecording();
    },
    [activeSlot, startRecording]
  );

  const stopSlot = useCallback(
    (slot) => {
      if (activeSlot !== slot) {
        return;
      }

      pauseRecording();
      stopRecording();
    },
    [activeSlot, pauseRecording, stopRecording]
  );

  return (
    <RecorderContext.Provider
      value={{
        supported: true,
        activeSlot,
        error,
        status,
        startSlot,
        stopSlot,
      }}
    >
      {children}
    </RecorderContext.Provider>
  );
};

export const RecorderProvider = ({ children }) => {
  const supported =
    typeof window !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

  if (!supported) {
    return (
      <RecorderContext.Provider value={{ supported: false }}>
        {children}
      </RecorderContext.Provider>
    );
  }

  return <RecorderProviderContent>{children}</RecorderProviderContent>;
};

export const useRecorder = () => {
  const recorder = useContext(RecorderContext);
  if (!recorder) {
    throw new Error("useRecorder must be used within a RecorderProvider");
  }

  return recorder;
};
