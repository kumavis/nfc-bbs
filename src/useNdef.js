import { useState, useEffect } from 'react';


export default function useNdef ({ onWriteSuccess }) {
  const supported = ('NDEFReader' in window)
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [latestReadEvent, setLatestReadEvent] = useState(null);
  const [pendingRecords, setPendingRecords] = useState(null);
  const [error, setError] = useState(null);

  const ndef = window.NDEFReader && new window.NDEFReader();

  // check permissions
  useEffect(() => {
    (async () => {
      try {
        if (navigator && navigator.permissions) {
          const status = await navigator.permissions
            .query({ name: 'nfc' })
          setPermissionStatus(status.state);
          status.addEventListener('change', () => {
            setPermissionStatus(status.state);
          });
        } else {
          throw new Error('Navigator permissions are not available.');
        }
      } catch (err) {
        setError(err);
      }
    })()
  }, []); 

  // read NDef messages
  useEffect(() => {
    (async () => {
      if (!supported) return;
      if (permissionStatus !== 'granted') return;
      // const ndef = new window.NDEFReader();
      ndef.addEventListener('reading', onReading);
      ndef.addEventListener('readingerror', onReadingError);
      // while (true) {
        try {
          await ndef.scan();
        } catch (err) {
          setError(err);
        }
      // }
    })()
  }, [supported, permissionStatus, pendingRecords]);

  // write NDef messages
  useEffect(() => {
    (async () => {
      try {
        if (!supported) return;
        if (permissionStatus !== 'granted') return;
        if (!pendingRecords) return;
        // const ndef = new window.NDEFReader();
        await ndef.write({
          records: pendingRecords,
        }, {
          // not supported? "NDEFWriteOptions#overwrite does not allow overwrite."
          // overwrite: false,
        });
        setPendingRecords(null);
        onWriteSuccess();
      } catch (err) {
        setError(err);
      }
    })()
  }, [supported, permissionStatus, pendingRecords]);

  function onReading (readEvent) {
    setLatestReadEvent(readEvent);
  }

  function onReadingError (readErrorEvent) {
    setError(new Error(`Ndef reading error: ${readErrorEvent}`));
  }

  function promptNdef (event) {
    // const ndef = new window.NDEFReader();
    // trigger permissions prompt
    ndef.scan().then(() => {});
  }

  return { supported, permissionStatus, promptNdef, latestReadEvent, setPendingRecords, error };
}