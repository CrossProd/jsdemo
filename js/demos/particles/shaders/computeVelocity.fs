precision highp float;

uniform vec2 uResolution;

uniform sampler2D uPosTexture;
uniform sampler2D uVelocityTexture;

uniform float uTimer;

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

  //vel /= 1.01;

  vec3 dir = normalize(vec3(sin(uTimer * 0.5) * 2.0, cos(uTimer * 0.5) * 2.0, 0.0) - pos);

  // dir.x += (rand(pos.xy) - 0.5) * 1.1;
  //
  vel += dir * 0.001;

  if (length(vel) > 0.01)
  {
      vel = normalize(vel) * 0.01;
  }

  //
  // vel *= 1.01;

  // vel.x += (rand(pos.xy) - 0.5) * 0.01;
  // vel.y += (rand(pos.zx) - 0.5) * 0.01;
  // vel.z += (rand(pos.yz) - 0.5) * 0.01;

  gl_FragColor = vec4(vel, 1.0);
}
