#extension GL_EXT_draw_buffers : require

precision highp float;

#define EPS         0.0001
#define PI          3.14159265
#define HALF_PI     1.57079633

uniform vec2 uResolution;

uniform sampler2D uPosTexture;  // pos

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed)
{
  return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  gl_FragData[0] = vec4(rand(uv), rand(uv * 1.2425), rand(uv * 2.64243), 1.0);
}
