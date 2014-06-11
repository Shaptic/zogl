zogl.zQuad = function(width, height) {
    zogl.zPolygon.call(this);
}
zogl.zQuad.prototype = new zogl.zPolygon();
zogl.zQuad.prototype.constructor = zogl.zQuad;

zogl.zQuad.prototype.create = function() {
    this.loadVerts();
    this.loadTexCoords();

    this.drawData.colors = new Float32Array(
        this.drawData.positions.length * 2
    );

    for (var i in this.drawData.positions) {
        this.drawData.colors[i*4]   = this.color.r;
        this.drawData.colors[i*4+1] = this.color.g;
        this.drawData.colors[i*4+2] = this.color.b;
        this.drawData.colors[i*4+3] = this.color.a;
    }

    this.drawData.indices = new Uint16Array([
        0, 1, 3, 3, 1, 2
    ]);

    this.drawData.icount = 6;
    this.drawData.vcount = this.drawData.positions.length;
};

zogl.zQuad.prototype.resize = function(w, h) {
    this.size.w = w;
    this.size.h = h;

    if (this.drawData.positions.length > 0 &&
        this.verts.length > 0) {
        this.create();
    }
};

zogl.zQuad.prototype.loadVerts = function() {
    this.drawData.positions = new Float32Array([
        0,              0,
        this.size.w,    0,
        this.size.w,    this.size.h,
        0,              this.size.h
    ]);
};

zogl.zQuad.prototype.loadTexCoords = function() {
    this.drawData.texcoords = new Float32Array([
        0, 1,
        1, 1,
        1, 0,
        0, 0
    ]);
};

zogl.zQuad.prototype.attachTexture = function(texture) {
    this.texture = texture;
    this.setColor('#FFFFFF');
    if (!this.size.w || !this.size.h) {
        this.resize(texture.size.w, texture.size.h);
    }
};
