define(['CPDemo', 'CPMatrix', 'CPVector'], function(CPDemo, CPMatrix, CPVector)
{
    function Demo()
    {
        CPDemo.call(this);
    }

    Demo.prototype = Object.extend(CPDemo.prototype,
    {
        sourceComputeIndex: 0,
        targetComputeIndex: 1,

        initialize: function(resources, gl)
        {
            CPDemo.prototype.initialize.call(this, resources, gl);

            this.computeBuffers =
            [
                { 'location': resources.framebuffers['location1'], 'velocity': resources.framebuffers['velocity1'] },
                { 'location': resources.framebuffers['location2'], 'velocity': resources.framebuffers['velocity2'] }
            ];

            var uvData = [];

            var index = 0;
            for (var v = 0; v < 1024; v++)
            {
                for (var u = 0; u < 1024; u++)
                {
                    uvData[index++] = u / 1024.0;
                    uvData[index++] = v / 1024.0;
                }
            }

            gl.disable(gl.DEPTH_TEST);
            gl.depthMask(false);

            gl.cpSetVertexBufferData(resources.vertexBuffers['uv'], uvData);

            this.performComputeInit(resources, gl);
        },

        swapComputeBuffers: function()
        {
            this.sourceComputeIndex = this.sourceComputeIndex == 0 ? 1 : 0;
            this.targetComputeIndex = this.targetComputeIndex == 0 ? 1 : 0;
        },

        performComputeInit: function(resources, gl)
        {
            var positionData = [1024 * 1024];
            var velocityData = [1024 * 1024];

            var index = 0;

            for (var y = 0; y < 1024; y++)
            {
                for (var x = 0; x < 1024; x++)
                {
                    positionData[index++] = Math.random() * 2.0 - 1.0;
                    positionData[index++] = Math.random() * 2.0 - 1.0;
                    positionData[index++] = Math.random() * 2.0 - 1.0;
                    positionData[index++] = Math.random() * 2.0 - 1.0;
                }
            }

            var index = 0;

            var scale = 0.000001;

            for (var y = 0; y < 1024; y++)
            {
                for (var x = 0; x < 1024; x++)
                {
                    velocityData[index++] = (Math.random() * 2.0 - 1.0) * scale;
                    velocityData[index++] = (Math.random() * 2.0 - 1.0) * scale;
                    velocityData[index++] = (Math.random() * 2.0 - 1.0) * scale;
                    velocityData[index++] = (Math.random() * 2.0 - 1.0) * scale;
                }
            }

            gl.cpSetTextureData(this.computeBuffers[this.sourceComputeIndex].location.textures[0], positionData);
            gl.cpSetTextureData(this.computeBuffers[this.sourceComputeIndex].velocity.textures[0], velocityData);
        },

        performCompute: function(resources, gl)
        {
            gl.cpSetFramebuffer(this.computeBuffers[this.targetComputeIndex].location);

            gl.disable(gl.BLEND);

            gl.cpSetVertexBuffer(resources.vertexBuffers['fullScreenQuad']);

            gl.cpUseShaderProgram(resources.programs['computePosition']);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.computeBuffers[this.sourceComputeIndex].location.textures[0]);
            gl.uniform1i(resources.programs['computePosition'].uniforms['uPosTexture'].location, 0);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.computeBuffers[0].velocity.textures[0]);
            gl.uniform1i(resources.programs['computePosition'].uniforms['uVelocityTexture'].location, 1);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            gl.cpSetFramebuffer(null);
        },

        performComputeVelocity: function(resources, gl)
        {
            gl.cpSetFramebuffer(this.computeBuffers[this.targetComputeIndex].velocity);

            gl.disable(gl.BLEND);

            gl.cpSetVertexBuffer(resources.vertexBuffers['fullScreenQuad']);

            resources.programs['computeVelocity'].uniforms.uTimer = window.performance.now() * 0.001;

            gl.cpUseShaderProgram(resources.programs['computeVelocity']);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.computeBuffers[this.sourceComputeIndex].location.textures[0]);
            gl.uniform1i(resources.programs['computeVelocity'].uniforms['uPosTexture'].location, 0);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.computeBuffers[0].velocity.textures[0]);
            gl.uniform1i(resources.programs['computeVelocity'].uniforms['uVelocityTexture'].location, 1);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            gl.cpSetFramebuffer(null);
        },

        performRender: function(resources, gl, frameCounter)
        {
            gl.cpClear();

            gl.enable(gl.BLEND);

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR);

            var matrixR = CPMatrix.rotation(frameCounter * 0.1, frameCounter * 0.09, frameCounter * 0.00);
            var matrixT = CPMatrix.translation(0, 0, 0);
            var matrixP = CPMatrix.projection(1.0, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);

            var matrixLookAt = CPMatrix.lookAt(new CPVector(0, 0, 5.0), new CPVector(0, 0, 0), 0.0);

            var matrixT = CPMatrix.multiply(matrixLookAt, matrixR);

            var matrixView = CPMatrix.multiply(matrixP, matrixT);

            resources.programs['render'].uniforms['uViewProjMat'].value = matrixView;

            gl.cpSetVertexBuffer(resources.vertexBuffers['uv']);

            gl.cpUseShaderProgram(resources.programs['render']);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.computeBuffers[this.sourceComputeIndex].location.textures[0]);
            gl.uniform1i(resources.programs['render'].uniforms['uPosTexture'].location, 0);

            gl.drawArrays(gl.POINTS, 0, 1000000);
        },

        render: function(resources, gl, frameCounter)
        {
            frameCounter *= 0.2;

            this.performCompute(resources, gl);
            this.performComputeVelocity(resources, gl);

            this.swapComputeBuffers();

            this.performRender(resources, gl, frameCounter);

        },

        getRenderEngine: function()
        {
            return CPDemo.RenderEngine.WebGL;
        }
    });

    return Demo;
});
