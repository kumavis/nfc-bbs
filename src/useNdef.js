import { useState, useEffect } from 'react';

export function useNdef () {
  const supported = ('NDEFReader' in window)
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [latestReadEvent, setLatestReadEvent] = useState(null);
  const [error, setError] = useState(null);

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

  // check NDef messages
  useEffect(() => {
    (async () => {
      if (!supported) return;
      if (permissionStatus !== 'granted') return;
      const ndef = new window.NDEFReader();
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
  }, [supported, permissionStatus]);

  function onReading (readEvent) {
    setLatestReadEvent(readEvent);
  }

  function onReadingError (readErrorEvent) {
    setError(new Error(`Ndef reading error: ${readErrorEvent}`));
  }

  return { supported, permissionStatus, latestReadEvent, error };
}


export function promptNdef (event) {
  const ndef = new window.NDEFReader();
  // trigger permissions prompt
  ndef.scan().then(() => {});
}
