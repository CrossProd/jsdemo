precision mediump float;

void main()
{
    float normalizedX = gl_FragCoord.x - 320.0;
    float normalizedY = gl_FragCoord.y - 240.0;

    if (sqrt(normalizedX * normalizedX + normalizedY * normalizedY) < 80.0)
    {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    else
    {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
