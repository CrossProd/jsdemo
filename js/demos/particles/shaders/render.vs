precision highp float;

uniform mat4 uViewProjMat;
uniform sampler2D uPosTexture;

attribute vec2 aUV;

void main()
{
    vec3 pos = texture2D(uPosTexture, aUV).xyz;

    gl_Position = uViewProjMat * vec4(pos, 1);
    gl_PointSize = 3.0;
 }
