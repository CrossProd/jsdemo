precision highp float;

uniform vec2 uResolution;

uniform sampler2D uPosTexture;
uniform sampler2D uVelocityTexture;

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed)
{
  return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  vec3 pos = texture2D(uPosTexture, uv).xyz;
  vec3 vel = texture2D(uVelocityTexture, uv).xyz;

  pos += vel;

  gl_FragColor = vec4(pos, 1.0);
}
