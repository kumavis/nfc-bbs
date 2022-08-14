import useNavigatorPermissions from './use-navigator-permissions'
import { useState } from 'react';
import './App.css';
import ScanContainer from './ScanContainer';
import WriteContainer from './WriteContainer';

function App() {
  const nfcSupported = isNFCenabled();

  const [actions, setActions] = useState(null);
  const {scan, write} = actions || {};

  const nfcPermissions = useNavigatorPermissions('nfc')

  const onHandleAction = (actions) =>{
    setActions({...actions});
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* {renderSupported()} */}
        { !nfcSupported && renderNotSupported()}
        { nfcSupported && nfcPermissions.status === 'prompt' && renderPrompt()}
        { nfcSupported && nfcPermissions.status === 'granted' && renderSupported()}
        { nfcSupported && nfcPermissions.status === 'denied' && renderDenied()}
      </header>
    </div>
  );

  function promptNfc (event) {
    const ndef = new window.NDEFReader();
    // trigger permissions prompt
    ndef.scan().then(() => {});
  }

  function renderPrompt () {
    return (
      <div>
        {/* <p>Please allow NFC access in order to read Message Board</p> */}
        <button onClick={promptNfc}>
          click here
        </button>
      </div>
    )
  }

  function renderSupported () {
    return (
      <div className="App-container">
        <button onClick={()=>onHandleAction({scan: 'scanning', write: null})} className="btn">Scan</button>
        <button onClick={()=>onHandleAction({scan: null, write: 'writing'})} className="btn">Write</button>
        {scan && <ScanContainer />}
        {write && <WriteContainer />}
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
