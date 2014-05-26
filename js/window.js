zogl.zWindow = function(w, h) {
    this.size = {
        'w': w || gl.viewportWidth,
        'h': h || gl.viewportHeight
    };
    this.proj = mat4.create();
}

zogl.zWindow.prototype.init = function() {
    this.resize(this.size.w, this.size.h);
    glGlobals.activeWindow = this;
};

zogl.zWindow.prototype.resize = function(w, h) {
    this.size = { 'w': w, 'h': h };

    glGlobals.canvas.width  = w;
    glGlobals.canvas.height = h;

    gl.viewportWidth  = w;
    gl.viewportHeight = h;

    gl.viewport(0, 0, w, h);
    mat4.ortho(0, w, h, 0, 1.0, 10.0, this.proj);
    glGlobals.proj = this.proj;

    this.refresh();
};

zogl.zWindow.prototype.refresh = function() {
    delete glGlobals.defaultShader;
    delete glGlobals.defaultTexture;

    s = new zogl.zShader();
    s.loadFromString(zogl.SHADERS.defaultvs,
                     zogl.SHADERS.defaultfs);

    s.bind();
    s.setParameter("proj", glGlobals.proj);
    s.setParameter("mv", glGlobals.mv);

    t = new zogl.zTexture();
    t.loadFromRaw([255, 255, 255, 255], false, 1, 1);

    glGlobals.defaultShader  = s;
    glGlobals.defaultTexture = t;
};

zogl.zWindow.prototype.clear = function(color) {
    color = color || new zogl.color4('#000000');

    // http://stackoverflow.com/questions/3362471
    if (!(color instanceof zogl.color4)) {
        var TempObj = function(){};
        TempObj.prototype = zogl.color4.prototype;
        var tmp = new TempObj;
        color = zogl.color4.apply(tmp, arguments);
        if (!(Object(color) === color)) {
            color = tmp;
        }
    }

    gl.clearColor(color.r, color.g, color.b, color.a);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

zogl.zWindow.prototype.loop = function(fn) {
    requestAnimationFrame(fn);
};
