### nfc-bbs

demo webapp for NFC based local-only messageboard.

Compat: only works on chrome browser for android. `:(`
see compat table: https://caniuse.com/webnfc

### message board reading instructions

to read a messageboard that has been setup:
- ensure phone has NFC and is enabled
- tap phone to nfc
- you can now use the chat interface to see and add messages to be written
- tap the phone to the sticker again to write new messages to the nfc

### nfc device setup instructions

to setup a new messageboard on a passive nfc device:
- need high storage capacity passive NFC devices (as much as possible, aim for at least ~1kB)
- ensure phone has NFC and is enabled
- visit the webapp https://kumavis.github.io/nfc-bbs/
- click button (if present) and approve enable nfc permission
- touch phone to nfc. nfc must be away from other nfcs, must be flat, etc
- first touch will "install" the messageboard to the nfc (just adds link to webapp)
- you can now use the chat interface to add messages to be written
- tap the phone to the sticker again to write to the nfc
