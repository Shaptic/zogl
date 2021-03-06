// Ripped from
// http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
function isPowerOfTwo(x) {
    return (x & (x - 1)) == 0;
}

function nextHighestPowerOfTwo(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }
    return x + 1;
}

zogl.zTexture = function() {
    this.id = 0;
    this.filename = "";
    this.size = {
        'w': 0,
        'h': 0
    };
    this.attribs = {
        "loaded": false,
        "repeat": false
    };
    this.resetOnload();
};

zogl.zTexture.prototype.loadFromFile = function(filename) {
    this.loadFromRaw([255, 255, 255, 255], false, 1, 1);

    this.filename = filename;
    this.id.image = new Image();
    this.id.image.onload = this.callback;
    this.id.image.src = filename;
};

zogl.zTexture.prototype.loadFromRaw = function(data, flip_y, w, h) {
    this.filename = this.filename || "raw data";
    this.id = this.id || gl.createTexture();
    this.id.image = data;

    this.bind();

    if (flip_y) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    if (w && h) {
        if (data instanceof Array) data = new Uint8Array(data);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA,
                      gl.UNSIGNED_BYTE, data);
        this.size.w = w;
        this.size.h = h;

    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                      gl.UNSIGNED_BYTE, data);
        this.size.w = data.width;
        this.size.h = data.height;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    this.unbind();
};

zogl.zTexture.prototype.bind = function() {
    gl.bindTexture(gl.TEXTURE_2D, this.id);
};

zogl.zTexture.prototype.unbind = function() {
    gl.bindTexture(gl.TEXTURE_2D, null);
};

zogl.zTexture.prototype.setOnload = function(fn) {
    // If we're already loaded, there's no need to set a true callback,
    // just execute immediately.
    if (this.attribs.loaded) {
        fn();
    }

    // We still need to set it, though, for subsequent loads (if any).
    var tmp = this.callback;
    this.callback = function() {
        tmp();
        fn();
    }

    if (this.id.image !== undefined) {
        this.id.image.onload = this.callback();
    }
};

zogl.zTexture.prototype.resetOnload = function() {
    var that = this;
    this.callback = function(texture) {
        that.loadFromRaw(that.id.image, true);
        that.attribs.loaded = true;
    };
};

zogl.zTexture.prototype.setRepeating = function(flag) {
    if (this.attribs.repeat == flag) return;

    // Reload the texture as a Power-of-Two
    if (flag) {

        if (this.filename == "raw data") {
            throw("Can't POT raw textures.");
            return;
        }

        if (!isPowerOfTwo(this.id.image.width) ||
            !isPowerOfTwo(this.id.image.height)) {
            // Scale up the texture to the next highest power of two dimensions.
            var canvas = document.createElement("canvas");
            canvas.style.display = "hidden";
            canvas.width  = nextHighestPowerOfTwo(image.width);
            canvas.height = nextHighestPowerOfTwo(image.height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, image.width, image.height);
            image = canvas;
        }

        this.loadFromRaw(this.id.image);
        this.bind();
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        this.unbind();
    }
}
