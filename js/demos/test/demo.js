define(['CPDemo', 'CPMatrix', 'CPVector'], function(CPDemo, CPMatrix, CPVector)
{
    function Demo()
    {
        CPDemo.call(this);
    }

    Demo.prototype = Object.extend(CPDemo.prototype,
    {
        initialize: function(resources, context)
        {
            CPDemo.prototype.initialize.call(this, resources, context);

            var vertices =
            [
                    // Front face
                    -1.0, -1.0,  1.0,
                     1.0, -1.0,  1.0,
                     1.0,  1.0,  1.0,
                    -1.0,  1.0,  1.0,

                    // Back face
                    -1.0, -1.0, -1.0,
                    -1.0,  1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0, -1.0, -1.0,

                    // Top face
                    -1.0,  1.0, -1.0,
                    -1.0,  1.0,  1.0,
                     1.0,  1.0,  1.0,
                     1.0,  1.0, -1.0,

                    // Bottom face
                    -1.0, -1.0, -1.0,
                     1.0, -1.0, -1.0,
                     1.0, -1.0,  1.0,
                    -1.0, -1.0,  1.0,

                    // Right face
                     1.0, -1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0,  1.0,  1.0,
                     1.0, -1.0,  1.0,

                    // Left face
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0,  1.0,
                    -1.0,  1.0,  1.0,
                    -1.0,  1.0, -1.0
                ];

                var indices =
                [
                    0,  1,  2,      0,  2,  3,    // front
                    4,  5,  6,      4,  6,  7,    // back
                    8,  9,  10,     8,  10, 11,   // top
                    12, 13, 14,     12, 14, 15,   // bottom
                    16, 17, 18,     16, 18, 19,   // right
                    20, 21, 22,     20, 22, 23    // left
                ];

            this.buffer = context.createVertexBuffer(vertices);
            this.indexBuffer = context.createIndexBuffer(indices, 16);
        },

        render: function(resources, context, frameCounter)
        {
            context.clear();

            var matrixR = CPMatrix.rotation(frameCounter * 0.10, frameCounter * 0.00, frameCounter * 0.00);
            var matrixT = CPMatrix.translation(0, 0, 0);
            var matrixP = CPMatrix.projection(1.0, context.gl.viewportWidth / context.gl.viewportHeight, 0.1, 20.0);

            var matrixLookAt = CPMatrix.lookAt(new CPVector(Math.cos(frameCounter * 0.05) * 5.0, 0, Math.sin(frameCounter * 0.05) * 5.0), new CPVector(0, 0, 0), 0.0);

            var matrixT = CPMatrix.multiply(matrixLookAt, matrixR);

            var matrixView = CPMatrix.multiply(matrixP, matrixT);

            resources.programs['render'].uniforms['viewProjMat'].value = matrixView;

            context.useShaderProgram(resources.programs['render']);

            context.gl.drawElements(context.gl.TRIANGLES, 36, context.gl.UNSIGNED_SHORT, 0);
        },

        getRenderEngine: function()
        {
            return CPDemo.RenderEngine.WebGL;
        }
    });

    return Demo;
});
