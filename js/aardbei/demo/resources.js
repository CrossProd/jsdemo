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

                var internalFormat = gl.RGBA;
                var formatType = gl.FLOAT;

                switch (config.type)
                {
                    case "compute":
                    {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                        var internalFormat = gl.RGBA;
                        var formatType = gl.FLOAT;

                        break;
                    }
                    default:
                        console.log("Unknown texture type for texture '" + key + "'");
                        break;
                }

                gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, config.width, config.height, 0, internalFormat, formatType, null);

                gl.bindTexture(gl.TEXTURE_2D, null);

                texture.width = config.width;
                texture.height = config.height;

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

                var index = 0;
                for (var textureKey in config.textures)
                {
                    var texture = this.textures[textureKey]

                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.ext.drawBuffer.COLOR_ATTACHMENT0_WEBGL + index++, gl.TEXTURE_2D, texture, 0);
                }

                switch (index)
                {
                    case 1:
                        gl.ext.drawBuffer.drawBuffersWEBGL([gl.ext.drawBuffer.COLOR_ATTACHMENT0_WEBGL]);
                        break;
                    case 2:
                        gl.ext.drawBuffer.drawBuffersWEBGL([gl.ext.drawBuffer.COLOR_ATTACHMENT0_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT1_WEBGL]);
                        break;
                    case 3:
                        gl.ext.drawBuffer.drawBuffersWEBGL([gl.ext.drawBuffer.COLOR_ATTACHMENT0_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT1_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT2_WEBGL]);
                        break;
                    case 4:
                        gl.ext.drawBuffer.drawBuffersWEBGL([gl.ext.drawBuffer.COLOR_ATTACHMENT0_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT1_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT2_WEBGL, gl.ext.drawBuffer.COLOR_ATTACHMENT3_WEBGL]);
                        break;
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

            this.loadVertexShader(shaderConfig.vs + this.bust, gl, function(vertexShader)
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

                this.vertexBuffers['key'] = buffer;
            }
        }
    }

    return CPResources;
});
