/**
 * PixelNode_Driver_DMX
 * 
 * Pixel Driver for DMX
 * 
 * --------------------------------------------------------------------------------------------------------------------
 * 
 * @author Amely Kling <mail@dwi.sk>
 *
 */


/* Includes
 * ==================================================================================================================== */

var dmxlib = new require('dmxnet');
var util = require("util");
var colors = require('colors');


/* Class Constructor
 * ==================================================================================================================== */

// extending PixelNode_Driver
PixelNode_Driver = require('pixelnode-driver');

// define the Student class
function PixelNode_Driver_DMX(options,pixelData) {
  var self = this;
  PixelNode_Driver_DMX.super_.call(self, options, pixelData);
  this.className = "PixelNode_Driver_DMX";
}

// class inheritance 
util.inherits(PixelNode_Driver_DMX, PixelNode_Driver);

// module export
module.exports = PixelNode_Driver_DMX;


/* Variables
 * ==================================================================================================================== */

PixelNode_Driver_DMX.prototype.default_options = {
	pixelColorCorrection: false,
	offset: true,
	dimmer: 1,
	ip: '192.168.3.20',
	startUniverse: 0,
	universes: 16
};
PixelNode_Driver_DMX.prototype.sender = [];


/* Overriden Methods
 * ==================================================================================================================== */

 // init driver
PixelNode_Driver_DMX.prototype.init = function() {
	var self = this;
	console.log("Init PixelDriver DMX at".grey, this.options.ip);

	// Create new dmxnet instance
	this.dmxnet = new dmxlib.dmxnet({
	  verbose: 0,
	});
	
	for (var i = this.options.startUniverse; i < this.options.universes; i++) {
		console.log("Init PixelDriver DMX universe".grey, i);
		// Create new Sender instance
		var sender = this.dmxnet.newSender({
		  ip: this.options.ip,
		  subnet: 0,
		  universe: i,
		  net: 0,
		});
		this.sender[i] = sender;
	}


	// start painter on connect
		self.startPainter.call(self);

};

// set's a pixel via DMX client
PixelNode_Driver_DMX.prototype.setPixel = function(universe, id, r,g,b) {
	if (this.sender[universe] && this.sender[universe].socket_ready && id*3 +2 < 512) {
		this.sender[universe].prepChannel(id * 3 + 0, r * this.options.dimmer);
		this.sender[universe].prepChannel(id * 3 + 1, g * this.options.dimmer);
		this.sender[universe].prepChannel(id * 3 + 2, b * this.options.dimmer);
	}
}

// tells DMX client to write pixels
PixelNode_Driver_DMX.prototype.sendPixels = function() {
	for (var i = this.options.startUniverse; i < this.options.universes; i++) {
		if (this.sender[i] && this.sender[i].socket_ready) {
			this.sender[i].transmit();
		}
	}
}
