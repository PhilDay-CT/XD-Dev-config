//sfSig:{"sig": "3045022056664d4036182dc1d53b73d9fadfecd433cfabde27f939fe1ad07fb34f1af75d022100aa8deea7648bcbb74eca60472d232c096f0b116c5d9fec5709bd166654775c2a", "certPEM": "-----BEGIN CERTIFICATE-----$!$MIIDEDCCAregAwIBAgIBATAKBggqhkjOPQQDAjBsMQswCQYDVQQGEwJVSzEfMB0G$!$A1UECgwWQ29uZmlndXJlZCBUaGluZ3MgTHRkLjENMAsGA1UECwwEY3R4ZDEOMAwG$!$A1UECwwFVXNlcnMxHTAbBgNVBAMMFGN0eGQtdXNlcnMtYWRtaW5zLWNhMB4XDTI0$!$MDYwMzExMTAwOFoXDTM0MDYwMTExMTAwOFowYDELMAkGA1UEBhMCVUsxHzAdBgNV$!$BAoMFkNvbmZpZ3VyZWQgVGhpbmdzIEx0ZC4xDTALBgNVBAsMBGN0eGQxDjAMBgNV$!$BAsMBVVzZXJzMREwDwYDVQQDDAhjdC1hZG1pbjBZMBMGByqGSM49AgEGCCqGSM49$!$AwEHA0IABCjZimd9RAx9mgCZqN/nulM9XbCW5LitXZEsB5q137/ni0oT+xP9++oN$!$thjf+ZHfqu17QxDYFH7ePBowqgSMvUajggFUMIIBUDCBjgYIKwYBBQUHAQEEgYEw$!$fzBFBggrBgEFBQcwAoY5aHR0cDovL2N0eGQtdXNlcnMtYWRtaW5zLWNhLmN0eGQv$!$Y3R4ZC11c2Vycy1hZG1pbnMtY2EuY3J0MDYGCCsGAQUFBzABhipodHRwOi8vb2Nz$!$cC5jdHhkLXVzZXJzLWFkbWlucy1jYS5jdHhkOjkwODEwHwYDVR0jBBgwFoAUziKd$!$bNOAlDeXcUhjgD20RCV6hoMwDAYDVR0TAQH/BAIwADBKBgNVHR8EQzBBMD+gPaA7$!$hjlodHRwOi8vY3R4ZC11c2Vycy1hZG1pbnMtY2EuY3R4ZC9jdHhkLXVzZXJzLWFk$!$bWlucy1jYS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDgYDVR0PAQH/BAQDAgeA$!$MB0GA1UdDgQWBBRkb39EsCNet9szaVNeBd7x3Pyx1jAKBggqhkjOPQQDAgNHADBE$!$AiAdEsPC7OHYro6q4gIUb4fczPjjrd7LU0WO8L8ieYzT2AIgOK8l1vDSO7DTcG8+$!$UNocCDsaTUX2mnhWXI4tZhJaRU8=$!$-----END CERTIFICATE-----$!$", "description": "", "timestamp":"1717431137744", "timelimit":"0"}
//sfTimestamp:1717431137744
//sfLabel:/opt/ct/signing/files/Lora/DeviceProfiles/Kuando/Busylight/Codec.js

//
// Chirpstack Codec function for Plenom Busy Light
//

function decodeUplink(input) {

    var data = {}
    
    if(input.fPort == 15 && input.bytes.length == 24) {
        data.RSSI = byteArrayToLong(input.bytes, 0);
        data.SNR = byteArrayToLong(input.bytes, 4);
        data.messages_received = byteArrayToLong(input.bytes, 8);
        data.messages_send = byteArrayToLong(input.bytes, 12);
        data.lastcolor_red = input.bytes[16];
        data.lastcolor_blue = input.bytes[17];
        data.lastcolor_green = input.bytes[18];
        data.lastcolor_ontime = input.bytes[19];
        data.lastcolor_offtime = input.bytes[20];
        data.sw_rev = input.bytes[21];
        data.hw_rev = input.bytes[22];
        data.adr_state = input.bytes[23];
    } else {
        data.bytes = input.bytes
    }

    return {data: data}
}
  
function byteArrayToLong(/*byte[]*/byteArray, /*int*/from) {
    return byteArray[from] | (byteArray[from+1] << 8) | (byteArray[from+2] << 16) | (byteArray[from+3] << 24);
};



function encodeDownlink(input) {
    var payload = [];    
    payload.push(input.data.red & 0x00FF)
    payload.push(input.data.blue & 0x00FF)
    payload.push(input.data.green & 0x00FF)
    payload.push(input.data.ontime & 0x00FF), 
    payload.push(input.data.offtime & 0x00FF)
    return {bytes: payload}
}