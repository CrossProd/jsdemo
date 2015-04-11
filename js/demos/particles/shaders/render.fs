precision highp float;

void main()
{
    float dist = 1.0 - (distance(gl_PointCoord, vec2(0.5)) * 1.8);

    dist = max(dist, 0.0);

    gl_FragColor = vec4(dist, dist, dist, 1.0);
}
