import React, { Component, Fragment } from 'react';

interface IRecorderProps {}

interface IRecorderState {
  isRecording: boolean;
  hasRecorded: boolean;
  speechRecognition: any; // TODO: Get types for this.
}

export const Recorder = class Recorder extends Component<IRecorderProps, IRecorderState> {
  constructor(props: IRecorderProps) {
    super(props);

    // @ts-ignore -- For now...
    const speechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition,

    this.state = {
      isRecording: false,
      hasRecorded: false,
      speechRecognition: speechRecognitionConstructor();
    }
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

  play = () => {
    console.log('Playing what was recorded.');
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