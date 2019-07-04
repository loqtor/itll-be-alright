import React, { Component, Fragment } from 'react';

interface IRecorderProps {}

interface IRecorderState {
  isRecording: boolean;
  audioAvailable: boolean;
  recorder: any; // TODO: Get types for this.
  audioUrl: string;
}

const DATA_AVAILABLE_INTERVAL = 500;

export const Recorder = class Recorder extends Component<IRecorderProps, IRecorderState> {
  isSettingMediaRecorder: boolean = false;
  audioFragments: any[] = [];

  constructor(props: IRecorderProps) {
    super(props);

    this.state = {
      isRecording: false,
      audioAvailable: false,
      recorder: null,
      audioUrl: '',
    };
  }

  toggleRecord = () => {
    const { isRecording } = this.state;

    if (!isRecording) {
      this.record();
    } else {
      this.save();
    }
  }

  record = async () => {
    const { recorder } = this.state;

    if (!recorder) {
      this.isSettingMediaRecorder = true;

      return navigator
        .mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          // @ts-ignore -- Check what's up with the types
          const mediaRecorder = new MediaRecorder(stream);

          mediaRecorder.ondataavailable = (e: any) => {
            this.audioFragments.push(e.data);
          }

          mediaRecorder.onstop = () => {
            const { audioFragments } = this;
            const audioBlob = new Blob(audioFragments, { 'type' : 'audio/ogg; codecs=opus' });
            const audioUrl = URL.createObjectURL(audioBlob);

            this.audioFragments = [];

            this.setState({
              isRecording: false,
              audioAvailable: true,
              audioUrl,
            });
          }

          this.setState({
            recorder: mediaRecorder,
            isRecording: true,
          }, () => {
            mediaRecorder.start(DATA_AVAILABLE_INTERVAL);
          });
        });
    }

    recorder.start();

    this.setState({
      isRecording: true,
    });
  }

  save = () => {
    const { recorder } = this.state;

    recorder.stop();
  }

  render() {
    const { audioAvailable, isRecording, audioUrl } = this.state;
    const buttonLabel = isRecording ? 'Stop' : 'Record';
    const showAudio = audioAvailable && !isRecording;

    return (
      <Fragment>
        <h2>Press the button to record your message.</h2>
        <button onClick={this.toggleRecord}>{buttonLabel}</button>
        {showAudio && (
          <audio controls src={audioUrl}></audio>
        )}
      </Fragment>
    )
  }
}