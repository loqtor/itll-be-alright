import React from 'react';
import ReactDOM from 'react-dom';
import { Recognizer, RECOGNIZER_DEFAULT_CONFIG, RecognizerStatus } from './recognizer';

const WRAPPER_DIV = document.createElement('div');

test('Recognizer - test that the initial status is INACTIVE', () => {
  const recognizerRendered = ReactDOM.render(<Recognizer {...RECOGNIZER_DEFAULT_CONFIG }/>, WRAPPER_DIV);

  expect(recognizerRendered.state.status).toBe(RecognizerStatus.INACTIVE);
});

test('Recognizer - test that the status changes to RECOGNIZING when startSpeechRecognition = true', () => {
  const recognizerRendered = ReactDOM.render(<Recognizer {...RECOGNIZER_DEFAULT_CONFIG } startSpeechRecognition={true} />, WRAPPER_DIV);

  expect(recognizerRendered.state.status).toBe(RecognizerStatus.RECOGNIZING);
});

test('Recognizer - Status updates depending on `startSpeechRecognition`, initial state - `startSpeechRecognition`', () => {
  const recognizerRendered = ReactDOM.render(<Recognizer {...RECOGNIZER_DEFAULT_CONFIG } startSpeechRecognition={false} />, WRAPPER_DIV);

  expect(recognizerRendered.state.status).toBe(RecognizerStatus.STOPPED);
});