
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