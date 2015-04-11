requirejs.config(
{
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js',
    paths:
    {
        'jquery': 'lib/jquery-1.11.2.min',
        'Utils' : 'aardbei/system/utils',
        'CPDemo': 'aardbei/demo/demo',
        'CPResources' : 'aardbei/demo/resources',
        'CPDemoPlayer': 'aardbei/demo/demoplayer',
        'CPMatrix': 'aardbei/engine/matrix',
        'CPVector': 'aardbei/engine/vector',
        'CPWebGLWrapper': 'aardbei/webgl/webglwrapper'
    }
});

require(['jquery', 'Utils', 'CPDemoPlayer'], function ($, Utils, CPDemoPlayer)
{
    var demoId = Utils.getQueryParameter('demo');

    var demoRootPath = 'js/demos/' + demoId;
    var demoPath = 'demos/' + demoId + '/demo';

    require([demoPath], function (Demo)
    {
        var demoplayer = new CPDemoPlayer(demoRootPath, new Demo(), document.getElementById('mainCanvas'), 40);
    });
});
