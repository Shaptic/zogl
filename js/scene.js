zogl.zScene = function(w, h, options) {
    options = options || {};

    this.size = {
        'w': w || glGlobals.activeWindow.size.w,
        'h': h || glGlobals.activeWindow.size.h
    };

    this.geometryVAO = new zogl.zBufferSet(gl.DYNAMIC_DRAW);
    this.fbo1 = new zogl.zRenderTarget();
    this.fbo2 = new zogl.zRenderTarget();

    this.lights  = [];
    this.postfx  = [];
    this.objects = [];

    this.fullscreen = new zogl.zBufferSet();
    this.fullscreen.addIndices(new Uint16Array([
        0, 1, 3, 3, 1, 2
    ]));
    this.fullscreen.addPositions(new Float32Array([
        0,              0,
        this.size.w,    0,
        this.size.w,    this.size.h,
        0,              this.size.h
    ]));
    this.fullscreen.addColors(new Float32Array([
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1
    ]));
    this.fullscreen.addTexCoords(new Float32Array([
        0, 1,
        1, 1,
        1, 0,
        0, 0
    ]));
    this.fullscreen.offload();

    this.flags = {
        'lighting':         options.lighting        || false,
        'postProcessing':   options.postprocessing  || false,
        'blendThrough':     options.blendThrough    || false
    };
};

zogl.zScene.prototype.draw = function(color) {
    var color = new zogl.color4(color || [0.1, 0.1, 0.1, 1.0]);

    if (this.flags.blendThrough) {
        color.a = 0.0;
    }

    this.fbo2.bind(); this.fbo2.clear(color);
    this.fbo1.bind(); this.fbo1.clear(color);

    glGlobals.defaultShader.bind();
    for (var i in this.objects) {
        this.objects[i].offload(this.geometryVAO, { 'preserve': false });
    }

    this.geometryVAO.offload();
    this.geometryVAO.bind();

    for (var i in this.objects) {
        this.objects[i].draw(true);
    }

    var tx = this.fbo1.texture;

    if (this.flags.lighting) {
        this.fbo2.bind();
        tx.bind();
        gl.blendFunc(gl.ONE, gl.ONE);

        for (var i in this.lights) {
            this.lights[i].enable();
            this.fullscreen.draw();
            this.lights[i].disable();
        }

        tx = this.fbo2.texture;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    this.fbo1.unbind();

    var id = mat4.create();
    mat4.identity(id);

    tx.bind();
    glGlobals.defaultShader.bind();
    glGlobals.defaultShader.setParameterMat("proj", this.fbo1.proj);
    glGlobals.defaultShader.setParameterMat("mv",   id);

    this.fullscreen.draw();

    tx.unbind();
    glGlobals.defaultShader.unbind();
};

zogl.zScene.prototype.addObject = function(type, args) {
    type = type || zogl.zSprite;
    var z = new type(args);
    this.objects.push(z);
    return z;
};

zogl.zScene.prototype.removeObject = function(obj) {
    for (var i = this.objects.length - 1; i >= 0; --i) {
        if (this.objects[i] === obj) {
            this.objects.splice(i, 1);
            return;
        }
    }
};

zogl.zScene.prototype.addLight = function(type) {
    var z = new zogl.zLight(type);
    this.lights.push(z);
    return z;
};
