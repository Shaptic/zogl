zogl = zogl || {};

zogl.zBuffer = function(buffertype, drawtype, type) {
    this.bufferType = buffertype;
    this.drawType   = drawtype || gl.STATIC_DRAW;
    this.attribute  = null;
    this.size       = 0;
    this.itemSize   = 0;
    this.dataType   = type || Float32Array;
    this.data       = [];
    this.buffer     = gl.createBuffer();
};


zogl.zBuffer.prototype.addData = function(bufferdata, eachElem) {
    if (this.size) {
        throw('.offload() has been called, you can no longer add data to this buffer.')
        return false;
    }

    var offset = this.data.length;

    // we are adding data
    if (this.data.length > 0) {
        var copy = new this.dataType(this.data.length + bufferdata.length);

        for (var i in this.data) {
            copy[i] = this.data[i];
        }

        for(var i = 0; i < bufferdata.length; ++i) {
            copy[i + offset] = bufferdata[i];
        }

        this.data = copy;

    // first batch of data
    } else {
        this.data = bufferdata;
    }

    this.itemSize = eachElem;
    return offset;
};

zogl.zBuffer.prototype.offload = function() {
    if (!this.data || !this.data.length) return;

    this.bind();
    gl.bufferData(this.bufferType, this.data, this.drawType);
    this.size = this.data.length;
    this.data = [];
    this.unbind();
};

zogl.zBuffer.prototype.setAttribute = function(name) {
    this.attribute = glGlobals.activeShader.getAttributeLocation(name);
};

zogl.zBuffer.prototype.bind = function() {
    gl.bindBuffer(this.bufferType, this.buffer);
};

zogl.zBuffer.prototype.unbind = function() {
    gl.bindBuffer(this.bufferType, null);
};

zogl.zBuffer.prototype.prepare = function() {
    this.bind();
    if (this.attribute !== null) {
        gl.enableVertexAttribArray(this.attribute);
        gl.vertexAttribPointer(this.attribute, this.itemSize,
                               gl.FLOAT, false, 0, 0);
    }
};
