import React, { Component, Fragment } from 'react';

interface ITagGeneratorProps {
  showResults: boolean;
  grammar: string; // @TODO: Check if there's a way to validate grammars.
}

interface ITagGeneratorState {
}

export const TagGenerator = class TagGenerator extends Component<ITagGeneratorProps, ITagGeneratorState> {
  constructor(props: ITagGeneratorProps) {
    super(props);

    this.state = {
      recognizer: null,
    }
  }

  startRecognition = () => {

  }

  stopRecognition = () => {

  }

  render() {
    return (
      <Fragment>
        <h2>This is the tag generator</h2>
        <p>It receives a string and with the mic input</p>
      </Fragment>
    )
  }
}