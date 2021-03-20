# MaxHueFox<br>
 Max4Live Philips Hue Control (Ableton)
<br><br>
Code Based on that thread: https://cycling74.com/forums/controlling-philips-hue-using-jython-and-phue#reply-58ed2133c2991221d9cc792c
<br>and deeply improved: added Some new Controls and Node.js script for Entertainment API (with the help of node-phea library).


## Installation<br>
To make it work, You need Node.js and npm<br>
Copy files to ~/Documents/Ableton/User Library/Presets/Instruments/Max Instrument/MaxHueFox
open npm command line and run:
<br>
<code>
npm i phea 
</code>
<br>
* Open url http://<YOUR_HUE_BRIDGE>/debug/clip.html.
<br>
* Change url to "/api" , write down to body 
<code>
  {"devicetype":"YOUR_NEW_USERNAME", "generateclientkey":true}  
</code>
  where YOUR_NEW_USERNAME will be your script device name, for example "MaxHue". Now Press button on Philips Bridge device, and press "POST" on webpage.
  <br>
  You will get in command response something like that:
  <br>
  <code>
  [
      {
  "success":{ 
  "username":"myzFXhsLU5Wg10eBithGE-LFikgjC7Q7SEGZsoEf",
  "clientkey":"E3B550C65F78022EFD9E52E28378583"
  }
  }
  ]
  </code>
  <br>
  Now write down these parameters to "var options" in file MaxHueNode.js instead of "YOUR USERNAME" and "YOUR PSK KEY".
<br>


Now you can start Ableton Live, select Max For Live -> Max Instruments -> MaxHueFox and drag and drop it on any midi track.

