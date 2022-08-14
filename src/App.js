import './App.css';

function App() {
  const nfcSupported = isNFCenabled();
  return (
    <div className="App">
      <header className="App-header">
        {nfcSupported ? renderSupported() : renderNotSupported()}
      </header>
    </div>
  );
}

function renderSupported () {
  return (
    <div>
      <p>NFC supported</p>
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

const isNFCenabled = () => {
  return ('NDEFReader' in window)
}

export default App;
