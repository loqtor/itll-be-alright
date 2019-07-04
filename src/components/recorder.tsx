import React, { Component } from 'react';

interface IRecorderState {
  isRecording: boolean;
}

export const Recorder = class Recorder extends Component<{}, IRecorderState> {
  render() {
    return (
      <p>This is the recorder component.</p>
    )
  }
}