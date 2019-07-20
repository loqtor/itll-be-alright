import React, { Component } from 'react';
import { Recognizer } from './components/recognizer';

const App = class App extends Component {
  state = {
    tags: [],
    recognizing: false,
    hasError: false,
    error: null,
  }

  toggleRecognition = () => {
    const { recognizing } = this.state;
    
    this.setState({
      recognizing: !recognizing,
      tags: [],
    });
  }

  onError = (error) => {
    this.setState({
      hasError:  true,
      error,
    });
  }

  render() {
    if (!navigator.mediaDevices) {
      return (<div className="App">Sorry, this app is not supported by your browser or device.</div>);
    }

    const { hasError } = this.state;

    if (hasError) {
      const { 
        error: {
          error, 
          message,
        },
      } = this.state;

      return <div className="App">There has been an error: {error}{message ? ` | ${message}` : null}.</div>
    }

    const { tags, recognizing } = this.state;
  
    return (
      <div className="App">
        <h1>Recorder Test</h1>
        <Recognizer
          showResults={tags.length > 0}
          startSpeechRecognition={recognizing}
          onError={this.onError}
        />
        <button onClick={this.toggleRecognition}>
          {recognizing ?  'Listening to tag...' : 'Start tagging!'}
        </button>
      </div>
    );
  }
}

export default App;
