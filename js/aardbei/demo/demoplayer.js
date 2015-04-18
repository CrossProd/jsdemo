define(['CPDemo', 'CPWebGLWrapper', 'jquery', 'CPResources'], function(CPDemo, CPWebGLWrapper, $, CPResources)
{
    function CPDemoPlayer(rootPath, demo, canvas, fps)
    {
        this.rootPath = rootPath;
        this.demo = demo;
        this.updateInterval = 1000 / fps;
    	this.frameCounter = 0;
    	this.playing = false;
        this.resources = null;
        this.canvas = canvas;
        this.webGL = null;

        var that = this;

        this.initialize(function()
        {
            that.play();
        });
    }

    CPDemoPlayer.prototype =
    {
        initialize: function(finished)
        {
            this.canvas.width = this.demo.defaultWidth();
            this.canvas.height = this.demo.defaultHeight();

            if (this.demo.getRenderEngine() == CPDemo.RenderEngine.Canvas)
            {
                this.initializeCanvas();
            }
            else (this.demo.getRenderEngine() == CPDemo.RenderEngine.WebGL)
            {
                this.initializeWebGL();
            }

            var that = this;

            this.loadResources(function()
            {
                that.demo.initialize(that.resources, that.webGL);

                finished();
            });
        },

        initializeWebGL: function()
        {
            if (!window.WebGLRenderingContext)
            {
                alert("Unable to initialize <a href=\"http://get.webgl.org\">WebGL</a>. Your browser may not support it.");
            }

            try
            {
                this.webGL = this.canvas.getContext("webgl");
            }
            catch(e)
            {
                try
                {
                    this.webGL = this.canvas.getContext("experimental-webgl");
                }
                catch(e)
                {
                    alert('Failed to create webGL context.');
                }
            }

            if (!this.webGL)
            {
                return;
            }

            this.webGL.ext = [];

            this.webGL.ext.floatTexture = this.webGL.getExtension('OES_texture_float');
            // this.webGL.ext.drawBuffers = this.webGL.getExtension('WEBGL_draw_buffers');

            if (!this.webGL.ext.floatTexture)
            {
                alert("Could not load 'OES_texture_float' extension.");
            }

            // if (!this.webGL.ext.drawBuffers)
            // {
            //     alert("Could not load 'WEBGL_draw_buffers' extension.");
            // }

            this.webGL.viewportWidth = this.canvas.width;
            this.webGL.viewportHeight = this.canvas.height;

            this.webGL.viewport(0, 0, this.webGL.viewportWidth, this.webGL.viewportHeight);
            this.webGL.clearColor(0.0, 0.0, 0.0, 1);

            CPWebGLWrapper.addWrapperToGL(this.webGL);
        },

        loadConfig: function(finished)
        {

        },

        loadResources: function(finished)
        {
            this.resources = new CPResources();

            this.resources.initialize(this.rootPath + '/config.json', this.webGL, finished);
        },

        play: function()
        {
        	this.playing = true;

            this.performDrawCycle();
        },

        stop: function()
        {
        	this.playing = false;
        },

        performDrawCycle: function()
        {
            if (this.demo.getRenderEngine() == CPDemo.RenderEngine.Canvas)
            {
                //
            }
            else (this.demo.getRenderEngine() == CPDemo.RenderEngine.WebGL)
            {
                this.demo.render(this.resources, this.webGL, this.frameCounter);
            }

            this.frameCounter++;

        	if (this.playing)
        	{
        		requestAnimationFrame(this.performDrawCycle.bind(this));
        	}
        }
    };

    return CPDemoPlayer;
});
