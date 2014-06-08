zogl.zSprite = function() {
    this.rect = new zogl.rect();
    this.prims = [];
    this.passes = [];
    this.mv = mat4.create();
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
    var that = this;
    texture.setOnload(function() {
        q.resize(texture.size.w, texture.size.h);
        q.attachTexture(texture);
        q.create();
        that.prims = [];
        that.addObject(q, 0, 0);
    });
};

zogl.zSprite.prototype.addObject = function(obj, x, y) {
    var tmp = obj.clone();
    tmp.move(x || 0, y || 0);
    this.prims.push(tmp);

    log(this.rect);

    this.rect.w = Math.max(this.rect.w, obj.calcWidth()  + x);
    this.rect.h = Math.max(this.rect.h, obj.calcHeight() + y);

    log(this.rect);
};

zogl.zSprite.prototype.move = function(x, y) {
    mat4.translate(this.mv, vec3.create(x, y, 0));
    this.rect.x = x; this.rect.y = y;
};

zogl.zSprite.prototype.addPass = function(shader) {
    this.passes.push(shader);
};

zogl.zSprite.prototype.draw = function(ready) {
    if (this.passes.length == 0) {
        this._drawPrims(ready);
        return;
    }

    var wontwork = true;
    if (this.passes.length == 1) {
        for (var i in this.prims) {
            if (this.prims[i].getShader() == undefined ||
                this.prims[i].getShader() == glGlobals.defaultShader ||
                this.prims[i].getShader() == this.passes[0]) {
                this.prims[i].setShader(this.passes[0]);
                wontwork = false;
            } else {
                wontwork = true;
                break;
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

    var old_fbo = glGlobals.activeRenderTarget;
    var fbo1 = new zogl.zRenderTarget(mw, mh), fbo2 = null;
    var activeFBO = fbo1;
    if (this.passes.length > 1) {
        fbo2 = new zogl.zRenderTarget(mw, mh);
    }

    // Draw once to a texture.
    fbo1.bind();
    this._drawPrims(ready);

    // Load that texture into geometry.
    var final_texture = fbo1.texture;
    var q = new zogl.zQuad(mw, mh);
    q.create();

    /*
     * Do the pass in a ping-pong on that texture, swapping w/ each pass.
     *
     * i = 0:
     *  Texture #1 is bound, FBO #2 is bound. Result is in texture #2.
     *
     * i = 1:
     *  Texture #2 (result from last) is bound, FBO #1 is bound.
     *  Result is in texture #1.
     *
     * i = 2:
     *  Texture #1 is bound, FBO #2 is bound. Result is in texture #2.
     *
     * i = n:
     *  Texture #1 is bound if i is even.
     *  FBO #2     is bound if i is even.
     *  Result     is in #2 if i is even.
     *
     */

    for (var j in this.passes) {
        // swap (ping-pong technique)
        var even = !((j & 0x01) == 0);

        if (j+1 < this.passes.length) {
            if (even) fbo2.bind();
            else      fbo1.bind();

        // on the last pass, we draw directly to the screen, though.
        } else {
            glGlobals.activeRenderTarget.unbind();
            if (old_fbo) {
                old_fbo.bind();
            }
        }

        q.attachTexture(final_texture);
        q.draw(false, this.passes[j]);

        final_texture = even ? fbo2.texture : fbo1.texture;
    }
};

zogl.zSprite.prototype.offload = function(vao, flags) {
    for (var i in this.prims) {
        this.prims[i].offload(vao, flags);
    }
};

zogl.zSprite.prototype._drawPrims = function(ready, shader) {
    for (var i in this.prims) {
        var pos = [
            this.prims[i].getX(),
            this.prims[i].getY()
        ];

        if (this.flags.blend) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        }

        this.prims[i].move(this.getX() + pos[0],
                           this.getY() + pos[1]);

        if (shader !== undefined) {
            shader.bind();
            this.prims[i].getTexture().bind();
        } else if (ready) {
            this.prims[i].prepareMaterial();
        }

        this.prims[i].draw(ready, shader);
        this.prims[i].move(pos[0], pos[1]);

        if (this.flags.blend && !this.prims[i+1]) {
            gl.disable(gl.BLEND);
        }
    }
};

zogl.zSprite.prototype.collides = function(x, y) {
    if (x instanceof zogl.rect) {
        return this.rect.collideRect(x);
    } else if (x instanceof zogl.zSprite) {
        return this.rect.collideRect(x.rect);
    }

    return this.rect.collidePosition(x, y);
};

zogl.zSprite.prototype.getX = function() {
    return this.rect.x;
};

zogl.zSprite.prototype.getY = function() {
    return this.rect.y;
};
