zogl.zSprite = function() {
    this.rect = {
        'x': 0,
        'y': 0,
        'w': 0,
        'h': 0
    }
    this.prims = [];
    this.passes = [];
    this.mv = mat4.create();
    this.position = vec3.create([0, 0, 0]);
    this.flags = {
        'blend': false
    }

    mat4.identity(this.mv);
};

zogl.zSprite.prototype.loadFromTexture = function(texture) {
    if (typeof texture == "string") {
        texture = new zogl.zTexture();
        texture.loadFromFile(texture);
    }

    this.rect.w = texture.size.w;
    this.rect.h = texture.size.h;

    var q = new zogl.zQuad(this.rect.w, this.rect.h);

    var tmp = texture.id.image.onload;
    var that = this;
    texture.id.image.onload = function() {
        tmp();
        q.resize(texture.size.w, texture.size.h);
        q.attachTexture(texture);
        q.create();
        that.prims = [];
        that.addObject(q, 0, 0);
        log('from callback', q.size);
    }
};

zogl.zSprite.prototype.addObject = function(obj, x, y) {
    var tmp = obj.clone();
    tmp.move(x || 0, y || 0);
    this.prims.push(tmp);
};

zogl.zSprite.prototype.move = function(x, y) {
    mat4.translate(this.mv, this.position);
    this.position = vec3.create([x, y, 0]);
};

zogl.zSprite.prototype.addPass = function(shader, options) {
    this.passes.push(shader);
};

zogl.zSprite.prototype.draw = function(ready) {
    if (this.passes.length == 0) {
        this._drawPrims(ready);
        return;
    }

    var wontwork = false;
    if (this.passes.length == 1) {
        for (var i in this.prims) {
            if (this.prims[i].getShader() == glGlobals.defaultShader) {
                this.prims[i].setShader(this.passes[0]);
            } else {
                wontwork = true;
            }
        }
    }

    if (!wontwork) {
        this._drawPrims(ready);
        return;
    }

    // We have some sort of custom shaders in the internal primitives.
    // This means that we need to RTT.

    // First, we need to calculate the total width of the internal
    // primitives. Since some are offset, real_size = offset + size.

    var mw = 0, mh = 0;
    for (var i in this.prims) {
        var w = this.prims[i].size.w + this.prims[i].getX();
        var h = this.prims[i].size.h + this.prims[i].getY();

        mw = mw > w ? mw : w;
        mh = mh > h ? mh : h;
    }

    var fbo1 = new zogl.zRenderTarget(mw, mh), fbo2 = null;
    var activeFBO = fbo1;
    if (this.passes.length > 1) {
        fbo2 = new zogl.zRenderTarget(mw, mh);
    }

    for (var j in this.passes) {
        activeFBO.bind();
        this.passes[j].bind();

        this._drawPrims();

        if (fbo2 !== null && fbo1 !== null) {
            if (activeFBO == fbo1) {
                activeFBO = fbo2;
            } else {
                activeFBO = fbo1;
            }
        }
    }

    glGlobals.defaultShader.unbind();

    var q = new zogl.zQuad();
    q.attachTexture(activeFBO.texture);
    q.create();
    q.draw();
};

zogl.zSprite.prototype.offload = function(vao, flags) {
    for (var i in this.prims) {
        this.prims[i].offload(vao, flags);
    }
};

zogl.zSprite.prototype._drawPrims = function(ready) {
    for (var i in this.prims) {
        var pos = [
            this.prims[i].getX(),
            this.prims[i].getY()
        ];

        if (this.flags.blend) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        this.prims[i].move(this.position[0] + pos[0],
                           this.position[1] + pos[1]);

        if (ready) {
            this.prims[i].prepareMaterial();
        }

        this.prims[i].draw(ready);
        this.prims[i].move(pos[0], pos[1]);

        if (this.flags.blend && !this.prims[i+1]) {
            gl.disable(gl.BLEND);
        }
    }
};
