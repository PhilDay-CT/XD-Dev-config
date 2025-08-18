//sfSig:{"sig": "304502205b059f735c3c90b122d7b03a6c9aa9c49c9a21c7c4945ec13953dc9ccaffca7a0221009afac7e8ca5612f6a95fec3eb51432298de1ffc53e46737b6d8f2a7f5530dd68", "certPEM": "-----BEGIN CERTIFICATE-----$!$MIIDETCCAregAwIBAgIBATAKBggqhkjOPQQDAjBsMQswCQYDVQQGEwJVSzEfMB0G$!$A1UECgwWQ29uZmlndXJlZCBUaGluZ3MgTHRkLjENMAsGA1UECwwEY3R4ZDEOMAwG$!$A1UECwwFVXNlcnMxHTAbBgNVBAMMFGN0eGQtdXNlcnMtYWRtaW5zLWNhMB4XDTI0$!$MDgxNjE4MDkxN1oXDTM0MDgxNDE4MDkxN1owYDELMAkGA1UEBhMCVUsxHzAdBgNV$!$BAoMFkNvbmZpZ3VyZWQgVGhpbmdzIEx0ZC4xDTALBgNVBAsMBGN0eGQxDjAMBgNV$!$BAsMBVVzZXJzMREwDwYDVQQDDAhjdC1hZG1pbjBZMBMGByqGSM49AgEGCCqGSM49$!$AwEHA0IABAT8rSVBw5oFDMkdkfez3rM3Na8gSIb3SSlovkoA6T7J1vDueZyqrndI$!$aDbvQjKDYxT1p7DdsB7etGP3WDocEXOjggFUMIIBUDCBjgYIKwYBBQUHAQEEgYEw$!$fzBFBggrBgEFBQcwAoY5aHR0cDovL2N0eGQtdXNlcnMtYWRtaW5zLWNhLmN0eGQv$!$Y3R4ZC11c2Vycy1hZG1pbnMtY2EuY3J0MDYGCCsGAQUFBzABhipodHRwOi8vb2Nz$!$cC5jdHhkLXVzZXJzLWFkbWlucy1jYS5jdHhkOjkwODEwHwYDVR0jBBgwFoAUEu3Q$!$qtIP3h8krX5fHcLRiKhyIYIwDAYDVR0TAQH/BAIwADBKBgNVHR8EQzBBMD+gPaA7$!$hjlodHRwOi8vY3R4ZC11c2Vycy1hZG1pbnMtY2EuY3R4ZC9jdHhkLXVzZXJzLWFk$!$bWlucy1jYS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDgYDVR0PAQH/BAQDAgeA$!$MB0GA1UdDgQWBBSqYd9d6yD2b9hzT37PD3ZoIe3D2DAKBggqhkjOPQQDAgNIADBF$!$AiEApvBDT8tEWIWefweWT1fcWZ/dt+jEUELDrxlZbqFrFE0CIHKsX7gB5bjq926w$!$SBRfgBLzqVIJl9m35EBBgmrSE5+3$!$-----END CERTIFICATE-----$!$", "description": "", "timestamp":"1755534175259", "timelimit":"0"}
//sfTimestamp:1755534175259
//sfLabel:/opt/ct/signing/files/Lora/DeviceProfiles/Elsys/Codec.js

//
// Chirpstack Codec function for Elsys sensors
//

function decodeUplink(input) {
  switch (input.fPort) {
    case 5:
          return {data: DecodeData(input.bytes, input.variables)};
    case 6:
          return {data: DecodeSettings(input.bytes, input.variables)};
  }
}

function encodeDownlink(input) {
  var allPayload = '';
  for(var i in settings) {
      if (settings[i].name in input.data) {
        allPayload += generateSettingPayload(settings[i], input.data[settings[i].name]);
      }
  }
  var totLen = (allPayload.length / 2);
  var lenHex = padStart(totLen.toString(16), 2, '0').toUpperCase();
  return {bytes: hexToBytes('3E' + lenHex + allPayload)};
}

