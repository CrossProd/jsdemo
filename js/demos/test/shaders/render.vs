uniform mat4 viewProjMat;

attribute vec3 position;

void main()
{
    gl_Position = viewProjMat * vec4(position, 1);
 }
