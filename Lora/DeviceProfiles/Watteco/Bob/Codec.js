//sfSig:{"sig": "3045022100a6f23b9a65802b623df06f3f6932e38dee4374fa006d92a3b22fb35a61a12ee9022041d09c1bb9e116e5b6c7bde4a5ff726fc8b8f359e34df8acde19e3e6d4469dd9", "certPEM": "-----BEGIN CERTIFICATE-----$!$MIIDETCCAregAwIBAgIBATAKBggqhkjOPQQDAjBsMQswCQYDVQQGEwJVSzEfMB0G$!$A1UECgwWQ29uZmlndXJlZCBUaGluZ3MgTHRkLjENMAsGA1UECwwEY3R4ZDEOMAwG$!$A1UECwwFVXNlcnMxHTAbBgNVBAMMFGN0eGQtdXNlcnMtYWRtaW5zLWNhMB4XDTI0$!$MDgxNjE4MDkxN1oXDTM0MDgxNDE4MDkxN1owYDELMAkGA1UEBhMCVUsxHzAdBgNV$!$BAoMFkNvbmZpZ3VyZWQgVGhpbmdzIEx0ZC4xDTALBgNVBAsMBGN0eGQxDjAMBgNV$!$BAsMBVVzZXJzMREwDwYDVQQDDAhjdC1hZG1pbjBZMBMGByqGSM49AgEGCCqGSM49$!$AwEHA0IABAT8rSVBw5oFDMkdkfez3rM3Na8gSIb3SSlovkoA6T7J1vDueZyqrndI$!$aDbvQjKDYxT1p7DdsB7etGP3WDocEXOjggFUMIIBUDCBjgYIKwYBBQUHAQEEgYEw$!$fzBFBggrBgEFBQcwAoY5aHR0cDovL2N0eGQtdXNlcnMtYWRtaW5zLWNhLmN0eGQv$!$Y3R4ZC11c2Vycy1hZG1pbnMtY2EuY3J0MDYGCCsGAQUFBzABhipodHRwOi8vb2Nz$!$cC5jdHhkLXVzZXJzLWFkbWlucy1jYS5jdHhkOjkwODEwHwYDVR0jBBgwFoAUEu3Q$!$qtIP3h8krX5fHcLRiKhyIYIwDAYDVR0TAQH/BAIwADBKBgNVHR8EQzBBMD+gPaA7$!$hjlodHRwOi8vY3R4ZC11c2Vycy1hZG1pbnMtY2EuY3R4ZC9jdHhkLXVzZXJzLWFk$!$bWlucy1jYS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDgYDVR0PAQH/BAQDAgeA$!$MB0GA1UdDgQWBBSqYd9d6yD2b9hzT37PD3ZoIe3D2DAKBggqhkjOPQQDAgNIADBF$!$AiEApvBDT8tEWIWefweWT1fcWZ/dt+jEUELDrxlZbqFrFE0CIHKsX7gB5bjq926w$!$SBRfgBLzqVIJl9m35EBBgmrSE5+3$!$-----END CERTIFICATE-----$!$", "description": "", "timestamp":"1755536435744", "timelimit":"0"}
//sfTimestamp:1755536435744
//sfLabel:/opt/ct/signing/files/Lora/DeviceProfiles/Watteco/Bob/Codec.js

//
// Chirpstack Codec function for Watteco BoB vibration monitor
//

function decodeUplink(input) {
  return {data: Decode(input.fPort, input.bytes, input.variables)}
}

