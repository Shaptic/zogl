zogl.zQuad = function(width, height) {
    this.poly = new zogl.zPolygon();
    this.size = {
        'w': width  || 0,
        'h': height || 0
    };
}

zogl.zQuad.prototype.clone = function() {
    var copy = new zogl.zQuad();
    copy.size = {
        'w': this.size.w,
        'h': this.size.h
    };
    copy.poly = this.poly.clone();
    return copy;
};

zogl.zQuad.prototype.create = function() {
    this.loadVerts();
    this.loadTexCoords();

    this.poly.drawData.colors = new Float32Array(
        this.poly.drawData.positions.length * 2
    );

    for (var i in this.poly.drawData.positions) {
        this.poly.drawData.colors[i*4]   = this.poly.color.r;
        this.poly.drawData.colors[i*4+1] = this.poly.color.g;
        this.poly.drawData.colors[i*4+2] = this.poly.color.b;
        this.poly.drawData.colors[i*4+3] = this.poly.color.a;
    }

    this.poly.drawData.indices = new Uint16Array([
        0, 1, 3, 3, 1, 2
    ]);

    this.poly.drawData.icount = 6;
    this.poly.drawData.vcount = this.poly.drawData.positions.length;
};

zogl.zQuad.prototype.resize = function(w, h) {
    this.size.w = w;
    this.size.h = h;

    if (this.poly.drawData.positions.length > 0 &&
        this.poly.verts.length > 0) {
        this.create();
    }
};

zogl.zQuad.prototype.loadVerts = function() {
    this.poly.drawData.positions = new Float32Array([
        0,              0,
        this.size.w,    0,
        this.size.w,    this.size.h,
        0,              this.size.h
    ]);
};

zogl.zQuad.prototype.loadTexCoords = function() {
    this.poly.drawData.texcoords = new Float32Array([
        0, 1,
        1, 1,
        1, 0,
        0, 0
    ]);
};

zogl.zQuad.prototype.draw = function(arg) {
    this.poly.draw(arg);
};


zogl.zQuad.prototype.attachTexture = function(texture) {
    this.poly.texture = texture
    this.setColor('#FFFFFF');
    if (!this.size.w || !this.size.h) {
        this.resize(texture.size.w, texture.size.h);
    }
};

zogl.zQuad.prototype.attachShader = function(shader) {
    this.poly.shader = shader;
};

zogl.zQuad.prototype.setColor = function() {
    this.poly.setColor.apply(this.poly, arguments);
};

zogl.zQuad.prototype.move = function(x, y) {
    this.poly.move(x, y);
};

zogl.zQuad.prototype.getX = function() {
    return this.poly.getX();
};

zogl.zQuad.prototype.getY = function() {
    return this.poly.getY();
};

zogl.zQuad.prototype.offload = function(vao, flags) {
    return this.poly.offload(vao, flags);
};

zogl.zQuad.prototype.prepareMaterial = function() {
    this.poly.prepareMaterial();
};

zogl.zQuad.prototype.getShader = function() {
    return this.poly.shader;
};

zogl.zQuad.prototype.setShader = function(s) {
    this.poly.setShader(s);
};
