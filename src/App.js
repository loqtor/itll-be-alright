import React from 'react';
import { Recorder } from './components/recorder';

function App() {
  if (!navigator.mediaDevices) {
    return (<div className="App">Sorry, this app is not supported by your browser or device.</div>);
  }

  return (
    <div className="App">
      <h1>Recorder Test</h1>
      <Recorder/>
    </div>
  );
}

export default App;
