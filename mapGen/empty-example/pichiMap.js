class PichiMap 
{
    inc = 0.04;//default 0.04
    Points = new Map();

    constructor(width, height)
    {
        this.Width = width;
        this.Height = height;
    }

    Initialize = function()
    {
        noiseDetail(8);
        let xoff = 0.01;

        // generate points
        for (let x = 0; x < this.Width; x++) 
        {
            let yoff = 0.01;

            for (let y = 0; y < this.Height; y++)
            {
                //AddSingleSquare(x, y);
                this.AddNoisePoint(x, y, xoff, yoff);
                yoff += this.inc;
            }
            xoff += this.inc;
        }
    }

    AddSingleSquare(x, y)
    {
        let strength = 0.00;
        if(x > 5 && y > 5 && x < 16 && y < 16)
        {
            strength = 1.00
        }
        this.AddPoint(x, y, strength);
    }

    AddNoisePoint(x, y, xoff, yoff)
    {
        this.AddPoint(x, y, noise(xoff, yoff));
    }

    AddPoint(x, y, strength)
    {
        const key = this.GetKey(x, y);
        this.Points.set(key, {Key: key, X: x, Y: y, Value: strength, IsLand: strength > 0.55});
    }

    GetKey(x, y)
    {
        return "".concat(x, ',', y);
    }

    GetPoint(x, y)
    {
        let key = this.GetKey(x, y);
        if(this.Points.has(key))
        {
            return this.Points.get(key);
        }
        else
        {
            return null;
        }
    }
}