define([], function()
{
    Object.extend = function(object, newObjectDefinition)
    {
        newObject = Object.create(object);

        for (var key in newObjectDefinition)
        {
            newObject[key] = newObjectDefinition[key];
        }

        return newObject;
    }

    function Utils()
    {

    }

    Utils.getQueryParameter = function(param)
	{
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');

	    for (var i = 0; i < sURLVariables.length; i++)
	    {
	        var sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] == param)
	        {
	            return sParameterName[1];
	        }
	    }
	}

    return Utils;
});
