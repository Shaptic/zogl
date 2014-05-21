zogl = zogl || {};

zogl.zBufferSet = function(type) {
    this.buffers = {};
    this.type = type || gl.STATIC_DRAW;
};

zogl.zBufferSet.prototype.addData = function(data) {
    this.addPositions(data.positions);
    this.addIndices(data.indices);
    this.addColors(data.colors);
    this.addTexCoords(data.texcoords);
    return this.buffers.positions.size - data.positions.length;
}

zogl.zBufferSet.prototype.addPositions = function(data) {
    if (!data || !data.length) return;

    if (!('positions' in this.buffers)) {
        this.buffers.positions = new zogl.zBuffer(gl.ARRAY_BUFFER, this.type);
    }

    this.buffers.positions.addData(data, 2);
    this.buffers.positions.setAttribute("in_vert");
};

zogl.zBufferSet.prototype.addIndices = function(data) {
    if (!data || !data.length) return;

    if (!('posIndex' in this.buffers)) {
        this.buffers.posIndex = new zogl.zBuffer(gl.ELEMENT_ARRAY_BUFFER, this.type);
    }

    this.buffers.posIndex.addData(data, 1);
};

zogl.zBufferSet.prototype.addColors = function(data) {
    if (!data || !data.length) return;

    if (!('colors' in this.buffers)) {
        this.buffers.colors = new zogl.zBuffer(gl.ARRAY_BUFFER, this.type);
    }

    this.buffers.colors.addData(data, 4);
    this.buffers.colors.setAttribute("in_color");
};

zogl.zBufferSet.prototype.addTexCoords = function(data) {
    if (!data || !data.length) return;

    if (!('texcoords' in this.buffers)) {
        this.buffers.texcoords = new zogl.zBuffer(gl.ARRAY_BUFFER, this.type);
    }

    this.buffers.texcoords.addData(data, 2);
    this.buffers.texcoords.setAttribute("in_texc");
};

zogl.zBufferSet.prototype.bind = function() {
    for (var i in this.buffers) {
        this.buffers[i].prepare();
    }
};

zogl.zBufferSet.prototype.unbind = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

zogl.zBufferSet.prototype.draw = function() {
    for (var i in this.buffers) {
        this.buffers[i].prepare();
    }

    if ('posIndex' in this.buffers) {
        gl.drawElements(gl.TRIANGLES, this.buffers.posIndex.size,
                        gl.UNSIGNED_SHORT, 0);

    } else if ('positions' in this.buffers) {
        gl.drawArrays(gl.TRIANGLES, 0, this.buffers.positions.size /
                                       this.buffers.positions.numItems);
    }

    this.unbind();
};