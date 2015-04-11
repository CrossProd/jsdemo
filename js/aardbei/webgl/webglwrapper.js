define(function()
{
    //
    // Adds a load of helper methods prefixed with cp to the web gl object
    //

    function CPWebGLWrapper()
    {

    }

    CPWebGLWrapper.addWrapperToGL = function(gl)
    {
        gl.cpClear = function()
        {
            this.clear(this.COLOR_BUFFER_BIT);
        }

        gl.cpSetFramebuffer = function(framebuffer)
        {
            this.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            this.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        gl.cpResetFramebuffer = function()
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            this.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        gl.cpUseShaderProgram = function(program)
        {
            this.useProgram(program);

            // set attributes
            for (var key in program.attributes)
            {
                var attribute = program.attributes[key];

                this.enableVertexAttribArray(attribute.location);
                this.vertexAttribPointer(attribute.location, attribute.size, attribute.elementType, false, 0, 0);
            }

            // set uniforms
            for (var key in program.uniforms)
            {
                var uniform = program.uniforms[key];

                if (uniform.value)
                {
                    switch (uniform.value.length)
                    {
                        case 1:
                            this.uniform1f(uniform.location, false, new Float32Array(uniform.value));
                            break;
                        case 2:
                            this.uniform2f(uniform.location, false, new Float32Array(uniform.value));
                            break;
                        case 3:
                            this.uniform3f(uniform.location, false, new Float32Array(uniform.value));
                            break;
                        case 4:
                            this.uniform4f(uniform.location, false, new Float32Array(uniform.value));
                            break;
                        case 16:
                            this.uniformMatrix4fv(uniform.location, false, new Float32Array(uniform.value));
                            break;
                        default:
                            console.log('Unknown uniform value size for uniform: ' + key);
                            break;
                    }
                }
            }

            // set textures
        }

        gl.cpCompileVertexShader = function(script)
        {
            shader = this.createShader(this.VERTEX_SHADER);

            this.shaderSource(shader, script);
            this.compileShader(shader);

            if (!this.getShaderParameter(shader, this.COMPILE_STATUS))
            {
                alert(this.getShaderInfoLog(shader));

                return null;
            }

            return shader;
        }

        gl.cpCompileFragmentShader = function(script)
        {
            shader = this.createShader(this.FRAGMENT_SHADER);

            this.shaderSource(shader, script);
            this.compileShader(shader);

            if (!this.getShaderParameter(shader, this.COMPILE_STATUS))
            {
                console.error(this.getShaderInfoLog(shader));

                return null;
            }

            return shader;
        }

        gl.cpCreateShaderProgram = function(vertexShader, fragmentShader)
        {
            program = this.createProgram();

            this.attachShader(program, vertexShader);
            this.attachShader(program, fragmentShader);

            this.linkProgram(program);

        	if (!this.getProgramParameter(program, this.LINK_STATUS))
        	{
        		console.error("Unable to initialize the shader program.");
        	}

            this.useProgram(program);

            return program;
        }

        gl.cpCreateIndexBuffer = function(data, elementSize)
        {
            var buffer = this.gl.createBuffer();

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);

            if (data)
            {
                switch (elementSize)
                {
                    case 16:
                        this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.STATIC_DRAW);
                        break;
                    case 32:
                        this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), this.STATIC_DRAW);
                        break;
                    default:
                        alert('Unknown elementSize for index buffer');
                }
            }

            return buffer;
        }

        gl.cpSetVertexBuffer = function(buffer)
        {
            this.bindBuffer(this.ARRAY_BUFFER, buffer);
        }

        gl.cpCreateVertexBuffer = function(data)
        {
            buffer = this.createBuffer();

            this.bindBuffer(this.ARRAY_BUFFER, buffer);

            if (data)
            {
                this.bufferData(this.ARRAY_BUFFER, new Float32Array(data), this.STATIC_DRAW);
            }

            return buffer;
        }
    }

     return CPWebGLWrapper;
});