//////////////////////////////////
//
// Payload Decoder
//
/////////////////////////////////
function DecodeData(data, variables) {
  // Comment  xxxxxxx
  var TYPE_TEMP = 0x01; //temp 2 bytes -3276.8°C -->3276.7°C
  var TYPE_RH = 0x02; //Humidity 1 byte  0-100%
  var TYPE_ACC = 0x03; //acceleration 3 bytes X,Y,Z -128 --> 127 +/-63=1G
  var TYPE_LIGHT = 0x04; //Light 2 bytes 0-->65535 Lux
  var TYPE_MOTION = 0x05; //No of motion 1 byte  0-255
  var TYPE_CO2 = 0x06; //Co2 2 bytes 0-65535 ppm
  var TYPE_VDD = 0x07; //VDD 2byte 0-65535mV
  var TYPE_ANALOG1 = 0x08; //VDD 2byte 0-65535mV
  var TYPE_GPS = 0x09; //3bytes lat 3bytes long binary
  var TYPE_PULSE1 = 0x0a; //2bytes relative pulse count
  var TYPE_PULSE1_ABS = 0x0b; //4bytes no 0->0xFFFFFFFF
  var TYPE_EXT_TEMP1 = 0x0c; //2bytes -3276.5C-->3276.5C
  var TYPE_EXT_DIGITAL = 0x0d; //1bytes value 1 or 0
  var TYPE_EXT_DISTANCE = 0x0e; //2bytes distance in mm
  var TYPE_ACC_MOTION = 0x0f; //1byte number of vibration/motion
  var TYPE_IR_TEMP = 0x10; //2bytes internal temp 2bytes external temp -3276.5C-->3276.5C
  var TYPE_OCCUPANCY = 0x11; //1byte data
  var TYPE_WATERLEAK = 0x12; //1byte data 0-255
  var TYPE_GRIDEYE = 0x13; //65byte temperature data 1byte ref+64byte external temp
  var TYPE_PRESSURE = 0x14; //4byte pressure data (hPa)
  var TYPE_SOUND = 0x15; //2byte sound data (peak/avg)
  var TYPE_PULSE2 = 0x16; //2bytes 0-->0xFFFF
  var TYPE_PULSE2_ABS = 0x17; //4bytes no 0->0xFFFFFFFF
  var TYPE_ANALOG2 = 0x18; //2bytes voltage in mV
  var TYPE_EXT_TEMP2 = 0x19; //2bytes -3276.5C-->3276.5C
  var TYPE_EXT_DIGITAL2 = 0x1a; // 1bytes value 1 or 0
  var TYPE_EXT_ANALOG_UV = 0x1b; // 4 bytes signed int (uV)
  var TYPE_DEBUG = 0x3d; // 4bytes debug

  function bin16dec(bin) {
      var num = bin & 0xffff;
      if (0x8000 & num) num = -(0x010000 - num);
      return num;
  }

  function bin8dec(bin) {
      var num = bin & 0xff;
      if (0x80 & num) num = -(0x0100 - num);
      return num;
  }

  var obj = new Object();
  for (i = 0; i < data.length; i++) {
      switch (data[i]) {
          case TYPE_TEMP: //Temperature
              var temp = (data[i + 1] << 8) | data[i + 2];
              temp = bin16dec(temp);
              obj.temperature = temp / 10;
              i += 2;
              break;
          case TYPE_RH: //Humidity
              var rh = data[i + 1];
              obj.humidity = rh;
              i += 1;
              break;
          case TYPE_ACC: //Acceleration
              obj.x = bin8dec(data[i + 1]);
              obj.y = bin8dec(data[i + 2]);
              obj.z = bin8dec(data[i + 3]);
              i += 3;
              break;
          case TYPE_LIGHT: //Light
              obj.light = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_MOTION: //Motion sensor(PIR)
              obj.motion = data[i + 1];
              i += 1;
              break;
          case TYPE_CO2: //CO2
              obj.co2 = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_VDD: //Battery level
              obj.battery = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_ANALOG1: //Analog input 1
              obj.analog1 = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_GPS: //gps
              i++;
              obj.lat =
                  (data[i + 0] |
                      (data[i + 1] << 8) |
                      (data[i + 2] << 16) |
                      (data[i + 2] & 0x80 ? 0xff << 24 : 0)) /
                  10000;
              obj.long =
                  (data[i + 3] |
                      (data[i + 4] << 8) |
                      (data[i + 5] << 16) |
                      (data[i + 5] & 0x80 ? 0xff << 24 : 0)) /
                  10000;
              i += 5;
              break;
          case TYPE_PULSE1: //Pulse input 1
              obj.pulse1 = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_PULSE1_ABS: //Pulse input 1 absolute value
              var pulseAbs =
                  (data[i + 1] << 24) |
                  (data[i + 2] << 16) |
                  (data[i + 3] << 8) |
                  data[i + 4];
              obj.pulseAbs = pulseAbs;
              i += 4;
              break;
          case TYPE_EXT_TEMP1: //External temp
              var temp = (data[i + 1] << 8) | data[i + 2];
              temp = bin16dec(temp);
              obj.externalTemperature = temp / 10;
              i += 2;
              break;
          case TYPE_EXT_DIGITAL: //Digital input
              obj.digital = data[i + 1];
              i += 1;
              break;
          case TYPE_EXT_DISTANCE: //Distance sensor input
              obj.distance = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_ACC_MOTION: //Acc motion
              obj.accMotion = data[i + 1];
              i += 1;
              break;
          case TYPE_IR_TEMP: //IR temperature
              var iTemp = (data[i + 1] << 8) | data[i + 2];
              iTemp = bin16dec(iTemp);
              var eTemp = (data[i + 3] << 8) | data[i + 4];
              eTemp = bin16dec(eTemp);
              obj.irInternalTemperature = iTemp / 10;
              obj.irExternalTemperature = eTemp / 10;
              i += 4;
              break;
          case TYPE_OCCUPANCY: //Body occupancy
              obj.occupancy = data[i + 1];
              i += 1;
              break;
          case TYPE_WATERLEAK: //Water leak
              obj.waterleak = data[i + 1];
              i += 1;
              break;
          case TYPE_GRIDEYE: //Grideye data
              var ref = data[i + 1];
              i++;
              obj.grideye = [];
              for (var j = 0; j < 64; j++) {
                  obj.grideye[j] = ref + data[1 + i + j] / 10.0;
              }
              i += 64;
              break;
          case TYPE_PRESSURE: //External Pressure
              var temp =
                  (data[i + 1] << 24) |
                  (data[i + 2] << 16) |
                  (data[i + 3] << 8) |
                  data[i + 4];
              obj.pressure = temp / 1000;
              i += 4;
              break;
          case TYPE_SOUND: //Sound
              obj.soundPeak = data[i + 1];
              obj.soundAvg = data[i + 2];
              i += 2;
              break;
          case TYPE_PULSE2: //Pulse 2
              obj.pulse2 = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_PULSE2_ABS: //Pulse input 2 absolute value
              obj.pulseAbs2 =
                  (data[i + 1] << 24) |
                  (data[i + 2] << 16) |
                  (data[i + 3] << 8) |
                  data[i + 4];
              i += 4;
              break;
          case TYPE_ANALOG2: //Analog input 2
              obj.analog2 = (data[i + 1] << 8) | data[i + 2];
              i += 2;
              break;
          case TYPE_EXT_TEMP2: //External temp 2
              var temp = (data[i + 1] << 8) | data[i + 2];
              temp = bin16dec(temp);
              if (typeof obj.externalTemperature2 === "number") {
                  obj.externalTemperature2 = [obj.externalTemperature2];
              }
              if (typeof obj.externalTemperature2 === "object") {
                  obj.externalTemperature2.push(temp / 10);
              } else {
                  obj.externalTemperature2 = temp / 10;
              }
              i += 2;
              break;
          case TYPE_EXT_DIGITAL2: //Digital input 2
              obj.digital2 = data[i + 1];
              i += 1;
              break;
          case TYPE_EXT_ANALOG_UV: //Load cell analog uV
              obj.analogUv =
                  (data[i + 1] << 24) |
                  (data[i + 2] << 16) |
                  (data[i + 3] << 8) |
                  data[i + 4];
              i += 4;
              break;
          default: //something is wrong with data
              i = data.length;
              break;
      }
  }
  return obj;
}

