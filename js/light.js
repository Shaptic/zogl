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
    'position':     new Float32Array([0.0, 0.0])
};

zogl.zLight = function(type, config) {
    config = config || zogl.DefaultLightingConfig;

    this.type = type || zogl.LightType.AMBIENT;
    this.config = {
        'brightness':   config.brightness   || zogl.DefaultLightingConfig.brightness,
        'attenuation':  config.attenuation  || zogl.DefaultLightingConfig.attenuation,
        'position':     config.position     || zogl.DefaultLightingConfig.position,
        'color':        config.color        || zogl.DefaultLightingConfig.color,
        'max_angle':    config.max_angle    || zogl.DefaultLightingConfig.max_angle,
        'min_angle':    config.min_angle    || zogl.DefaultLightingConfig.min_angle
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
    log(this.shader.errorstr);

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
    this.config.position = new Float32Array([x, y]);
};

// TODO: Vector rotation not just value setting.

zogl.zLight.prototype.setMaxAngle = function(degrees) {
    this.config.max_angle = zogl.rad(degrees);
};

zogl.zLight.prototype.setMinAngle = function(degrees) {
    this.config.max_angle = zogl.rad(degrees);
};

zogl.zLight.prototype.update = function() {
    log(this.config);
    
    this.enable();
    this.shader.setParameterFl('light_col', this.config.color);
    this.shader.setParameterFl('light_pos', this.config.position);
    this.shader.setParameterFl('light_att', this.config.attenuation);
    this.shader.setParameterFl('light_brt', this.config.brightness);
    this.shader.setParameterFl('light_max', this.config.max_angle);
    this.shader.setParameterFl('light_min', this.config.min_angle);
    this.shader.setParameterInt('scr_height', glGlobals.activeWindow.size.h);
    this.disable();
};

zogl.zLight.prototype.enable = function() {
    var id = mat4.create();
    mat4.identity(id);

    this.shader.bind();
    this.shader.setParameterMat("mv", id);
    this.shader.setParameterMat("proj", glGlobals.proj);
};

zogl.zLight.prototype.disable = function() {
    this.shader.unbind();
};