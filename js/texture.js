zogl = zogl || {};

zogl.zTexture = function() {
    this.id = 0;
    this.filename = "";
    this.size = {
        'w': 0,
        'h': 0
    };
};

zogl.zTexture.prototype.loadFromFile = function(filename) {
    this.filename = filename;
    this.id = gl.createTexture();

    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([255, 255, 255, 255]));
    this.unbind();

    this.id.image = new Image();
    this.size.w = this.size.h = 1;

    var that = this;
    this.id.image.onload = function() {
        that.loadFromRaw(that.id.image, true);
    }

    this.id.image.src = filename;
};

zogl.zTexture.prototype.loadFromRaw = function(data, flip_y, w, h) {
    this.filename = "raw data";
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
        this.size.w = w; this.size.h = h;

    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                      gl.UNSIGNED_BYTE, data);
        this.size.w = data.width  || 1;
        this.size.h = data.height || 1;
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
