define(['demo', 'webglwrapper', 'CPMatrix', 'CPVector'], function(CPDemo, ignore, CPMatrix, CPVector)
{
    function Demo()
    {
        CPDemo.call(this);
    }

    Demo.prototype = Object.create(CPDemo.prototype,
    {
        initialize: { value: function(resources, context)
        {
            CPDemo.prototype.initialize.call(this, resources, context);

            this.buffer = context.gl.createBuffer();

            context.gl.bindBuffer(context.gl.ARRAY_BUFFER, this.buffer);

            context.gl.bufferData(
                context.gl.ARRAY_BUFFER,
                new Float32Array([
                  -1.0, -1.0,
                   1.0, -1.0,
                  -1.0,  1.0,
                  -1.0,  1.0,
                   1.0, -1.0,
                   1.0,  1.0]),
                   context.gl.STATIC_DRAW
              );

              this.program = context.createShaderProgram(resources['render.vs'], resources['render.fs']);

              var positionLocation = context.gl.getAttribLocation(this.program, "a_position");

              context.gl.enableVertexAttribArray(positionLocation);
              context.gl.vertexAttribPointer(positionLocation, 2, context.gl.FLOAT, false, 0, 0);
        }},

        render: { value: function(context, frameCounter)
        {
            context.clear();

            context.gl.drawArrays(context.gl.TRIANGLES, 0, 6);
        }},

        getResourcesToLoad: { value: function()
        {
            var resources = new Array();

            resources['render.fs'] = 'js/demos/flocking/shaders/render.fs';
            resources['render.vs'] = 'js/demos/flocking/shaders/render.vs';

            return resources;
        }},

        getRenderEngine: { value: function()
        {
            return CPDemo.RenderEngine.WebGL;
        }}
    });

    return Demo;
});