//////////////////////////////////////////
//
// Settings Decoder
//
//////////////////////////////////////////
function DecodeSettings(bytes) {
  var SETTINGS_HEADER = 0x3e;


  var payload = {};
  var errors = []

  var i = 0;
  if (bytes[i] != SETTINGS_HEADER) {
      return ({
          error: "incorrect header " + bytes[i] + " expecting " + SETTINGS_HEADER
      });
  }
  i++;
  var size = bytes[i++];
  while (i < bytes.length) {
      var type = bytes[i++];

      var setting = settings.filter(function (s) {
          return s.type == type;
      });
      if (setting.length == 0) {
          errors.push("unknown setting type; " + type.toString(16) + " at offset " + i);
          continue;
      }
      setting = setting[0];
      var d = bytes.slice(i, i + setting.size);
      if (setting.parse == null) {
          payload[setting.name] = d;
      } else {
          payload[setting.name] = setting.parse(d);
      }
      i += setting.size;
  }

  if (errors.length > 0)
    payload['errors'] = errors;

  return payload
}



/////////////////////////////////
//
// Settings Payload Generator
//
/////////////////////////////////
function generateSettingPayload(setting, value) {
  var size = setting.size;
  var type = padStart(setting.type.toString(16), 2, '0').toUpperCase();
  if(setting.string) {
    var strd = padStart(value.length.toString(16), 2, '0').toUpperCase();
    for(var i = 0; i < str.length; i++) {
      strd += padStart(str.charCodeAt(i).toString(16), 2, '0').toUpperCase();
    }
    return [type+strd, strd];
  }

  if(size == 0) return [type, ''];
  var hexVal=''
  switch (setting.parse) {
    case uint:
      var val = parseInt(value);
      var hexVal = padStart(val.toString(16), 2 * size, '0').toUpperCase();
      break;        

    case hex:
      var val = parseInt(value);
      hexVal = padStart(value.toString(16), 2*size, '0').toUpperCase();
      break;

    case bool:
      hexVal = padStart((value)?"1":"0", 2*size, '0').toUpperCase();
      break; 
            
    default:
      // Don't know how to parse this, so just skip it
     return '';     
      
  }

  return type+hexVal;
}

