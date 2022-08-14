import { useState, useEffect } from 'react';
import { useNdef, promptNdef } from './useNdef'
import './App.css';

function App() {
  const {
    supported: nfcSupported,
    permissionStatus: nfcPermissionStatus,
    latestReadEvent,
    error: nfcError,
  } = useNdef();

  const [messageBoard, setMessageBoard] = useState(null);

  useEffect(() => {
    if (!latestReadEvent) return
    setMessageBoard({
      id: latestReadEvent.serialNumber,
      messages: latestReadEvent.message.records.map(decodeRecord),
    })
  }, [latestReadEvent]);

  return (
    <div className="App">
      <header className="App-header">
        {renderAppContent()}
      </header>
    </div>
  );

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
        <>
          { !nfcSupported && renderNotSupported()}
          { nfcSupported && nfcPermissionStatus === 'prompt' && renderPrompt()}
          { nfcSupported && nfcPermissionStatus === 'granted' && renderPleaseScan()}
          { nfcSupported && nfcPermissionStatus === 'denied' && renderDenied()}
          { nfcSupported && nfcError && nfcError.toString()}
        </>
      )
    }
  }

  function renderMessageBoard (messageBoard) {
    return (
      <div>
        <p>Message Board: {messageBoard.id}</p>
        {messageBoard.messages.map(renderMessage)}
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

}

function renderPleaseScan () {
  return (
    <div>
      <p>Please scan a Message Board</p>
    </div>
  )
}

function renderMessage (message, index) {
  return (
    <div key={index}>
      <p>{message}</p>
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
