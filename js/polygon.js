zogl.zPolygon = function() {
    this.vao = null;
    this.internal = false;
    this.mv = mat4.create();
    mat4.identity(this.mv);

    this.drawData = {
        'positions':    [],
        'indices':      [],
        'colors':       [],
        'texcoords':    []
    };

    this.verts = [];
    this.color = new zogl.color4('#FFFFFF');

    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.shader  = glGlobals.defaultShader;
    this.texture = glGlobals.defaultTexture;

    this.size = {
        'w': 0,
        'h': 0
    };
};

zogl.zPolygon.prototype.clone = function() {
    var copy = new this.constructor();

    copy.drawData = {
        'positions':    new Float32Array(this.drawData.positions),
        'indices':      new Uint16Array (this.drawData.indices),
        'colors':       new Float32Array(this.drawData.colors),
        'texcoords':    new Float32Array(this.drawData.texcoords),
        'icount':       this.drawData.icount || 0,
        'vcount':       this.drawData.vcount || 0,
    };

    copy.x      = this.x;
    copy.y      = this.y;
    copy.shader = this.shader;
    copy.texture= this.texture;
    copy.verts  = this.verts.slice(0);
    copy.color  = new zogl.color4(this.color);
    copy.offset = 0;
    copy.size   = {
        'w': this.calcWidth(),
        'h': this.calcHeight()
    }

    mat4.translate(copy.mv, [copy.x, copy.y, 0]);

    return copy;
};

zogl.zPolygon.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

zogl.zPolygon.prototype.rotate = function(rads) {
    this.angle = rads;
};

zogl.zPolygon.prototype.addVertex = function(x, y) {
    this.verts.push(x);
    this.verts.push(y);

    this.size = {
        'w': this.calcWidth(),
        'h': this.calcHeight()
    };
};

zogl.zPolygon.prototype.create = function() {
    if (this.verts.length <= 2) return false;

    if (!this.drawData.indices.length) {
        var tris = ((this.verts.length / 2) - 2) * 3;
        var indices = new Uint16Array(tris);

        for (var i = 0; i < tris; i += 3) {
            var x = i / 3;

            indices[i] = 0;
            indices[i+1] = x + 1;
            indices[i+2] = x + 2;
        }

        this.drawData.indices = indices;
        this.drawData.icount = indices.length;
    }

    this.drawData.texcoords = new Float32Array(this.verts.length);
    this.drawData.positions = new Float32Array(this.verts.length);
    this.drawData.colors    = new Float32Array(2 * this.verts.length);

    for (var i in this.verts) {
        this.drawData.colors[i*4]   = this.color.r;
        this.drawData.colors[i*4+1] = this.color.g;
        this.drawData.colors[i*4+2] = this.color.b;
        this.drawData.colors[i*4+3] = this.color.a;

        this.drawData.positions[i] = this.verts[i];
        this.drawData.texcoords[i] = 0;
    }

    this.drawData.vcount = this.verts.length;
    this.verts = [];
    return true;
};

zogl.zPolygon.prototype.draw = function(ready, shader) {
    var ready = ready || false;

    if (!ready) {
        if (this.vao === null) {
            this.vao = new zogl.zBufferSet();
            this.offset = this.vao.addData(this.drawData);
            this.vao.offload();
            this.internal = true;
        }

        this.vao.bind();
        this.prepareMaterial();

        if (shader !== undefined) {
            shader.bind();
        }
    }

    mat4.identity(this.mv);
    mat4.translate(this.mv, [this.x, this.y, 0]);
    mat4.rotate(this.mv, this.angle, [0, 0, 1]);

    glGlobals.activeShader.setParameterMat("mv", this.mv);
    glGlobals.activeShader.setParameterMat("proj", glGlobals.proj);

    gl.drawElements(gl.TRIANGLES, this.drawData.icount,
                    gl.UNSIGNED_SHORT, (new Uint16Array).BYTES_PER_ELEMENT * this.offset);
};

zogl.zPolygon.prototype.setColor = function(col) {
    this.color.set.apply(this.color, arguments);
};

zogl.zPolygon.prototype.getX = function() {
    return this.x;
};

zogl.zPolygon.prototype.getY = function() {
    return this.y;
};

zogl.zPolygon.prototype.offload = function(vao, flags) {
    if (this.drawData.positions.length == 0) {
        return;
    }

    this.offset = vao.addData(this.drawData);
    this.vao = vao;

    if (flags && flags.preserve == false) {
        delete this.drawData.positions;
        delete this.drawData.indices;
        delete this.drawData.colors;
        delete this.drawData.texcoords;

        this.drawData.positions = this.drawData.indices =
        this.drawData.colors    = this.drawData.texcoords = [];
    }
};

zogl.zPolygon.prototype.prepareMaterial = function() {
    this.getShader().bind();
    this.texture.bind();
};

zogl.zPolygon.prototype.getShader = function() {
    return this.shader;
};

zogl.zPolygon.prototype.setShader = function(s) {
    this.shader = s;
};

zogl.zPolygon.setColor = function(col) {
    this.color = new color4(col);
}

zogl.zPolygon.prototype.getTexture = function() {
    return this.texture;
};

zogl.zPolygon.prototype.calcWidth = function() {
    var set = this.verts.length == 0 ? this.drawData.positions : this.verts;

    var mw = 0;
    for (var i = 0; i < set.length; i += 2) {
        mw = Math.max(mw, set[i]);
    }
    this.size.w = mw;
    return mw;
};

zogl.zPolygon.prototype.calcHeight = function() {
    var set = this.verts.length == 0 ? this.drawData.positions : this.verts;

    var mh = 0;
    for (var i = 1; i < set.length; i += 2) {
        mh = Math.max(mh, set[i]);
    }
    this.size.h = mh;
    return mh;
};
