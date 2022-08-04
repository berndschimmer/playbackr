import RecordView from "./Audio";
import "./App.css";

const App = () => {
  // const redordings = [1, 2, 3, 4, 5, 6];
  return (
    <div className="App">
      <RecordView key="1" record="1"></RecordView>
      <RecordView key="2" record="2"></RecordView>
      <RecordView key="3" record="3"></RecordView>
      <RecordView key="4" record="4"></RecordView>
      {/* {recordings.map((key, i) => {
        <RecordView key={key} record={"test" + i}></RecordView>;
      })} */}
    </div>
  );
};

export default App;
