gl = null;
glGlobals = {};
zogl = {};

function sum(list) {
    var s = 0;
    for (var i in list) {
        s += parseFloat(list[i]);
    }
    return s;
};

zogl.rad = function(deg) {
    return deg * Math.PI / 180.0;
};

zogl.deg = function(rad) {
    return rad * 180.0 / Math.PI;
};

zogl.getMousePosition = function(evt) {
    var rect = glGlobals.canvas.getBoundingClientRect();
    return {
        x:  evt.clientX - rect.left,
        y:  evt.clientY - rect.top,
    }
};

/**
 * Accepts lots of formats for color values:
 *
 *  new color4([r, g, b, a]);   // list of components
 *  new color4('#FFFFFF');      // hex RGB
 *  new color4('#FFFFFF00');    // hex RGBA
 *
 **/
zogl.color4 = function(clr) {
    this.set(clr);
};

zogl.color4.prototype.asHex = function() {
    return '#' + (
        (this.r * 255) << 24 ^
        (this.g * 255) << 16 ^
        (this.b * 255) << 8  ^
        (this.a * 255)
    ).toString(16);
};

zogl.color4.prototype.asRGBA = function() {
    return [
        this.r * 255,
        this.g * 255,
        this.b * 255,
        this.a * 255
    ];
}

zogl.color4.prototype.asGL = function() {
    return new Float32Array([
        this.r,
        this.g,
        this.b,
        this.a
    ]);
};

zogl.color4.prototype.set = function() {

    // if the first arg is an array, we assume that
    // we were given an array of args instead of varargs
    // so we treat [0] as the varargs.
    var args = arguments;
    if (arguments[0] instanceof Array) {
        args = arguments[0];
    }

    // rgb or rgba components
    if (args.length >= 3) {

        // smartly detect whether we are in the
        // [0, 1] or [0, 255] range.
        if (sum(args) <= 4) {
            this.r = args[0];
            this.g = args[1];
            this.b = args[2];
            this.a = args[3] || 1;

        } else {
            this.r = args[0] / 255;
            this.g = args[1] / 255;
            this.b = args[2] / 255;
            this.a = (args[3] / 255) || 1;
        }

    // hex string
    // todo: rgba support
    } else if (args.length == 1 && typeof args[0] == "string") {
        if (args[0][0] == '#') args[0] = args[0].slice(1);

        var hex = parseInt(args[0], 16);
        this.r = (hex >> 16 & 255) / 255;
        this.g = (hex >> 8  & 255) / 255;
        this.b = (hex       & 255) / 255;
        this.a = 1;

    // copy the color
    } else if (args.length == 1 && args[0] instanceof zogl.color4) {
        this.r = args[0].r;
        this.b = args[0].g;
        this.b = args[0].b;
        this.a = args[0].a || 1;

    // args are shit
    } else {
        log('incompatible');
        throw('incompatible');
    }
}

function log() {
    for(var i in arguments) {
        console.log(arguments[i]);
    }
}

zogl.onGLError = function(err, funcName, args) {
    var str = "";
    for (var i in args) {
        str += args[i] + ", ";
    }

    log('An error occured calling "gl.' + funcName +
        "(" + str.slice(0, -2) + ')": ' + err);
};

/*
 * @param   canvas  The canvas object for which we will create a WebGL context
 * @return  `true`  if a WebGL context could be created,
 *          `false` otherwise.
 */
zogl.init = function(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");

        if (zogl.debug) {
            gl = WebGLDebugUtils.makeDebugContext(gl, zogl.onGLError);
        }
    } catch (e) {
    }

    if (!gl) {
        alert('WebGL is not supported!');
        return false;
    }

    gl.viewportWidth    = canvas.width;
    gl.viewportHeight   = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);

    glGlobals.mv    = mat4.create();
    glGlobals.proj  = mat4.create();
    glGlobals.canvas= canvas;

    mat4.identity(glGlobals.mv);
    mat4.ortho(0, canvas.width, canvas.height, 0, 1.0, 10.0, glGlobals.proj);

    return true;
};

zogl.loadScript = function(filename, callback) {
    var node    = document.createElement("script");
    node.type   = "text/javascript";
    node.src    = "js/" + filename;
    node.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(node);
};
