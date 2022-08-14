import { useState, useEffect } from 'react';
import useNdef from './useNdef'
import NewMessageForm from './new-message-form';
import './App.css';

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
      messages: latestReadEvent.message.records.map(decodeRecord),
    })
  }, [latestReadEvent]);

  return (
    <div className="App">
      { nfcError && nfcError.toString() }
      {renderAppContent()}
    </div>
  );

  function submitMessage (message) {
    const newPendingMessages = [...pendingMessages, message];
    setPendingMessages(newPendingMessages)
    setPendingRecords([
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

function decodeRecord (record) {
  switch (record.recordType) {
    case "text":
      const textDecoder = new TextDecoder(record.encoding);
      return textDecoder.decode(record.data);
    default:
      // TODO: Handle other records with record data.
      return `Unknown record type: "${record.recordType}"`;
  }
}

export default App;
