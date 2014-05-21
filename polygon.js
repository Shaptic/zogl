zogl = zogl || {};

zogl.zPolygon = function() {
    this.vao = null;
    this.internal = false;
    this.mv = mat4.create();

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

    this.shader  = glGlobals.defaultShader;
    this.texture = glGlobals.defaultTexture;
};

zogl.zPolygon.prototype.clone = function() {
    var copy = new zogl.zPolygon();

    copy.drawData = {
        'positions':    new Float32Array(this.drawData.positions),
        'indices':      new Uint16Array (this.drawData.indices),
        'colors':       new Float32Array(this.drawData.colors),
        'texcoords':    new Float32Array(this.drawData.texcoords),
        'icount':       this.drawData.icount || 0,
        'vcount':       this.drawData.vcount || 0,
    };

    copy.x = this.x; copy.y = this.y;
    copy.shader = this.shader;
    copy.texture = this.texture;
    copy.verts = new Array(this.verts);
    copy.color = new zogl.color4(this.color);

    if (this.internal) {
        copy.internal   = true;
        copy.vao        = new zogl.zBufferSet();
        copy.offset     = copy.vao.addData(copy.drawData);
        copy.internal   = true;
        copy.mv         = mat4.create();

        mat4.identity(copy.mv);
        mat4.translate(copy.mv, [copy.x, copy.y, 0]);
    }

    return copy;
};

zogl.zPolygon.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

zogl.zPolygon.prototype.addVertex = function(x, y) {
    this.verts.push(x);
    this.verts.push(y);
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

zogl.zPolygon.prototype.draw = function(ready) {
    var ready = ready || false;

    if (this.vao === null && !ready) {
        this.vao = new zogl.zBufferSet();
        this.offset = this.vao.addData(this.drawData);
        this.internal = true;
    }

    if (!ready) {
        this.vao.bind();
        this.texture.bind();
        this.shader.bind();
        this.shader.setParameter("mv", this.mv);
        this.shader.setParameter("proj", glGlobals.proj);
    }

    mat4.identity(this.mv);
    mat4.translate(this.mv, [this.x, this.y, 0]);
    glGlobals.activeShader.setParameter("mv", this.mv);

    gl.drawElements(gl.TRIANGLES, this.drawData.icount,
                    gl.UNSIGNED_SHORT, this.offset);
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

    var i = vao.addData(this.drawData);
    if (flags !== undefined && !flags.preserve) {
        this.drawData.icount = this.drawData.indices.length;
        this.drawData.vcount = this.drawData.positions.length;

        delete this.drawData.positions;
        delete this.drawData.indices;
        delete this.drawData.colors;
        delete this.drawData.texcoords;

        this.drawData.positions = this.drawData.indices =
        this.drawData.colors    = this.drawData.texcoords = [];

        this.offset = i;
        this.vao = vao;
    }
};

zogl.zPolygon.prototype.prepare = function() {
    this.shader.bind();
    this.texture.bind();
};