////////////////////////////////////////
//
// Settings parsers
//
////////////////////////////////////////

function bool(a) {
  return a[0] ? "true" : "false";
}

function uint(a) {
  if (a.length == 1) return a[0];
  if (a.length == 2) return (a[0] << 8) | a[1];
  if (a.length == 4)
      return (a[0] << 24) | (a[1] << 16) | (a[2] << 8) | a[3];
  return a;
}

function hex(a) {
  return a.toString('hex')
}

function extcfg(a) {
  var cfg = a[0];
  switch (cfg) {
    case 0:
        return "Off/ Unknown";
    case 1:
        return "Analog";
    case 2:
        return "Pulse (pulldown)";
    case 3:
        return "Pulse (pullup)";
    case 4:
        return "Abs pulse (pulldown)";
    case 5:
        return "Abs pulse (pullup)";
    case 6:
        return "1-wire temp DS18B20";
    case 7:
        return "Switch NO";
    case 8:
        return "Switch NC";
    case 9:
        return "Digital";
    case 10:
        return "SRF-01";
    case 11:
        return "Decagon";
    case 12:
        return "Waterleak";
    case 13:
        return "Maxbotix ML738x";
    case 14:
        return "GPS";
    case 15:
        return "1-wire temp + Switch NO";
    case 16:
        return "Analog 0-3V";
    case 17:
        return "ADC module (pt1000)";
  }
  return a;
}

