var zogl = zogl || {};

zogl.zShader = function() {
    this.vs_fn = "";
    this.fs_fn = "";
    this.errorstr = "";

    this.vs = null;
    this.fs = null;
    this.program = null;
    this.uniforms = {};
}

zogl.zShader.prototype.loadFromString = function(vsstr, fsstr) {
    this.vs = this.loadFromStr(vsstr, gl.VERTEX_SHADER);
    this.fs = this.loadFromStr(fsstr, gl.FRAGMENT_SHADER);

    if (!this.vs || !this.fs) return false;

    this.vs_fn = 'vs_fromstr';
    this.fs_fn = 'fs_fromstr';

    return this.createProgram();
}

zogl.zShader.prototype.loadFromNode = function(vs_id, fs_id) {
    this.vs = this.loadFromID(vs_id, gl.VERTEX_SHADER);
    this.fs = this.loadFromID(fs_id, gl.FRAGMENT_SHADER);

    if (!this.vs || !this.fs) return false;

    this.vs_fn = vs_id;
    this.fs_fn = fs_id;

    return this.createProgram();
}

zogl.zShader.prototype.createProgram = function() {
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        this.errorstr = "Error occured when linking shaders.";
        return false;
    }

    return true;
};

zogl.zShader.prototype.getParameterLocation = function(name) {
    if (!(name in this.uniforms)) {
        this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }

    return this.uniforms[name];
};

zogl.zShader.prototype.getAttributeLocation = function(name) {
    return gl.getAttribLocation(this.program, name);
}

zogl.zShader.prototype.loadFromStr = function(str, type) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        this.errorstr = gl.getShaderInfoLog(shader);
        return null;
    }

    return shader;
}

zogl.zShader.prototype.loadFromID = function(id, type) {
    var node = document.getElementById(id);
    if (!node) return null;

    var str = "";
    var k = node.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }

        k = k.nextSibling;
    }

    return this.loadFromStr(str, type);
};

zogl.zShader.prototype.setParameter = function(name, value) {
    gl.uniformMatrix4fv(this.getParameterLocation(name), false, value);
};

zogl.zShader.prototype.setTexture = function(name, id) {
    gl.activeTexture(gl.TEXTURE0 + id);
    gl.uniform1i(this.getParameterLocation(name), id);
};

zogl.zShader.prototype.bind = function() {
    gl.useProgram(this.program);
    glGlobals.activeShader = this;
}
