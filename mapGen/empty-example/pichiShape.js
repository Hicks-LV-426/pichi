class PichiShape
{
    constructor()
    {
        this.Points = new Map();
        this.PointsArray = [];
    }

    AddPoint(point)
    {
        this.Points.set(point.Key, point);
        this.PointsArray.push(point);
    }

    has(key)
    {
        return this.Points.has(key);
    }

    length()
    {
        return this.PointsArray.length;
    }

    point(index)
    {
        if(index < 0 || index > this.PointsArray - 1)
        {
            return null;
        }

        return this.PointsArray[index];
    }
}