function sensor(a) {
  var t = a[0];
  switch (t) {
    default:
        return "Unknown";
    case 1:
        return "ESM5k";
    case 10:
        return "ELT1";
    case 11:
        return "ELT1HP";
    case 12:
        return "ELT2HP";
    case 13:
        return "ELT Lite";
    case 20:
        return "ERS";
    case 21:
        return "ERS CO2";
    case 22:
        return "ERS Lite";
    case 23:
        return "ERS Eye";
    case 24:
        return "ERS Desk";
    case 25:
        return "ERS Sound";
    case 30:
        return "EMS";
    case 31:
        return "EMS Door";
    case 32:
        return "EMS Desk";
    case 33:
        return "EMS Light";
    case 40:
        return "Taq";
    case 50:
        return "ERS15";
    case 51:
        return "ERS15 CO2";
    case 52:              
        return "ERS15 Lite";
    case 53:
        return "ERS15 Eye";
    case 55:
        return "ERS15 Sound";
    case 56:
        return "ERS15 TVOC";
    case 57:
        return "ERS15 CO2 Lite";
    case 60:
        return "ERS2";
    case 61:
        return "ERS2 CO2";
    case 62:              
        return "ERS2 Lite";
    case 63:
        return "ERS2 Eye";
    case 65:
        return "ERS2 Sound";
    case 66:
        return "ERS2 TVOC";
    case 67:
        return "ERS2 CO2 Lite";
    case 70:
        return "ECO";
    case 71:
        return "ECO Lite";
    case 80:
        return "EMS2";
    case 90:
        return "ETHd10";
    case 91:
        return "EIAQd10";
    case 92:
        return "EIAQdp10";
  }
}



////////////////////////////////////////
//
// Utility Encode Functions
//
////////////////////////////////////////
function padStart(val, len, pad) {
  var res = ""
  var padLen = len - val.length;
  for (i=0;i<padLen;i++) {
    res += pad
  }
  return res + val; 
}

