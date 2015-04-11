define(function()
{
    CPDemo.RenderEngine =
    {
        Canvas : 1,
        WebGL : 2
    }

    function CPDemo()
    {
        this.resources = null;
    }

    CPDemo.prototype =
    {
        initialize: function(resources, context)
        {
            this.resources = resources;
        },

        getRenderEngine: function()
        {
            return CPDemo.RenderEngine.Canvas;
        },

        allowResize: function()
        {
            return false;
        },

        defaultWidth: function()
        {
            return 640;
        },

        defaultHeight: function()
        {
            return 400;
        },

        render: function(renderContext)
        {
        },

        getResourcesToLoad:  function()
        {
            return null;
        }
    };

    return CPDemo;
});
