//autowatch = 1;
outlets = 5;
inlets = 14;
 
var ajaxreq;
var	ip = "192.168.1.130";
var	key = "z5jjB4qneEEwvocqYO40pLgaN995fdHR4gQkDvyZ" //"Max4LiveMax4Hue"; // username

var bulb_id; // 2
var bri_filter = 100 // 3 (Filter in %)
var tran = 0 // 4
var hard_mode = 0 // 5
var scaler = 1	// 6
var group = 0 // 7
var alerto = 0; //8
var chue = 0; // 9
var slider_hue = 0; //10
var slider_sat = 0; //11
var slider_bri = 0; //12
var ent_mode_on = 0; //13

function msg_int(v){


	//assign inlets with if statements
	if (!ent_mode_on)
	{
		if (inlet==0) {
			var hue = v*900*scaler;
			if(hue > 65280) hue = 65280;
			set_light('hue', hue); // tone
			CtoRGB(hue);
		}
		if (inlet==1){
			if(hard_mode == 1 && v == 0) return false;
			bri = Math.round(((v*2) / 100) * bri_filter);
			outlet(0,bri);

			set_light('bri',bri); // velocity to bri (42-255)
			
		}
		
		if(inlet==2){
			bulb_id = v;
		}
		

		if(inlet==3){
			// Bri Filter
			bri_filter = v;
		}	
		
		if(inlet==4){
			tran = Math.round(Math.exp(0.04246951*v));
			//set_light('transitiontime', tran);
		}
		
		if(inlet==5){
			hard_mode = v;
		}	
		if (inlet==6)
		{
			scaler= v;
		}
		if (inlet===7)
		{
			group = v;
		}
		if (inlet===8)
		{
			alerto = v;
			set_light('alert','select');
		}
		if (inlet===9)
		{
			var chue = v*scaler;
			if(chue > 65280) chue = 65280;
			set_light('hue', chue); // tone
			
		}
		if (inlet===10)
		{
			var slider_hue=Math.floor(v/64.0*65280);
					if(slider_hue > 65280) slider_hue = 65280;
			set_light('hue', slider_hue); // tone
			CtoRGB(slider_hue);
		}
		if (inlet===11)
		{
			var slider_sat=v;
			set_light('sat', slider_sat); 
		}
			if (inlet===12)
		{
			var slider_bri=v;
			set_light('bri', slider_bri); 
		}
		//register_user();
	}
	if (inlet===14)
	{
		ent_mode_on=v;
		
	}
}

	
function register_user(){

	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("POST",'http://' + ip + '/api');
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	ajaxreq.send('{"devicetype":"'+ key +'","username":"'+ key +'"}');
	console.log('user registered');

}

function get_lights(){
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("GET",'http://' + ip + '/api/' + key +'/lights');
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	ajaxreq.send();
}

function get_groups(){
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("GET",'http://' + ip + '/api/' + key +'/groups');
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	ajaxreq.send();
}
	
 	
 
function on(state)
{
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("PUT",'http://' + ip + '/api/' + key +'/lights/' + bulb_id + '/state');
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	if (state == 1)
		ajaxreq.send('{"on": true}');
	if (state == 0)
		ajaxreq.send('{"on": false}');
}
 
function set_light(cmd, value){
		if (!ent_mode_on)
		{	
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("PUT",_SetUrl(cmd,value));
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	// {"on":true, "sat":255, "bri":255,"hue":10000}
	
	
	ajaxreq.send('{"'+cmd+'": '+value+',"transitiontime": '+tran+'}');
		}
}

function set_light_hsv( h,s,v){
		if (!ent_mode_on)
		{		
	ajaxreq = new XMLHttpRequest();
	ajaxreq.open("PUT",_SetUrl(h,h));
	ajaxreq.onreadystatechange = readystatechange_parsejson;
	// {"on":true, "sat":255, "bri":255,"hue":10000}
	
	var jsend='{"hue": '+h+',"sat":'+s+',"bri":'+v+',"transitiontime": '+tran+'}';

	ajaxreq.send(jsend);
		}
}


