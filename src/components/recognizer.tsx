import React, { Component, Fragment } from 'react';
import { extractTranscripts } from '../util/recognizer';

enum RecognizerStatus {
  INACTIVE = 0,
  RECOGNIZING = 1,
  STOPPED = 2,
}

interface IRecognizerProps {
  startSpeechRecognition?: boolean;
  grammars?: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;

  renderInactiveStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};
  renderRecognizingStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};
  renderStoppedStatus?: (props: IRecognizerProps, state: IRecognizerState) => {};

  formatResults?: (results: SpeechRecognitionResultList) => {};
  onResult?: (results: SpeechRecognitionResultList, formattedResults: any, transcripts: string[]) => {};
}

interface IRecognizerState {
  speechRecognizer: SpeechRecognition;
  status: RecognizerStatus;
  results: SpeechRecognitionResultList | null;
  formattedResults: any;
  transcripts: string[];
}

export const RECOGNIZER_DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en-NZ',
};

export const Recognizer = class Recognizer extends Component<IRecognizerProps, IRecognizerState> {
  constructor(props: IRecognizerProps) {
    super(props);

    const {
      startSpeechRecognition,
      grammars,
      continuous,
      interimResults,
      maxAlternatives,
      lang,
    } = props;

    // @ts-ignore -- For now...
    const speechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    // @ts-ignore -- For now...
    const speechGrammarListConstructor = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    const speechRecognizer = new speechRecognitionConstructor();
    
    if (grammars) {
      const speechGrammarList = new speechGrammarListConstructor();
      speechGrammarList.addFromString(grammars, 10000000);
      speechRecognizer.grammars = speechGrammarList;
    }

    speechRecognizer.continuous = continuous || RECOGNIZER_DEFAULT_CONFIG.continuous;
    speechRecognizer.interimResults = interimResults || RECOGNIZER_DEFAULT_CONFIG.interimResults;
    speechRecognizer.maxAlternatives = maxAlternatives || RECOGNIZER_DEFAULT_CONFIG.maxAlternatives;
    speechRecognizer.lang = lang || RECOGNIZER_DEFAULT_CONFIG;

    speechRecognizer.onresult = (e: SpeechRecognitionEvent) => { this.update(e) };
    
    this.state = {
      speechRecognizer,
      status: startSpeechRecognition ? RecognizerStatus.RECOGNIZING : RecognizerStatus.INACTIVE,
      results: null,
      formattedResults: null,
      transcripts: [],
    }
  }

  update = (e: SpeechRecognitionEvent) => {
    const { results } = e;
    const { formatResults, onResult } = this.props;
    const formattedResults = formatResults ? formatResults(results) : results;
    const transcripts = extractTranscripts(results);

    this.setState({
      results,
      formattedResults,
      transcripts,
    }, () => {
      if (!onResult) {
        return;
      }

      onResult(results, formattedResults, transcripts);
    });
  }

  renderInactiveStatus = () => {
    const { renderInactiveStatus } = this.props;

    if (renderInactiveStatus) {
      return renderInactiveStatus(this.props, this.state);
    }

    return (
      <h2>Awaiting to be enabled...</h2>
    )
  }

  renderRecognizingStatus = () => {
    const { renderRecognizingStatus } = this.props;

    if (renderRecognizingStatus) {
      return renderRecognizingStatus(this.props, this.state);
    }

    return (
      <h2>Recording tags...</h2>
    )
  }

  renderStoppedStatus = () => {
    const { renderStoppedStatus } = this.props;

    if (renderStoppedStatus) {
      return renderStoppedStatus(this.props, this.state);
    }

    const { transcripts } = this.state;

    if (!transcripts.length) {
      return (<h2>No transcripts found in speech.</h2>);
    }

    return (
      <Fragment>
        <h2>Transcripts from speech:</h2>
        <ul>
          {transcripts.map((transcript: string, i: number) => {
            return (
              <li key={`transcript-${i}`}>{transcript}</li>
            )
          })}
        </ul>
      </Fragment>
    )
  }

  componentDidUpdate() {
    const { startSpeechRecognition } = this.props;
    const { speechRecognizer, status } = this.state;

    if (startSpeechRecognition && status !== RecognizerStatus.RECOGNIZING) {
      speechRecognizer.start();

      this.setState({
        status: RecognizerStatus.RECOGNIZING,
      });

      return;
    }

    if (!startSpeechRecognition && status === RecognizerStatus.RECOGNIZING) {
      speechRecognizer.stop();

      this.setState({
        status: RecognizerStatus.STOPPED,
      });
    }
  }

  render() {
    const { status } = this.state;

    if (status === RecognizerStatus.INACTIVE) {
      return this.renderInactiveStatus();
    }

    if (status === RecognizerStatus.RECOGNIZING) {
      return this.renderRecognizingStatus();
    }

    return this.renderStoppedStatus();
  }
}