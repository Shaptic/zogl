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

    this.fullscreen = new zogl.zQuad(this.size.w, this.size.h);
    this.fullscreen.attachTexture(this.fbo1.texture);
    this.fullscreen.create();
    //this.fullscreen.offload(this.geometryVAO, { 'preserve': false });

    this.flags = {
        'lighting':         options.lighting        || false,
        'postProcessing':   options.postprocessing  || false,
        'blendThrough':     options.blendThrough    || false
    };
};

zogl.zScene.prototype.draw = function(color) {
    var color = color || new zogl.color4('#FFFFFF');

    if (this.flags.blendThrough) {
        color.a = 0.0;
    }

    gl.clearColor(color.r, color.g, color.b, color.a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i in this.objects) {
        this.objects[i].offload(this.geometryVAO, { 'preserve': false });
    }
    this.geometryVAO.offload();

    this.geometryVAO.bind();
    for (var i in this.objects) {
        this.objects[i].draw(true);
    }

    this.fbo1.unbind();
    this.fullscreen.draw();
};

zogl.zScene.prototype.addObject = function() {
    var z = new zogl.zSprite();
    this.objects.push(z);
    return z;
};

zogl.zScene.prototype.addLight = function(type) {
    var z = new zogl.zLight(type);
    this.lights.push(z);
    return l;
};