function _SetUrl(cmd,value)
{
	if (group)
	{
		return 'http://' + ip + '/api/' + key +'/groups/' + 1 + '/action';		
	}
	else
		return 'http://' + ip + '/api/' + key +'/lights/' + bulb_id + '/state';
	
}

function readystatechange_parsejson()
{
	if (this.readyState ==4){
//		post(this.responseText);

	}
}
function CtoRGB(h) {
	var rgbc=HSVtoRGB(h/65535,1,1);
  var r = rgbc.r/255.0;
  var g = rgbc.g/255.0;
  var b = rgbc.b/255.0;
  outlet(1,r);
  outlet(2,g);
  outlet(3,b);
  outlet(4,1);
}

function list(a) {

	if (!ent_mode_on)
	{
	if (inlet===9)
	{


		var div = 255;
	var div_float= div*1.0;
//  post("the list contains", arguments.length, "elements")
  //post(JSON.stringify(arguments));
  		var hdata=rgb2hsv(Math.floor(arguments[0]*255),Math.floor(arguments[1]*255),Math.floor(arguments[2]*255));

		var nhue=hdata.h*192;
		var nsat=hdata.s*2.54;
		var nbri=hdata.v*2.54;
		if (nsat>254) nsat=254;
		if (nsat<1) nsat=1;
		if (nbri>254) nbri=254;
		if (nbri<1) nbri=1;
				if(nhue > 65280) nhue = 65280;
		set_light_hsv(Math.floor(nhue),Math.floor(nsat),Math.floor(nbri)); // tone
	}
	}
}

function rgb2xyz(rgbR, rgbG, rgbB) {

	const [ lrgbR, lrgbB, lrgbG ] = [ rgbR, rgbG, rgbB ].map(

		function(v) { return v > 4.045 ? pow((v + 5.5) / 105.5, 2.4) * 100 : v / 12.92 }

	);

	const [ xyzX, xyzY, xyzZ ] = matrix([ lrgbR, lrgbB, lrgbG ], [

		[0.4124564, 0.3575761, 0.1804375],

		[0.2126729, 0.7151522, 0.0721750],

		[0.0193339, 0.1191920, 0.9503041]

	]);

	return [ xyzX, xyzY, xyzZ ];

}

/**

* @func xyz2rgb

* @desc Return an XYZ color from an RGB color

* @param {Number} x - Chromaticity of X

* @param {Number} y - Chromaticity of Y

* @param {Number} z - Chromaticity of Z

* @return {ArrayRGB}

* @example

* xyz2rgb(41.25, 21.27, 1.93) // => [100, 0, 0]

* @link https://www.w3.org/TR/css-color-4/#rgb-to-lab

* @link https://www.w3.org/TR/css-color-4/#color-conversion-code

*/

function xyz2rgb(xyzX, xyzY, xyzZ) {

	const [ lrgbR, lrgbB, lrgbG ] = matrix([ xyzX, xyzY, xyzZ ], [

		[ 3.2404542, -1.5371385, -0.4985314],

		[-0.9692660,  1.8760108,  0.0415560],

		[ 0.0556434, -0.2040259,  1.0572252]

	]);

	const [ rgbR, rgbG, rgbB ] = [ lrgbR, lrgbB, lrgbG ].map(

		function(v) {
			return (v > 0.31308 ) ? (1.055 * Math.pow(v / 100, 1 / 2.4) * 100 - 5.5) : (12.92 * v) 
			} 

	);

	return [ rgbR, rgbG, rgbB ];
}



function matrix(params, mats) {
	return mats.map(
		function (mat)  { return mat.reduce(
			// (acc, value, index) => acc + params[index] * value,
			function (acc, value, index) { acc + params[index] * precision * (value * precision) / precision / precision },
			0
		);
		}
	);
}

function rgb2hsv (r, g, b) {
	var rabs, gabs, babs, rr, gg,  bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = function (c)  { return (v - c) / 6 / diff + 1 / 2; }
    percentRoundFn = function (num)  { return Math.round(num * 100) / 100; } 
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
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
