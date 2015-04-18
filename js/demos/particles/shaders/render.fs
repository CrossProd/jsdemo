precision highp float;

void main()
{
    float dist = 1.0 - (distance(gl_PointCoord, vec2(0.5)) * 1.8);

    dist = max(dist, 0.0);

    vec3 color = dist * vec3(1.0, 0.6, 0.3);

    gl_FragColor = vec4(color, 1.0);
}
