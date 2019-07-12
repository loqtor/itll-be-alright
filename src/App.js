import React, { Component } from 'react';
import { TagGenerator } from './components/recognizer';

const App = class App extends Component {
  state = {
    tags: [],
    recognizing: false,
  }

  toggleRecognition = () => {
    const { recognizing } = this.state;
    
    this.setState({
      recognizing: !recognizing,
      tags: [],
    });
  }

  render() {
    if (!navigator.mediaDevices) {
      return (<div className="App">Sorry, this app is not supported by your browser or device.</div>);
    }

    const { tags, recognizing } = this.state;
  
    return (
      <div className="App">
        <h1>Recorder Test</h1>
        <TagGenerator
          showResults={tags.length > 0}
          startSpeechRecognition={recognizing}
        />
        <button onClick={this.toggleRecognition}>
          {recognizing ?  'Listening to tag...' : 'Start tagging!'}
        </button>
      </div>
    );
  }
}

export default App;
