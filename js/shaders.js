zogl = zogl || {};

zogl.SHADERS = {
    'defaultvs' : [
        'attribute vec2 in_vert;',
        'attribute vec4 in_color;',
        'attribute vec2 in_texc;',

        'uniform mat4 mv;',
        'uniform mat4 proj;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'void main(void) {',
            'gl_Position = proj * mv * vec4(in_vert, -1.0, 1.0);',
            'vs_color = in_color;',
            'vs_texc  = in_texc;',
        '}'
    ].join('\n'),

    'defaultfs' : [
        'precision mediump float;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'uniform sampler2D texture;',

        'void main(void) {',
            'gl_FragColor = vs_color * texture2D(texture, vs_texc);',
        '}'
    ].join('\n'),

    'pointLightFS' : [
        'precision mediump float;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'uniform sampler2D texture;',

        'uniform int    scr_height;',
        'uniform float  light_brt;',
        'uniform vec2   light_pos;',
        'uniform vec3   light_att;',
        'uniform vec4   light_col;',        

        'void main(void) {',
            'vec2 pixel      = gl_FragCoord.xy;',
            'pixel.y         = float(scr_height) - pixel.y;',

            // Calculate distance to light from fragment.'
            'vec2 light_vec  = light_pos - pixel;',
            'float dist      = length(light_vec);',

            // Calculate attenuation, or light influence factor.
            'float att       = 1.0 / ( light_att.x +',
                                    '( light_att.y * dist) +',
                                    '( light_att.z * dist * dist));',

            // Final fragment color is the light color * attenuation * brightness.
            'vec4 tmp        = texture2D(texture, vs_texc) *',
            '                  light_col * vec4(att, att, att, 1.0);',
            'gl_FragColor    = tmp * light_brt * vs_color;',
        '}'
    ].join('\n')
};
