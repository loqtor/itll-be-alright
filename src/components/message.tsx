import React, { Component } from 'react';

interface IMessageProps {
  messageFileUrl: string;
  messageText: string;
}

interface IMessageState {
  isPlaying: boolean;
}

export const Message = class Message extends Component {
  render() {
    return (
      <p>This is the message component.</p>
    )
  }
}