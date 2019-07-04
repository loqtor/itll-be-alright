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

  toggleRecord = () => {
    const { isRecording } = this.state;

    if (!isRecording) {
      this.record();
    } else {
      this.save();
    }

    this.setState({
      isRecording: !isRecording,
    });
  }

  record = () => {
    console.log('Starting the recording.');
  }

  save = () => {
    console.log('Saving the recording.');
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