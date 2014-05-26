zogl.LightType = {
    'NO_LIGHT': -1,
    'AMBIENT':   0,
    'POINT':     1,
    'SPOT':      2
};

zogl.DefaultLightingConfig = {
    'attenuation':  new Float32Array([0.05, 0.01, 0.0]),
    'brightness':     1.0,
    'max_angle':     45.0,
    'min_angle':    -45.0,
    'color':        new zogl.color4('#FFFFFF').asGL(),
    'position':     new Float32Array([0.0, 0.0, 0.0])
};

zogl.zLight = function(type, config) {
    config = config || zogl.DefaultLightingConfig;

    this.type = type || zogl.LightType.AMBIENT;
    this.config = {
        'brightness':   config.brightness || zogl.DefaultLightingConfig.brightness,
        'attenuation':  config.brightness || zogl.DefaultLightingConfig.attenuation,
        'position':     config.brightness || zogl.DefaultLightingConfig.position,
        'color':        config.brightness || zogl.DefaultLightingConfig.color,
        'max_angle':    config.brightness || zogl.DefaultLightingConfig.max_angle,
        'min_angle':    config.brightness || zogl.DefaultLightingConfig.min_angle
    };

    var fragstr = zogl.SHADERS.defaultfs;

    if (this.type == zogl.LightType.AMBIENT) {
        fragstr = zogl.SHADERS.ambientLightFS;

    } else if (this.type == zogl.LightType.POINT) {
        fragstr = zogl.SHADERS.pointLightFS;

    } else if (this.type == zogl.LightType.SPOT) {
        fragstr = zogl.SHADERS.spotLightFS;
    }

    this.shader = new zogl.zShader();
    this.shader.loadFromString(zogl.SHADERS.defaultvs, fragstr);
    this.update();
};

zogl.zLight.prototype.setBrightness = function(brightness) {
    this.config.brightness = brightness;
};

zogl.zLight.prototype.setColor = function(col) {
    this.config.color = col.asGL();
};

zogl.zLight.prototype.setAttenuation = function(constant, linear, quadratic) {
    this.config.attenuation = new Float32Array([constant, linear, quadratic]);
};

zogl.zLight.prototype.setPosition = function(x, y) {
    this.config.position = new Float32Array([x, y, 1]);
};

// TODO: Vector rotation not just value setting.

zogl.zLight.prototype.setMaxAngle = function(degrees) {
    this.config.max_angle = zogl.rad(degrees);
};

zogl.zLight.prototype.setMinAngle = function(degrees) {
    this.config.max_angle = zogl.rad(degrees);
};

zogl.zLight.prototype.update = function() {
    this.enable();
    this.shader.setParameter('light_col', this.config.color,        gl.uniform3fv);
    this.shader.setParameter('light_pos', this.config.position,     gl.uniform3fv);
    this.shader.setParameter('light_att', this.config.attenuation,  gl.uniform3fv);
    this.shader.setParameter('light_brt', this.config.brightness,   gl.uniform1fv);
    this.shader.setParameter('light_max', this.config.max_angle,    gl.uniform1fv);
    this.shader.setParameter('light_min', this.config.min_angle,    gl.uniform1fv);

    this.shader.setParameter('scr_height', glGlobals.activeWindow.size.h,
                             gl.uniform1iv);

    this.disable();
};

zogl.zLight.prototype.enable = function() {
    this.shader.bind();
};

zogl.zLight.prototype.disable = function() {
    this.shader.unbind();
};