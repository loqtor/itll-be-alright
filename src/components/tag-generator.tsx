import React, { Component, Fragment } from 'react';
import { grammar as DEFAULT_GRAMMAR } from '../constants/grammar';

enum TagGeneratorStatus {
  INACTIVE = 0,
  RECOGNIZING = 1,
  STOPPED = 2,
}

interface ITagGeneratorProps {
  startSpeechRecognition?: boolean;
  grammars?: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;

  renderInactiveStatus?: (props: ITagGeneratorProps, state: ITagGeneratorState) => {};
  renderRecognizingStatus?: (props: ITagGeneratorProps, state: ITagGeneratorState) => {};
  renderStoppedStatus?: (props: ITagGeneratorProps, state: ITagGeneratorState) => {};

  formatResults: (results: SpeechRecognitionResultList) => {};
  onResult: (results: SpeechRecognitionResultList, formattedResults: any) => {};
}

interface ITagGeneratorState {
  speechRecognizer: any; // TODO: Get types for this.
  tags: string[];
  status: TagGeneratorStatus;
}

const DEFAULT_CONFIG = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  lang: 'en-NZ',
};

export const TagGenerator = class TagGenerator extends Component<ITagGeneratorProps, ITagGeneratorState> {
  constructor(props: ITagGeneratorProps) {
    super(props);

    const { 
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

    const speechGrammarList = new speechGrammarListConstructor();
    const speechRecognizer = new speechRecognitionConstructor();

    speechGrammarList.addFromString(grammars || DEFAULT_GRAMMAR, 10000000);

    speechRecognizer.grammars = speechGrammarList;
    speechRecognizer.continuous = continuous || DEFAULT_CONFIG.continuous;
    speechRecognizer.interimResults = interimResults || DEFAULT_CONFIG.interimResults;
    speechRecognizer.maxAlternatives = maxAlternatives || DEFAULT_CONFIG.maxAlternatives;
    speechRecognizer.lang = lang || DEFAULT_CONFIG;

    speechRecognizer.onresult = (e: SpeechRecognitionEvent) => { this.update(e) };
    
    this.state = {
      speechRecognizer,
      tags: [],
      status: TagGeneratorStatus.INACTIVE,
    }
  }

  update = (e: SpeechRecognitionEvent) => {
    const { results } = e;
    const { formatResults, onResult } = this.props;
    const formattedResults = formatResults ? formatResults(results) : results;

    onResult(results, formattedResults);
  }

  renderInactiveStatus = () => {
    const { renderInactiveStatus } = this.props;

    if (renderInactiveStatus) {
      return renderInactiveStatus(this.props, this.state);
    }

    return (
      <Fragment>
        <h2>Awaiting to be enabled...</h2>
      </Fragment>
    )
  }

  renderRecognizingStatus = () => {
    const { renderRecognizingStatus } = this.props;

    if (renderRecognizingStatus) {
      return renderRecognizingStatus(this.props, this.state);
    }

    return (
      <Fragment>
        <h2>Recording tags...</h2>
      </Fragment>
    )
  }

  renderStoppedStatus = () => {
    const { renderStoppedStatus } = this.props;

    if (renderStoppedStatus) {
      return renderStoppedStatus(this.props, this.state);
    }

    const { tags } = this.state;

    if (tags.length === 0) {
      return (<h2>No tags found in speech.</h2>);
    }

    return (
      <Fragment>
        <h2>Tags found in speech</h2>
        <p>{tags.map((tag: string, i: number) => `${i > 0 ? ',' : ''}${tag}`)}</p>
      </Fragment>
    )
  }

  componentDidUpdate() {
    const { startSpeechRecognition } = this.props;
    const { speechRecognizer, status } = this.state;

    if (startSpeechRecognition && status !== TagGeneratorStatus.RECOGNIZING) {
      speechRecognizer.start();

      this.setState({
        status: TagGeneratorStatus.RECOGNIZING,
      });

      return;
    }

    if (!startSpeechRecognition && status === TagGeneratorStatus.RECOGNIZING) {
      speechRecognizer.stop();

      this.setState({
        status: TagGeneratorStatus.STOPPED,
      });
    }
  }

  render() {
    const { status } = this.state;

    if (status === TagGeneratorStatus.INACTIVE) {
      return this.renderInactiveStatus();
    }

    if (status === TagGeneratorStatus.RECOGNIZING) {
      return this.renderRecognizingStatus();
    }

    return this.renderStoppedStatus();
  }
}