import { useNdef, promptNdef } from './useNdef'
import './App.css';

function App() {
  const {
    supported: nfcSupported,
    permissionStatus: nfcPermissionStatus,
    latestReadEvent,
    error: nfcError,
  } = useNdef();

  const messageBoardId = latestReadEvent && latestReadEvent.serialNumber;
  const messages = latestReadEvent ? latestReadEvent.message.records.map(decodeRecord) : [];

  return (
    <div className="App">
      <header className="App-header">
        { !nfcSupported && renderNotSupported()}
        { nfcSupported && nfcPermissionStatus === 'prompt' && renderPrompt()}
        { nfcSupported && nfcPermissionStatus === 'granted' && renderSupported()}
        { nfcSupported && nfcPermissionStatus === 'denied' && renderDenied()}
        { nfcSupported && nfcError && nfcError.toString()}
      </header>
    </div>
  );

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

  function renderSupported () {
    return (
      <div className="App-container">
        {latestReadEvent ? renderMessageBoard() : renderPleaseScan()}
      </div>
    )
  }

  function renderMessageBoard () {
    return (
      <div>
        <p>Message Board: {messageBoardId}</p>
        {messages.map(renderMessage)}
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

function renderMessage (message) {
  return (
    <div>
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

function renderNotSupported () {
  return (
    <div>
      <p>NFC not supported</p>
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
