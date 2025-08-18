//sfSig:{"sig": "3046022100ee03563441dd388900f0be5346c6f1d137e0fb8510ed37943d8ee10579ff7f77022100d14b2e174b9d0651a22e540e2f6bfc72fe722718b7e7f3f45434077f634b3e3c", "certPEM": "-----BEGIN CERTIFICATE-----$!$MIIDETCCAregAwIBAgIBATAKBggqhkjOPQQDAjBsMQswCQYDVQQGEwJVSzEfMB0G$!$A1UECgwWQ29uZmlndXJlZCBUaGluZ3MgTHRkLjENMAsGA1UECwwEY3R4ZDEOMAwG$!$A1UECwwFVXNlcnMxHTAbBgNVBAMMFGN0eGQtdXNlcnMtYWRtaW5zLWNhMB4XDTI0$!$MDgxNjE4MDkxN1oXDTM0MDgxNDE4MDkxN1owYDELMAkGA1UEBhMCVUsxHzAdBgNV$!$BAoMFkNvbmZpZ3VyZWQgVGhpbmdzIEx0ZC4xDTALBgNVBAsMBGN0eGQxDjAMBgNV$!$BAsMBVVzZXJzMREwDwYDVQQDDAhjdC1hZG1pbjBZMBMGByqGSM49AgEGCCqGSM49$!$AwEHA0IABAT8rSVBw5oFDMkdkfez3rM3Na8gSIb3SSlovkoA6T7J1vDueZyqrndI$!$aDbvQjKDYxT1p7DdsB7etGP3WDocEXOjggFUMIIBUDCBjgYIKwYBBQUHAQEEgYEw$!$fzBFBggrBgEFBQcwAoY5aHR0cDovL2N0eGQtdXNlcnMtYWRtaW5zLWNhLmN0eGQv$!$Y3R4ZC11c2Vycy1hZG1pbnMtY2EuY3J0MDYGCCsGAQUFBzABhipodHRwOi8vb2Nz$!$cC5jdHhkLXVzZXJzLWFkbWlucy1jYS5jdHhkOjkwODEwHwYDVR0jBBgwFoAUEu3Q$!$qtIP3h8krX5fHcLRiKhyIYIwDAYDVR0TAQH/BAIwADBKBgNVHR8EQzBBMD+gPaA7$!$hjlodHRwOi8vY3R4ZC11c2Vycy1hZG1pbnMtY2EuY3R4ZC9jdHhkLXVzZXJzLWFk$!$bWlucy1jYS5jcmwwEwYDVR0lBAwwCgYIKwYBBQUHAwIwDgYDVR0PAQH/BAQDAgeA$!$MB0GA1UdDgQWBBSqYd9d6yD2b9hzT37PD3ZoIe3D2DAKBggqhkjOPQQDAgNIADBF$!$AiEApvBDT8tEWIWefweWT1fcWZ/dt+jEUELDrxlZbqFrFE0CIHKsX7gB5bjq926w$!$SBRfgBLzqVIJl9m35EBBgmrSE5+3$!$-----END CERTIFICATE-----$!$", "description": "", "timestamp":"1755540137922", "timelimit":"0"}
//sfTimestamp:1755540137922
//sfLabel:/opt/ct/signing/files/Lora/DeviceProfiles/Dragino/LMDS200/Codec.js

//
// Chirpstack Codec function for Dragino LMDS200 Distance Sensor
//

function decodeUplink(input) {

    var fPort = input.fPort;
    var bytes = input.bytes;

    var bat;
    if(fPort == 2)
    {
      value = (bytes[0]<<8 | bytes[1]);
      bat = value/1000;
      value = (bytes[2]<<8 | bytes[3]);
      var dis1 = value;
      value = (bytes[4]<<8 | bytes[5]);
      var dis2 =value;
      var dalarm_count = (bytes[6]>>2)&0x3F;
      var distance_alarm = (bytes[6]>>1)&0x01;
      var inter_alarm = (bytes[6])&0x01;
      return {
        data: {
          Bat:bat,
          dis1:dis1,
          dis2:dis2,
          DALARM_count:dalarm_count,
          Distance_alarm:distance_alarm,
          Interrupt_alarm:inter_alarm
        }
      };
    }
    else if(fPort == 5)
    {
      var model="";
      if(bytes[0]==0x0C)
        model="LMDS200";
      var version=(bytes[1]<<8 | bytes[2]).toString(16);
      version = parseInt(version,10);
      var fre_band="";
      switch(bytes[3])
      {
        case 0x01:fre_band="EU868";break;
        case 0x02:fre_band="US915";break;
        case 0x03:fre_band="IN865";break;
        case 0x04:fre_band="AU915";break;
        case 0x05:fre_band="KZ865";break;
        case 0x06:fre_band="RU864";break;
        case 0x07:fre_band="AS923";break;
        case 0x08:fre_band="AS923-1";break;
        case 0x09:fre_band="AS923-2";break;
        case 0x0a:fre_band="AS923-3";break;
        case 0x0b:fre_band="CN470";break;
        case 0x0c:fre_band="EU433";break;
        case 0x0d:fre_band="KR920";break;
        case 0x0e:fre_band="MA869";break;
      }
      var sub_band = bytes[4];
      bat = (bytes[5]<<8 | bytes[6])/1000;
      
      return {
        status: {
          Sensor_model:model,
          Ver:version,
          Fre_band:fre_band,
          Sub_band:sub_band,
          Bat:bat
        }
      };
    }
    else if(fPort == 4)
    {
      var tdc = (bytes[0]<<16 | bytes[1]<<8 | bytes[2]);
      var atdc = (bytes[3]);
      var alarm_min = (bytes[4]<<8 | bytes[5]);
      var alarm_max = (bytes[6]<<8 | bytes[7]);
      var input = (bytes[8]);
      return {
        settings: {
          TDC:tdc,
          ATDC:atdc,
          Alarm_min:alarm_min,
          Alarm_max:alarm_max,
          Interrupt:input
        }
      };
    }
  }