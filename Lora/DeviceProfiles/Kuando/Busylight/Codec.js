//sfSig:{"sig": "3046022100e8a96b59c2acda381a786a93a21e1f461efbee5475211fab1522e320c4f5f8fa022100b3832081cd0559062bfb535dac52c5f5eb0e51b4dbb9527679b42dc4845996c2", "certPEM": "-----BEGIN CERTIFICATE-----$!$MIIDETCCAregAwIBAgIBATAKBggqhkjOPQQDAjBsMQswCQYDVQQGEwJVSzEfMB0G$!$A1UECgwWQ29uZmlndXJlZCBUaGluZ3MgTHRkLjENMAsGA1UECwwEY3R4ZDEOMAwG$!$A1UECwwFVXNlcnMxHTAbBgNVBAMMFGN0eGQtdXNlcnMtYWRtaW5zLWNhMB4XDTI0$!$MDgxNjE4MDkxN1oXDTM0MDgxNDE4MDkxN1owYDELMAkGA1UEBhMCVUsxHzAdBgNV$!$BAoMFkNvbmZpZ3VyZWQgVGhpbmdzIEx0ZC4xDTALBgNVBAsMBGN0eGQxDjAMBgNV$!$BAsMBVVzZXJzMREwDwYDVQQDDAhjdC1hZG1pbjBZMBMGByqGSM49AgEGCCqGSM49$!$AwEHA0IABAT8rSVBw5oFDMkdkfez3rM3Na8gSIb3SSlovkoA6T7J1vDueZyqrndI$!$aDbvQjKDYxT1p7DdsB7etGP3WDocEXOjggFUMIIBUDCBjgYIKwYBBQUHAQEEgYEw$!$fzBFBggrBgEFBQcwAoY5aHR0cDovL2N0eGQtdXNlcnMtYWRtaW5zLWNhLmN0eGQv$!$Y3R4ZC11c2Vycy1hZG1pbnMtY2EuY3J0MDYGCCsGAQUFBzABhipodHRwOi8vb2Nz$!$cC5jdHhkLXVzZXJzLWFkbWlucy1jYS5jdHhkOjkwODEwHwYDVR0jBBgwFoAUEu3Q$!$qtIP3h8krX5fHcLRiKhyIYIwDAYDVR0TAQH/BAIwADBKBgNVHR8EQzBBMD+gPaA7$!$hjlodHRwOi8vY3R4ZC11c2Vycy1hZG1pbnMtY2EuY3R4ZC9jdHhkLXVzZXJzLWFk$!$bWlucy1jYS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDgYDVR0PAQH/BAQDAgeA$!$MB0GA1UdDgQWBBSqYd9d6yD2b9hzT37PD3ZoIe3D2DAKBggqhkjOPQQDAgNIADBF$!$AiEApvBDT8tEWIWefweWT1fcWZ/dt+jEUELDrxlZbqFrFE0CIHKsX7gB5bjq926w$!$SBRfgBLzqVIJl9m35EBBgmrSE5+3$!$-----END CERTIFICATE-----$!$", "description": "Lora/DeviceProfiles/Kuando/Busylight/Codec.js signed by ct-admin", "timestamp":"1724159062068", "timelimit":"0"}
//sfTimestamp:1724159062068
//sfLabel:Lora/DeviceProfiles/Kuando/Busylight/Codec.js

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