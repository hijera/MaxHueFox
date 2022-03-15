# MaxHueFox<br>
 Max4Live Philips Hue Control (Ableton)
<br><br>
Code Based on that thread: https://cycling74.com/forums/controlling-philips-hue-using-jython-and-phue#reply-58ed2133c2991221d9cc792c
<br>and deeply improved: added Some new Controls and Node.js script for Entertainment API (with the help of node-phea library).


## Installation<br>
To make it work, You need Node.js and npm<br>
* Copy files to ~/Documents/Ableton/User Library/Presets/Instruments/Max Instrument/MaxHueFox

* open npm command line and run:

```
npm i phea 
```

* Open url http://<YOUR_HUE_BRIDGE>/debug/clip.html.

* Change url to "/api" , write down to body 
```
  {"devicetype":"YOUR_NEW_USERNAME", "generateclientkey":true}  
```
  where YOUR_NEW_USERNAME will be your script device name, for example "MaxHue". Now Press button on Philips Bridge device, and press "POST" on webpage.
  <br>
  You will get in command response something like that:
  <br>
 ```json
  [
      {
  "success":{ 
  "username":"myzFXhsLU5Wg10eBithGE-LFikgjC7Q7SEGZsoEf",
  "clientkey":"E3B550C65F78022EFD9E52E28378583"
  }
  }
  ]
 ```

* Now write down these parameters to "var options" in file MaxHueNode.js instead of "YOUR USERNAME" and "YOUR PSK KEY".
  Dont forget to change "address" parameter in options to your Hue Bridge ip address in internal network.
  So, now MaxHueFox.js code from string 18 should looks like:
```javascript
    var options = {
      "address": "192.168.1.130",
      "username": "myzFXhsLU5Wg10eBithGE-LFikgjC7Q7SEGZsoEf",
      "psk": "E3B550C65F78022EFD9E52E28378583",
      "colorUpdatesPerSecond ": 60,
      "dtlsUpdatesPerSecond ": 60
      }
```


Now you can start Ableton Live, select Max For Live -> Max Instruments -> MaxHueFox and drag and drop it on any midi track.