function hexToBytes(hex) {
  var bytes = [];
  for (c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

////////////////////////////////////////////
//
// Map of Settings values.  This is shared
// with the settings decoder and the downlink
// generator
//
///////////////////////////////////////////
var settings = [
  { size: 16, type: 0x1,  name: "AppSKey",    parse: hex },
  { size: 16, type: 0x2,  name: "NwkSKey",    parse: hex },
  { size: 8,  type: 0x3,  name: "DevEUI",     parse: hex },
  { size: 8,  type: 0x4,  name: "AppEui",     parse: hex },
  { size: 16, type: 0x5,  name: "AppKey",     parse: hex },
  { size: 4,  type: 0x6,  name: "DevAddr",    parse: hex },

  { size: 1,  type: 0x7,  name: "OTA",        parse: bool },
  { size: 1,  type: 0x8,  name: "Port",       parse: uint },
  { size: 1,  type: 0x9,  name: "Mode",       parse: uint },
  { size: 1,  type: 0xa,  name: "Ack",        parse: bool },
  { size: 1,  type: 0xb,  name: "DrDef",      parse: uint },
  { size: 1,  type: 0xc,  name: "DrMax",      parse: uint },
  { size: 1,  type: 0xd,  name: "DrMin",      parse: uint },

  { size: 1,  type: 0xe,  name: "Class",      parse: uint },
  { size: 1,  type: 0xf,  name: "Power",      parse: uint },

  { size: 1,  type: 0x10, name: "ExtCfg",     parse: extcfg },
  { size: 1,  type: 0x11, name: "PirCfg",     parse: uint },
  { size: 1,  type: 0x12, name: "Co2Cfg",     parse: uint },
  { size: 4,  type: 0x13, name: "AccCfg",     parse: hex },
  { size: 4,  type: 0x14, name: "SplPer",     parse: uint },
  { size: 4,  type: 0x15, name: "TempPer",    parse: uint },
  { size: 4,  type: 0x16, name: "RhPer",      parse: uint },
  { size: 4,  type: 0x17, name: "LightPer",   parse: uint },
  { size: 4,  type: 0x18, name: "PirPer",     parse: uint },
  { size: 4,  type: 0x19, name: "Co2Per",     parse: uint },
  { size: 4,  type: 0x1a, name: "ExtPer",     parse: uint },
  { size: 4,  type: 0x1b, name: "ExtPwrTime", parse: uint },
  { size: 4,  type: 0x1c, name: "TriggTime",  parse: uint },
  { size: 4,  type: 0x1d, name: "AccPer",     parse: uint },
  { size: 4,  type: 0x1e, name: "VddPer",     parse: uint },
  { size: 4,  type: 0x1f, name: "SendPer",    parse: uint },

  { size: 4,  type: 0x20, name: "Lock",       parse: uint },
  { size: 4,  type: 0x21, name: "KeyWdg",     parse: uint },
  { size: 4,  type: 0x22, name: "Link",       parse: hex },
  { size: 4,  type: 0x23, name: "PressPer",   parse: uint },
  { size: 4,  type: 0x24, name: "SoundPer",   parse: uint },
  { size: 1,  type: 0x25, name: "Plan",       parse: uint },
  { size: 1,  type: 0x26, name: "SubBand",    parse: uint },
  { size: 1,  type: 0x27, name: "LBT",        parse: bool },
  { size: 1,  type: 0x28, name: "LedConfig",  parse: uint },
  { size: 1,  type: 0x29, name: "CO2Action",  parse: uint },

  { size: 1,  type: 0x2a, name: "WaterPer",   parse: uint },
  { size: 1,  type: 0x2b, name: "ReedPer",    parse: uint },
  { size: 1,  type: 0x2c, name: "ReedCfg",    parse: uint },
  { size: 1,  type: 0x2d, name: "PirSens",    parse: uint },
  { size: 1,  type: 0x2e, name: "QSize",      parse: uint },
  { size: 1,  type: 0x2f, name: "QOffset",    parse: uint },
  { size: 1,  type: 0x30, name: "QPurge",     parse: bool },
  { size: 2,  type: 0x31, name: "CO2Ref",     parse: uint },
  { size: 2,  type: 0x33, name: "CO2abc",     parse: uint },
  { size: 1,  type: 0x34, name: "PirSens2",   parse: uint },
  { size: 2,  type: 0x35, name: "OccSens",    parse: uint },
  
  { size: 4,  type: 0x37, name: "DispPer",    parse: uint },
  { size: 1,  type: 0x39, name: "DispUnit",   parse: uint },
  { size: 1,  type: 0x3a, name: "DispInv",    parse: bool },
  { size: 1,  type: 0x3b, name: "ASR",        parse: bool },
  { size: 1,  type: 0x3c, name: "DispFull",   parse: uint },
  { size: 1,  type: 0x3e, name: "DispLang",   parse: uint },
  { size: 4,  type: 0x3e, name: "LightComp",  parse: uint },

  { size: 4,  type: 0xf0, name: "Custom1",    parse: uint },
  { size: 4,  type: 0xf1, name: "Custom2",    parse: uint },
  { size: 4,  type: 0xf2, name: "Custom3",    parse: uint },
  { size: 4,  type: 0xf3, name: "Custom4",    parse: uint },
  
  { size: 1,  type: 0xf4, name: "NFCDisable", parse: bool },
  { size: 1,  type: 0xf5, name: "Sensor",     parse: sensor },
  { size: 1,  type: 0xf6, name: "Output",     parse: uint },
  { size: 1,  type: 0xf7, name: "Pulse1",     parse: uint },
  { size: 1,  type: 0xf8, name: "Pulse2",     parse: uint },
  { size: 1,  type: 0xf8, name: "Settings",   parse: uint },

  { size: 1,  type: 0xfa, name: "Ext/LED",    parse: hex },
  { size: 2,  type: 0xfb, name: "Version",    parse: uint },
  { size: 4,  type: 0xfc, name: "Sleep",      parse: null },
  { size: 0,  type: 0xfd, name: 'Generic',    parse: null, string: true},
  { size: 0,  type: 0xfe, name: "Reboot",     parse: bool },
];
