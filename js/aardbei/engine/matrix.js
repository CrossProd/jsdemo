define(['CPVector'], function(CPVector)
{
    var CPMatrix =
    {
        identity: function()
        {
            var data =
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];

            return data;
        },

        rotation: function(x, y, z)
        {
            var matX = CPMatrix.rotationX(x);
            var matY = CPMatrix.rotationY(y);
            var matZ = CPMatrix.rotationZ(z);

            return CPMatrix.multiply(matX, CPMatrix.multiply(matZ, matY));
        },

        rotationX: function(angle)
        {
            var c = Math.cos(angle);
            var s = Math.sin(angle);

            var data =
            [
                1, 0,  0, 0,
                0, c, -s, 0,
                0, s,  c, 0,
                0, 0,  0, 1
            ];

            return data;
        },

        rotationY: function(angle)
        {
            var c = Math.cos(angle);
            var s = Math.sin(angle);

            var data =
            [
                 c, 0, s, 0,
                 0, 1, 0, 0,
                -s, 0, c, 0,
                 0, 0, 0, 1
            ];

            return data;
        },

        rotationZ: function(angle)
        {
            var c = Math.cos(angle);
            var s = Math.sin(angle);

            var data =
            [
                c, -s, 0, 0,
                s,  c, 0, 0,
                0,  0, 1, 0,
                0,  0, 0, 1
            ];

            return data;
        },

        scaleX: function(s)
        {
            var data =
            [
                s, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];

            return data;
        },

        scaleY: function(s)
        {
            var data =
            [
                1, 0, 0, 0,
                0, s, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];

            return data;
        },

        scaleZ: function(s)
        {
            var data =
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, s, 0,
                0, 0, 0, 1
            ];

            return data;
        },

        scale: function(sx, sy, sz)
        {
            if (arguments.length == 1)
            {
                sy = sz = sx;
            }

            var data =
            [
                sx,  0,  0, 0,
                 0, sy,  0, 0,
                 0,  0, sz, 0,
                 0,  0,  0, 1
            ];

            return data;
        },

        translation: function(x, y, z)
        {
            var data =
            [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1
            ];

            return data;
        },

        projection: function(fov, aspect, near, far)
        {
            var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
            var rangeInv = 1.0 / (near - far);

            var m11 = f / aspect;
            var m33 = (near + far) * rangeInv;
            var m43 = near * far * rangeInv * 2;

            var data =
            [
                m11, 0,   0,  0,
                  0, f,   0,  0,
                  0, 0, m33, -1,
                  0, 0, m43,  0
            ];

            return data;
        },

        multiply: function(a, b)
        {
            var result = [];

            for (var y = 0; y < 4; y++)
            {
                for (var x = 0; x < 4; x++)
                {
                    result[(y * 4) + x] = 0;

                    for (var i = 0; i < 4; i++)
                    {
                        result[(y * 4) + x] += a[(i * 4) + x] * b[(y * 4) + i];
                    }
                }
            }

            return result;
        },

        lookAt: function(position, target, roll)
        {
            var z = CPVector.normalize(CPVector.subtract(position, target));
            var x = CPVector.crossProduct(new CPVector(0, 1.0, 0), z);
            var y = CPVector.crossProduct(z, x);

            var data =
            [
                x.x, x.y, x.z, 0,
                y.x, y.y, y.z, 0,
                z.x, z.y, z.z, 0,
                -CPVector.dotProduct(x, position), -CPVector.dotProduct(y, position), -CPVector.dotProduct(z, position), 1
            ];

            return CPMatrix.multiply(CPMatrix.rotationZ(roll), data);
        },

        log: function(a)
        {
            for (var y = 0; y < 4; y++)
            {
                var line = '';

                for (var x = 0; x < 4; x++)
                {
                    line += (x > 0) ? ', ' : '';
                    line += a[(y * 4) + x];
                }

                console.log(line);
            }
        }
    };

    return CPMatrix;
});
