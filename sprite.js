zogl = zogl || {};

zogl.zSprite = function() {
    this.rect = {
        'x': 0,
        'y': 0,
        'w': 0,
        'h': 0
    }
    this.prims = [];
    this.mv = mat4.create();
    this.position = vec3.create([0, 0, 0]);
    this.flags = {
        'blend': false
    }

    mat4.identity(this.mv);
};

zogl.zSprite.prototype.loadFromTexture = function(texture) {
    this.rect.w = texture.size.w;
    this.rect.h = texture.size.h;

    var q = new zogl.zQuad(this.rect.w, this.rect.h);
    q.attachTexture(texture);
    q.create();

    this.prims = [];
    this.addObject(q, 0, 0);
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

zogl.zSprite.prototype.draw = function(ready) {
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

        if (ready) { this.prims[i].prepare(); }

        this.prims[i].draw(ready);
        this.prims[i].move(pos[0], pos[1]);

        if (this.flags.blend && !this.prims[i+1]) {
            gl.disable(gl.BLEND);
        }
    }
};

zogl.zSprite.prototype.offload = function(vao, flags) {
    for (var i in this.prims) {
        this.prims[i].offload(vao, flags);
    }
};
