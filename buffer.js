zogl = zogl || {};

zogl.zBuffer = function(buffertype, drawtype) {
    this.bufferType = buffertype;
    this.drawType   = drawtype || gl.STATIC_DRAW;
    this.attribute  = null;
    this.size       = 0;
    this.itemSize   = 0;

    this.buffer = gl.createBuffer();
};

zogl.zBuffer.prototype.addData = function(bufferdata, eachElem) {
    this.bind();
    gl.bufferData(this.bufferType, bufferdata, this.drawType);
    this.size = bufferdata.length;
    this.itemSize = eachElem;
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
