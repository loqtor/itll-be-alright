import React, { Component, Fragment } from 'react';

interface IRecorderState {
  isRecording: boolean;
  hasRecorded: boolean;
}

export const Recorder = class Recorder extends Component<{}, IRecorderState> {
  state: IRecorderState = {
    isRecording: false,
    hasRecorded: false,
  }

  play = () => {
    console.log('play to be implemented');
  }

  toggleRecord = () => {
    const { isRecording } = this.state;

    this.setState({
      isRecording: !isRecording,
    });
  }

  render() {
    const { hasRecorded, isRecording } = this.state;
    const buttonLabel = isRecording ? 'Stop' : 'Record';

    return (
      <Fragment>
        <h2>Press the button to record your message.</h2>
        <button onClick={this.toggleRecord}>{buttonLabel}</button>
        {hasRecorded && <button onClick={this.play}>Play</button>}
      </Fragment>
    )
  }
}