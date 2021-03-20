const maxAPI = require('max-api');
const http = require('http');
const Phea = require('phea');
var options = {
    "address": "192.168.1.130",
    "username": "G1DoZ0llUBq4nXpPWyh8CoBAG0QrNanO5antVDsJ",
    "psk": "BF045C4B21B526C93BF68FB83BD0D311"
}
async function bridgeStop()
{
    let bridge = await Phea.bridge(options);
    await   bridge.stop();
}

maxAPI.addHandlers({
    stop: ()=>{
        bridgeStop();
    }
});