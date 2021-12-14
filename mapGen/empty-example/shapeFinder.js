class ShapeFinder
{
    constructor(pMap)
    {
        this.pichiMap = pMap;
    }

    FindShape()
    {
        for (const [key, value] of this.pichiMap.Points) 
        {
            if(value.IsLand)
            {
                console.log('land found at '.concat(key));
                return this.TraceShape(value);
            }
        }
    }

    TraceShape(startingPoint)
    {
        let points = new Map();

        points.set(startingPoint.Key, startingPoint);
        let lastDirection = 'right';
        let lastPoint = null;
        let nextPoint = this.FindNeighbour(startingPoint, points, lastDirection);


        let counter = 0;

        while(nextPoint && nextPoint.Pt.Key != startingPoint.Key)
        {
            if(counter > 2000)
            {
                break;
            }

            lastDirection = nextPoint.Direction;
            lastPoint = nextPoint.Pt;

            points.set(nextPoint.Pt.Key, nextPoint.Pt);
            nextPoint = this.FindNeighbour(nextPoint.Pt, points, nextPoint.Direction);

            // try walk back if next point not found
            if(!nextPoint)
            {
                nextPoint = this.WalkBack(lastDirection, lastPoint, points);
            }
            counter += 1;
        }

        return points;
    }

    FindNeighbour(currentPoint, points, direction)
    {
        const walkSequence = this.GetWalkSequence(direction);

        for(const dir of walkSequence)
        {
            let pt = this.FindNeighbourAtDirection(dir, currentPoint, points);
            if(pt)
            {
                return { Pt: pt, Direction: dir};
            }
        }

        return null;
    }

    GetWalkSequence(direction)
    {
        switch(direction)
        {
            case 'up':
                return ['left', 'up', 'right', 'down'];
            case 'right':
                return ['up', 'right', 'down', 'left'];
            case 'down':
                return ['right', 'down', 'left', 'up'];
            case 'left':
                return ['down', 'left', 'up', 'right'];
        }
    }

    FindNeighbourAtDirection(direction, currentPoint, points)
    {
        let nextLocation = this.GetLocation(direction, currentPoint);

        let pt = this.GetPointAt(nextLocation.x, nextLocation.y);
        if(this.IsValidPoint(pt, points))
        {
            return pt;
        }
        return null;
    }

    GetLocation(direction, currentPoint)
    {
        switch(direction)
        {
            case 'up':
                return {x: currentPoint.X, y: currentPoint.Y - 1}
            case 'right':
                return {x: currentPoint.X + 1, y: currentPoint.Y}
            case 'down':
                return {x: currentPoint.X, y: currentPoint.Y + 1}
            case 'left':
                return {x: currentPoint.X - 1, y: currentPoint.Y}
        }
    }

    GetPointAt(x, y)
    {
        let key = this.pichiMap.GetKey(x, y);
        if(this.pichiMap.Points.has(key))
        {
            return this.pichiMap.Points.get(key);
        }

        return null;
    }

    IsValidPoint(nextPoint, points)
    {
        if(!nextPoint?.IsLand)
        { 
            return false;
        }

        return !points.has(nextPoint.Key);
    }

    // unused right now
    WalkBack(direction, currentPoint, points)
    {
        const backDirection = this.GetOpositeDirection(direction);
        const shift = this.GetShiftFromDirection(backDirection);

        // walk back 1 step
        let x = currentPoint.X + shift.x;
        let y = currentPoint.Y + shift.y;

        let point = this.GetLandPointAt(x, y);

        while(point)
        {
            let neightbour = this.FindNeighbour(point, points, direction);
            if(neightbour)
            {
                point = null;
                return neightbour;
            }

            // walk back 1 step
            x += shift.x;
            y += shift.y;
            point = this.GetLandPointAt(x, y);
        }

        return null;
    }

    GetShiftFromDirection(direction)
    {
        switch(direction)
        {
            case 'up':
                return {x: 0, y: -1};
            case 'right':
                return {x: 1, y: 0};
            case 'down':
                return {x: 0, y: 1};
            case 'left':
                return {x: -1, y: 0};
        }
    }

    GetOpositeDirection(direction)
    {
        switch(direction)
        {
            case 'up':
                return 'down';
            case 'right':
                return 'left';
            case 'down':
                return 'up';
            case 'left':
                return 'right';
        }
    }

    GetLandPointAt(x, y)
    {
        const key = this.pichiMap.GetKey(x, y);
        if(!this.pichiMap.Points.has(key))
        {
            return null;
        }

        const pt = this.pichiMap.Points.get(key);
        if(pt.IsLand)
        {
            return pt;
        }

        return null;
    }


}