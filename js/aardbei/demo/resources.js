define(['CPWebGLWrapper'], function(CPWebGLWrapper)
{
    function CPResources()
    {
        this.programs = [];
        this.textures = [];
        this.framebuffers = [];
        this.vertexBuffers = [];

        this.bust = "?bust=" + (new Date()).getTime();
    }

    CPResources.prototype =
    {
        initialize: function(path, gl, finished)
        {
            var that = this;

            $.get(path + this.bust, function(configData)
            {
                that.loadTextures(configData.textures, gl);
                that.loadFramebuffers(configData.framebuffers, gl);
                that.loadVertexBuffers(configData.vertexBuffers, gl);

                that.loadShaderPrograms(configData.shaders, gl, function()
                {
                    finished();
                });
            }).fail(function(message)
            {
                alert('Error loading config.');
            });
        },

        configUniformsForProgram: function(program, gl, shaderConfig)
        {
            program.uniforms = [];

            for (var key in shaderConfig.uniforms)
            {
                var config = shaderConfig.uniforms[key];

                var location = gl.getUniformLocation(program, key);

                program.uniforms[key] = { 'location' : location };

                program.uniforms[key].value = config.value;
                program.uniforms[key].defaultValue = config.value;
            }
        },

        configAttributesForProgram: function(program, gl, shaderConfig)
        {
            program.attributes = [];

            for (var key in shaderConfig.attributes)
            {
                var config = shaderConfig.attributes[key];

                var location = gl.getAttribLocation(program, key);

                program.attributes[key] = { 'location' : location, 'elementType' : gl.FLOAT, 'size' : config.size };
            }
        },

        loadTextures: function(textureConfig, gl)
        {
            for (var key in textureConfig)
            {
                var config = textureConfig[key];

                var texture = gl.createTexture();

                gl.bindTexture(gl.TEXTURE_2D, texture);

                texture.internalFormat = gl.RGBA;
                texture.formatType = gl.FLOAT;
                texture.width = config.width;
                texture.height = config.height;

                switch (config.type)
                {
                    case "compute":
                    {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                        break;
                    }
                    default:
                        console.log("Unknown texture type for texture '" + key + "'");
                        break;
                }

                gl.texImage2D(gl.TEXTURE_2D, 0, texture.internalFormat, texture.width, texture.height, 0, texture.internalFormat, texture.formatType, null);

                gl.bindTexture(gl.TEXTURE_2D, null);

                this.textures[key] = texture;
            }
        },

        loadFramebuffers: function(framebuffersConfig, gl)
        {
            for (var key in framebuffersConfig)
            {
                var config = framebuffersConfig[key];

                var frameBuffer = gl.createFramebuffer();

                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

                frameBuffer.textures = [];

                for (var i = 0; i < config.textures.length; i++)
                {
                    var textureKey = config.textures[i];

                    var texture = this.textures[textureKey];

                    frameBuffer.textures[i] = texture;

                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, texture, 0);
                }

                if (!gl.isFramebuffer(frameBuffer))
                {
                    console.error("Frame buffer failed");
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                frameBuffer.width = config.width;
                frameBuffer.height = config.height;

                this.framebuffers[key] = frameBuffer;
            }
        },

        loadShaderPrograms: function(shaderConfig, gl, finished)
        {
            var that = this;

            var shaderCount = Object.keys(shaderConfig).length;

            for (var key in shaderConfig)
            {
                var config = shaderConfig[key];

                this.loadShaderProgram(config, key, gl, function()
                {
                    shaderCount--;

                    if (shaderCount == 0)
                    {
                        finished();
                    }

                });
            }
        },

        loadShaderProgram: function(shaderConfig, key, gl, finished)
        {
            var that = this;

            that.loadVertexShader(shaderConfig.vs + that.bust, gl, function(vertexShader)
            {
                that.loadFragmentShader(shaderConfig.fs + that.bust, gl, function(fragmentShader)
                {
                    console.log("Loading shader program '" + key + "'");

                    var program = gl.cpCreateShaderProgram(vertexShader, fragmentShader);

                    that.configUniformsForProgram(program, gl, shaderConfig);
                    that.configAttributesForProgram(program, gl, shaderConfig);

                    that.programs[key] = program;

                    finished()
                });
            });
        },

        loadVertexShader: function(filename, gl, finished)
        {
            $.get(filename, function(data)
            {
                console.log('Compiling vertex shader: ' + filename);

                finished(gl.cpCompileVertexShader(data));
            });
        },

        loadFragmentShader: function(filename, gl, finished)
        {
            $.get(filename, function(data)
            {
                console.log('Compiling fragment shader: ' + filename);

                finished(gl.cpCompileFragmentShader(data));
            });
        },

        loadVertexBuffers: function(vertexBuffersConfig, gl)
        {
            for (var key in vertexBuffersConfig)
            {
                var config = vertexBuffersConfig[key];

                console.log("Loading vertex buffer: " + key);

                var buffer = gl.cpCreateVertexBuffer(config.value);

                this.vertexBuffers[key] = buffer;
            }
        }
    }

    return CPResources;
});
