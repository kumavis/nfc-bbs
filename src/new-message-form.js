import React from "react";


export default class NewMessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  handleChange (event) {
    this.setState({value: event.target.value});
  }
  handleSubmit (event) {
    event.preventDefault();
    if (this.state.value === '') return;
    this.props.onSubmit(this.state.value);
    this.setState({value: ''});
  }
  onKeyDown (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.handleSubmit(event);
    }
  }

  render() {
    // this is in render fn bc it makes debugging easier
    // supported in at least chrome for android
    // https://caniuse.com/mdn-api_navigator_useragentdata
    const isMobile = navigator.userAgentData.mobile;

    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          className='new-message-textarea'
          placeholder='your message...'
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.onKeyDown}
        />
        {isMobile && (
          <button type='submit' className='new-message-button'>
            <span role='img' aria-label='send'>📨</span>
          </button>
        )}
      </form>
    );
  }
}