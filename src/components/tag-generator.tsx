import React, { Component, Fragment } from 'react';

interface ITagGeneratorProps {
}

interface ITagGeneratorState {
}

export const TagGenerator = class TagGenerator extends Component<ITagGeneratorProps, ITagGeneratorState> {
  render() {
    return (
      <Fragment>
        <h2>This is the tag generator</h2>
        <p>It receives a Blob and return the words that it recognized based on a grammar</p>
      </Fragment>
    )
  }
}