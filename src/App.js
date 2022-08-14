import { useState, useEffect } from 'react';
import useNdef from './useNdef'
import NewMessageForm from './new-message-form';
import './App.css';
import packageJson from '../package.json';

const { homepage: homepageUrl } = packageJson

function App() {

  const [messageBoard, setMessageBoard] = useState(null);
  const [pendingMessages, setPendingMessages] = useState([]);

  const {
    supported: nfcSupported,
    permissionStatus: nfcPermissionStatus,
    promptNdef,
    latestReadEvent,
    setPendingRecords,
    error: nfcError,
  } = useNdef({ 
    onWriteSuccess: () => {
      setPendingMessages([]);
    },
  });

  useEffect(() => {
    if (!latestReadEvent) return
    setMessageBoard({
      id: latestReadEvent.serialNumber,
      messages: readMessageBoardMessagesFromRecords(latestReadEvent.message.records),
    })
  }, [latestReadEvent]);

  function readMessageBoardMessagesFromRecords (records) {
    return records
      .filter(({recordType}) => recordType === 'text')
      .map(decodeTextRecord)
  }

  return (
    <div className="App">
      { nfcError && nfcError.toString() }
      {renderAppContent()}
    </div>
  );

  function submitMessage (message) {
    // command to clear message board
    if (message === 'command clear') {
      setPendingRecords([
        { recordType: 'url', data: homepageUrl },
      ]);
      setPendingMessages([])
      setMessageBoard({
        id: messageBoard.id,
        messages: [],
      })
      return
    }
    // normal message submit
    const newPendingMessages = [...pendingMessages, message];
    setPendingMessages(newPendingMessages)
    setPendingRecords([
      // first record is a non-message link to the message board
      { recordType: 'url', data: homepageUrl },
      ...messageBoard.messages.map(text => ({ recordType: 'text', data: text })),
      ...newPendingMessages.map(text => ({ recordType: 'text', data: text })),
    ])
  }

  function startDemo () {
    setMessageBoard({
      id: 'demo board',
      messages: [
        'message one',
        'message two',
        'message three',
      ],
    })
  }

  function renderAppContent () {
    if (messageBoard) {
      return renderMessageBoard(messageBoard)
    } else {
      return (
        <header className="App-header">
          { !nfcSupported && renderNotSupported()}
          { nfcSupported && nfcPermissionStatus === 'prompt' && renderPrompt()}
          { nfcSupported && nfcPermissionStatus === 'granted' && renderPleaseScan()}
          { nfcSupported && nfcPermissionStatus === 'denied' && renderDenied()}
          {/* { nfcSupported && nfcError && nfcError.toString()} */}
        </header>
      )
    }
  }

  function renderMessageBoard (messageBoard) {
    return (
      <div>
        <p>Message Board: {messageBoard.id}</p>
        <header className="App-header">
          {messageBoard.messages.map((message, index) => renderMessage(message, index))}
          {pendingMessages.map((message, index) => renderMessage(message, index, true))}
          {renderMessageInput()}
        </header>
      </div>
    )
  }

  function renderMessage (message, index, pending = false) {
    return (
      <div key={index} className={"message " + (pending ? 'message-pending' : '')}>
        <p>{pending && '(pending) '} {message}</p>
      </div>
    )
  }

  function renderMessageInput () {
    return (
      <div className='message'>
        <NewMessageForm onSubmit={submitMessage}/>
      </div>
    )
  }

  function renderNotSupported () {
    return (
      <div>
        <p>NFC not supported</p>
        <button onClick={startDemo}>try demo</button>
      </div>
    )
  }

  function renderPrompt () {
    return (
      <div>
        <p>Please allow NFC access in order to read Message Board</p>
        <button onClick={promptNdef}>
          click here
        </button>
      </div>
    )
  }

}

function renderPleaseScan () {
  return (
    <div>
      <p>Please scan a Message Board</p>
    </div>
  )
}

function renderDenied () {
  return (
    <div>
      <p>You have denied NFC permissions, they are required. Please reset NFC permissions.</p>
    </div>
  )
}

function decodeTextRecord (record) {
  const textDecoder = new TextDecoder(record.encoding);
  return textDecoder.decode(record.data);
}

export default App;
