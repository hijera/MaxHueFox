const maxAPI = require('max-api');
const http = require('http');

class PBridge
{
    constructor(options)
    {
        this.bridge=  Phea.bridge(options);
    }
    getBridge()
    {
        return this.bridge;

    }
}


var options = {
    "address": "YOUR ADDRESS OF HUE BRIDGE",
    "username": "YOUR USERNAME",
    "psk": "YOUR PSK KEY",
    "colorUpdatesPerSecond ": 60,
    "dtlsUpdatesPerSecond ": 60
}

const Phea = require('phea');
var bridge=null;
const bridgeObj=new PBridge(options);
var groups=[];
//let bridges = Phea.discover();


var running=false;
var entertainment_mode=0;
var check_interval=null;
var interval=1000;
var lightid=0;
var r=150;
var newInterval=null
var g=150;
var b=150;
//let groups = await bridge.getGroup(0); // 0 will fetch all groups.
let eid=0;
//console.log(groups);

function list(v)
{

}
var activeGroup=null;

async function stopStream()
{ let bridge = await Phea.bridge(options);
    let groups = await filter_entertainment(await bridge.getGroup(0));
    let disable_stream={stream:{active:false}};
    groups.forEach(async (group)=>{
        if (group) {
            let active = group.stream.active;
            let id=group.key;
            if (bridge && group.stream && active ) {
                let url='http://'+options.address+'/api/'+options.username+'/groups/'+id;
                let host=options.address;
                let path='/api/'+options.username+'/groups/'+id;
               await sendData(host,path,
                    disable_stream);
            }
        }
    })
}
function readystatechange_parsejson()
{
    if (this.readyState ==4){
//		post(this.responseText);

    }
}

async function sendData(host,path,body)
{
    let data=JSON.stringify(body);
    let ajaxreq = http.request({
       host: host,
       port:80,
        path: path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    },function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            maxAPI.post('Response: ' + chunk);
    });
    });
    ajaxreq.write(data);
    ajaxreq.end();
    maxAPI.post('sended');
}

async function getEntertainmentGroups()
{let bridge = await Phea.bridge(options);
    let groups = await filter_entertainment(await bridge.getGroup(0)); // 0 will fetch all groups.
   return groups;
}
async function getGroups()
{  let bridge = await Phea.bridge(options);
    let groups = await bridge.getGroup(0); // 0 will fetch all groups.
    return  groups;
}
function filter_entertainment(groups)
{
    let r_arr=[];
    for (const [key, value] of Object.entries(groups)) {
        if (value.lights && value.lights.length>0 && value.type==='Entertainment')
        {
            value.key=key;
            r_arr.push(value);
        }
    }
    return  r_arr;
}

async function reset()
 {
    // var bridge = await Phea.bridge(options);
   //  var groups=await getEntertainmentGroups();
   //  await   bridge.start(groups[0].key);
//    resetTimeout();

}

function resetTimeout()
{
        check_interval=setInterval(reset(),5000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startStream()
{
    bridge = await Phea.bridge(options);
 groups=await getEntertainmentGroups();
// if (groups[0].stream.active)
// {
    await stopStream();
    maxAPI.post('stop stream');
// }
   await sleep(2000);
      await   bridge.start(groups[0].key);

      maxAPI.post('start stream');
}
async  function streamColor()
{

    groups=await getEntertainmentGroups();
let group=groups[0];
if (group)
{
let active=group.stream.active;
//
    if (bridge &&  group.stream &&  active && entertainment_mode) {

       await bridge.transition(lightid, [r, g, b], interval);
    }
}
if (newInterval)
{
    interval=newInterval;
    newInterval=null;
}
    await setTimeout(streamColor,interval);

}
async function sendColor(obj,tran)
{

}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function CtoRGB(h) {
    maxAPI.post(h);
    let rgbc=HSVtoRGB(h/64.0,1,1);
    r = parseInt(rgbc.r);
    g = parseInt(rgbc.g);
    b = parseInt(rgbc.b);
    maxAPI.post('r'+rgbc.r);
    maxAPI.post('g'+rgbc.g);
    maxAPI.post('b'+rgbc.b);
}


maxAPI.addHandlers({
    setState: (key, value) => {
        if (entertainment_mode)
        {
            resetTimeout();
            state[key] = Math.round(value);
        }
    },
    setHue: (c) => {
      CtoRGB(c);
    },
    setColor: (ro,go,bo) => {



//            maxAPI.post('stream color'+c);
//            resetTimeout();
            r=parseInt(255*ro);
            g=parseInt(255*go);
            b=parseInt(255*bo);

    },
    setTransition: async (tran) => {
    newInterval=tran*30;
    },
    setLightId: async (id) => {
      lightid=id;
    },
    setEntMode: async (mode) => {
        let prev_mode=entertainment_mode;

        if (prev_mode==0 && mode==1)
        {
           await startStream();

        }
        if (prev_mode==1 && mode==0)
        {
            await stopStream();
        }
        entertainment_mode=mode;
        console.log('ent_mode'+entertainment_mode);
    }
});

//startStream();
streamColor();
maxAPI.outlet(0,entertainment_mode);
maxAPI.outlet(1,entertainment_mode);