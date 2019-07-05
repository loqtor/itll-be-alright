import React, { Component, Fragment } from 'react';
import { grammar as DEFAULT_GRAMMAR } from '../constants/grammar';

enum TagGeneratorStatus {
  INACTIVE = 0,
  RECOGNIZING = 1,
  STOPPED = 2,
}

interface ITagGeneratorProps {
  startSpeechRecognition?: boolean;
  speechGrammar?: string; // @TODO: Check if there's a way to validate grammars.
}

interface ITagGeneratorState {
  speechRecognizer: any; // TODO: Get types for this.
  tags: string[];
  status: TagGeneratorStatus;
}

export const TagGenerator = class TagGenerator extends Component<ITagGeneratorProps, ITagGeneratorState> {
  constructor(props: ITagGeneratorProps) {
    super(props);

    const { speechGrammar } = props;

    // @ts-ignore -- For now...
    const speechRecognitionConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    // @ts-ignore -- For now...
    const speechGrammarListConstructor = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    const speechGrammarList = new speechGrammarListConstructor();
    const speechRecognizer = new speechRecognitionConstructor();

    speechGrammarList.addFromString(speechGrammar || DEFAULT_GRAMMAR, 1);
    speechRecognizer.grammars = speechGrammarList;
    speechRecognizer.continuous = true;
    speechRecognizer.interimResults = true;
    speechRecognizer.maxAlternatives = 1;
    speechRecognizer.lang = 'en-NZ';

    speechRecognizer.onresult = (e: any) => { this.updateTags(e) };
    
    this.state = {
      speechRecognizer,
      tags: [],
      status: TagGeneratorStatus.INACTIVE,
    }
  }

  updateTags = (e: any) => {
    console.log('Found a result: ', e);
  }

  renderInactiveStatus = () => {
    return (
      <Fragment>
        <h2>Awaiting to be enabled...</h2>
      </Fragment>
    )
  }

  renderRecognizingStatus = () => {
    return (
      <Fragment>
        <h2>Recording tags...</h2>
      </Fragment>
    )
  }

  renderStoppedStatus = () => {
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