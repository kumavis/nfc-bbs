import React from "react";

export default class NewMessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea className='new-message-textarea' placeholder='your message...' value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Send" />
      </form>
    );
  }
}