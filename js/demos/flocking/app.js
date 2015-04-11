require(['../common'], function (common)
{
    require(['demos/flocking/demo', 'demoplayer'], function (demo, CPDemoPlayer)
    {
        var demoplayer = new CPDemoPlayer(new demo(), document.getElementById('mainCanvas'), 40);
    });
});