function Decode(fPort, bytes, variables) {

  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = {};

  var decodedBatch = {};

  var date = new Date();
  var lDate = date.toISOString();
    
    
  if (fPort === 1){
    decodedBatch = !(bytes[0] & 0x01);

    stdData = {};
    tab = [];
    header = {};

    fft = [];


    // Report Type
    if (bytes[0] === 0x72 || bytes[0] === 0x52) {

      if (bytes[6] <= 0x3b ) {  // 0x3B = 59 in decimal that corresponds to a reportperiod <= 59 min
        reportperiod = bytes[6];
      } 

      if (bytes[6] > 0x3b) {
        reportperiod = (bytes[6]-59)*60;
      }

      operatingtime = bytes[2]*reportperiod/127;     
      
      header = {type: "Report", sensor: "KX"};

      tab.push({label: "BatteryPercentage", value: bytes[17]*100/127, date: lDate});
      tab.push({label: "AnomalyLevel", value: bytes[1]*100/127, date: lDate});
      tab.push({label: "AnomalyLevelTo20Last6Mo", value: bytes[24], date: lDate});
      tab.push({label: "NbAlarmReport", value: bytes[4], date: lDate});
      tab.push({label: "OperatingTime", value: bytes[2]*2/127, date: lDate});
      tab.push({label: "TotalUnknown6080", value: (operatingtime - bytes[3]*operatingtime/127)*bytes[15]/127, date: lDate});
      tab.push({label: "TotalUnknown4060", value: (operatingtime - bytes[3]*operatingtime/127)*bytes[14]/127, date: lDate});
      tab.push({label: "TotalUnknown2040", value: (operatingtime - bytes[3]*operatingtime/127)*bytes[13]/127, date: lDate});
      tab.push({label: "AnomalyLevelTo80Last30D", value: bytes[23], date: lDate});
      tab.push({label: "VibrationLevel", value: (bytes[8]*128+bytes[9]+bytes[10]/100)/10/121.45, date: lDate});
      tab.push({label: "TotalUnknown1020", value: (operatingtime - bytes[3]*operatingtime/127), date: lDate});
      tab.push({label: "AnomalyLevelTo80Last6Mo", value: bytes[26], date: lDate});
      tab.push({label: "AnomalyLevelTo50Last24H", value: bytes[19], date: lDate});
      tab.push({label: "AnomalyLevelTo20Last24H", value: bytes[18], date: lDate});
      tab.push({label: "AnomalyLevelTo50Last30D", value: bytes[22], date: lDate}); 
      tab.push({label: "Temperature", value: bytes[5] - 30, date: lDate});
      tab.push({label: "ReportLength", value: reportperiod, date: lDate});
      tab.push({label: "AnomalyLevelTo20Last30D", value: bytes[21], date: lDate});
      tab.push({label: "PeakFrequencyIndex", value: bytes[11]+1, date: lDate});
      tab.push({label: "TotalUnknown80100", value: (operatingtime - bytes[3]*operatingtime/127)*bytes[16]/127, date: lDate});
      tab.push({label: "TotalOperatingTimeKnown", value:bytes[3]*operatingtime/127, date: lDate});
      tab.push({label: "AnomalyLevelTo50Last6Mo", value: bytes[25], date: lDate});
      tab.push({label: "AnomalyLevelTo80Last24H", value: bytes[20], date: lDate});
    }


    // Alarm Type
    if (bytes[0] === 0x61) {
      vibrationlevel = (bytes[4]*128+bytes[5]+bytes[6]/100)/10/121.45;

      header = {type: "Alarm", sensor: "KX"};


      tab.push({label: "Temperature", value: bytes[2]-30, date: lDate});
      tab.push({label: "VibrationLevel", value: (bytes[4]*128+bytes[5]+bytes[6]/100)/10/121.45, date: lDate});
      tab.push({label: "AnomalyLevel", value: bytes[1]*100/127, date:lDate });

      for(i=8; i<= 39; i++) {
        fft.push({label: "fft"+(i-7), value: bytes[i]*vibrationlevel/127, date: lDate});
      }
      decoded.fft = fft;
    }
        
    
    // Learning Type
    if (bytes[0] === 0x6c) {
      var FREQ_SAMPLING_ACC_LF = 800;
      var FREQ_SAMPLING_ACC_HF = 25600;

      vibrationlevel = (bytes[2]*128+bytes[3]+bytes[4]/100)/10/121.45;

      header = {type: "Learning", sensor: "KX"};


      tab.push({label : "Temperature", value: bytes[6]-30, date: lDate});
      tab.push({label: "LearningFromScratch", value: bytes[7], date: lDate});
      tab.push({label: "LearningPercentage", value: bytes[1], date: lDate});
      tab.push({label: "VibrationLevel", value: vibrationlevel, date: lDate});
      tab.push({label: "PeakFrequencyIndex", value: bytes[5]+1, date: lDate});
      tab.push({label: "PeakFrequency", value: (bytes[5]+1)*FREQ_SAMPLING_ACC_LF/256, date: lDate});
      
      for(i=8; i<=39; i++ ) {
        fft.push({label: "fft"+(i-7), value: bytes[i]*vibrationlevel/127, date: lDate});
      }
      decoded.fft = fft;  

    }


    // State Type
    if(bytes[0] === 0x53) {
      var state;

      header = {type: "State", sensor: "KX"};


      if (bytes[1] === 100) {
        state = "Sensor start";
      }
      if (bytes[1] === 101) {
        state = "Sensor stop";
      }
      if(bytes[1] === 125) {
        state = "Machine stop"
      }
      if(bytes[1] === 126) {
        state = "Machine start"
      }

      tab.push({label: "State", value: state, date: lDate});
      tab.push({label: "BatteryPercentage", value: bytes[2]*100/127, date: lDate});

    }
                
    decoded.data = tab;
    decoded.header = header;

    return decoded;
  }
}