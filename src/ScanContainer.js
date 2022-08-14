// https://github.com/devpato/react-NFC-sample/blob/4692a2fed38e3bc87eb82251d3a80c4172756fca/src/containers/Scan.js

import React, { useCallback, useContext, useEffect, useState } from 'react';
// import Scanner from '../components/Scanner/Scanner';
// import { ActionsContext } from '../contexts/context';

function logStatus (status) {
    console.log("NFC status: " + status);
    document.title = status
}

const Scan = () => {
    const [messages, setMessages] = useState([]);
    const [serialNumber, setSerialNumber] = useState('');
    // const { actions, setActions} = useContext(ActionsContext);

    const scan = useCallback(async() => {

        if ('NDEFReader' in window) { 
            try {
                logStatus('scan')
                const ndef = new window.NDEFReader();
                await ndef.scan();
                logStatus('scanned')

                
                console.log("Scan started successfully.");
                ndef.onreadingerror = () => {
                    logStatus('err')
                    console.log("Cannot read data from the NFC tag. Try another one?");
                };
                
                ndef.onreading = event => {
                    console.log("NDEF message read.");
                    logStatus('read')

                    onReading(event);
                    // setActions({
                    //     scan: 'scanned',
                    //     write: null
                    // });
                };

            } catch(error){
                logStatus(`error: ${error.message}`)
                console.log(`Error! Scan failed to start: ${error}.`);
            };
        }
    // },[setActions]);
    },[setMessages]);

    const onReading = ({message, serialNumber}) => {
        setSerialNumber(serialNumber);
        const messages = message.records.map(decodeRecord);
        setMessages(messages);
    };

    useEffect(() => {
        scan();
    }, [scan]);


    const renderMessage = (message, index) => {
      return (
        <div key={index}>
          {message}
        </div>
      )
    }

    return(
      <>
        {/* {actions.scan === 'scanned' ?   */}
        <div>
          <p>Message Board: {serialNumber}</p>
          {messages.map(renderMessage)}
        </div>
      </>
    );
};

function decodeRecord (record) {
    switch (record.recordType) {
    case "text":
      const textDecoder = new TextDecoder(record.encoding);
      return textDecoder.decode(record.data);
      break;
    // case "url":
    //   // TODO: Read URL record with record data.
    //   break;
    default:
      // TODO: Handle other records with record data.
      return 'could not parse record';
  }
}

export default Scan;