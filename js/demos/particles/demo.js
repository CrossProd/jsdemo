define(['CPDemo', 'CPMatrix', 'CPVector'], function(CPDemo, CPMatrix, CPVector)
{
    function Demo()
    {
        CPDemo.call(this);
    }

    Demo.prototype = Object.extend(CPDemo.prototype,
    {
        initialize: function(resources, gl)
        {
            CPDemo.prototype.initialize.call(this, resources, gl);

            var vertices =
            [
                    -1.0, -1.0,  -1.0,
                     1.0, -1.0,  -1.0,
                  -1.0, 1.0,  -1.0,
                      1.0, 1.0,  -1.0,
                      -1.0, -1.0,  1.0,
                       1.0, -1.0,  1.0,
                       -1.0, 1.0,  1.0,
                        1.0, 1.0,  1.0
                ];

            this.buffer = gl.cpCreateVertexBuffer(vertices);

            gl.enable(gl.BLEND);
        },

        performCompute: function(resources, gl)
        {
            gl.cpSetFramebuffer(resources.framebuffers['compute1'])

            gl.disable(gl.BLEND);

            // resources.programs['compute'].uniforms['viewProjMat'].value = matrixView;

            gl.cpUseShaderProgram(resources.programs['compute']);

            gl.cpSetVertexBuffer(resources.vertexBuffers['fullScreenQuad']);

            gl.cpSetFramebuffer(null);
        },

        render: function(resources, gl, frameCounter)
        {
            frameCounter *= 0.2;

            this.performCompute(resources, gl);

            gl.cpClear();

            gl.enable(gl.BLEND);

            gl.cpSetVertexBuffer(this.buffer);

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);

            var matrixR = CPMatrix.rotation(frameCounter * 0.10, frameCounter * 0.00, frameCounter * 0.00);
            var matrixT = CPMatrix.translation(0, 0, 0);
            var matrixP = CPMatrix.projection(1.0, gl.viewportWidth / gl.viewportHeight, 0.1, 20.0);

            var matrixLookAt = CPMatrix.lookAt(new CPVector(Math.cos(frameCounter * 0.05) * 5.0, 0, Math.sin(frameCounter * 0.05) * 5.0), new CPVector(0, 0, 0), 0.0);

            var matrixT = CPMatrix.multiply(matrixLookAt, matrixR);

            var matrixView = CPMatrix.multiply(matrixP, matrixT);

            resources.programs['render'].uniforms['viewProjMat'].value = matrixView;

            gl.cpUseShaderProgram(resources.programs['render']);

            gl.drawArrays(gl.POINTS, 0, 8);
        },

        getRenderEngine: function()
        {
            return CPDemo.RenderEngine.WebGL;
        }
    });

    return Demo;
});
