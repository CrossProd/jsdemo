define(function()
{
    function CPVector(x, y, z)
    {
        if (arguments.length == 0)
        {
            x = y = z = 0;
        }
        if (arguments.length == 1)
        {
            y = z = x;
        }

        this.x = x;
        this.y = y;
        this.z = z;
    }

    CPVector.subtract = function(a, b)
    {
        return new CPVector(a.x - b.x, a.y - b.y, a.z - b.z);
    };

    CPVector.magnitude = function(a)
    {
        return Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
    };

    CPVector.normalize = function(a)
    {
        var lengthInv = 1.0 / CPVector.magnitude(a);

        return new CPVector(a.x * lengthInv, a.y * lengthInv, a.z * lengthInv);
    };

    CPVector.dotProduct = function(a, b)
    {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    };

    CPVector.crossProduct = function(a, b)
    {
        return new CPVector(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    return CPVector;
});
