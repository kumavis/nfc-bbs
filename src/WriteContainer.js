import { useState, useEffect } from 'react';
// import Writer from '../components/Writer/Writer';



const Write = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [needsUpdate, setNeedsUpdate] = useState(true);

    function logStatus (status) {
        console.log("NFC status: " + status);
        document.title = status
        setStatusMessage(status);
    }

    // logStatus('write ready')
    const onWrite = async(message) => {
        if (!needsUpdate) {
            logStatus('no update queued')
            return;
        }
        try {
            const ndef = new window.NDEFReader();
            logStatus('writing')
            await ndef.write({
                records: [{
                    recordType: "text",
                    data: message,
                },
                {
                    recordType: "text",
                    data: 'also hello',
                }]
            }, {
                // append record
                // not supported? "NDEFWriteOptions#overwrite does not allow overwrite."
                // overwrite: false,
            });
            // await ndef.write({
            //     records: [{
            //         recordType: "text",
            //         data: 'also hello',
            //     }]
            // }, {
            //     // append record
            //     // overwrite: false,
            // });
            logStatus('wrote')
            console.log(`Value Saved!`);
        } catch (error) {
            logStatus(`${error.message}`)
            console.log(error);
        }
    }

    useEffect(() => {
      onWrite('this is news: '+Math.random())
    }, [needsUpdate]);

    return (
    //   <Writer writeFn={onWrite}/>
        'Writer: '+statusMessage
    );
};

export default Write;