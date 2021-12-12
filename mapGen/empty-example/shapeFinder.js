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
        let nextPoint = this.FindNeighbour(startingPoint, points);

        let counter = 0;

        while(nextPoint && nextPoint.Pt.Key != startingPoint.Key)
        {
            if(counter > 1000)
            {
                break;
            }

            points.set(nextPoint.Pt.Key, nextPoint.Pt);
            nextPoint = this.FindNeighbour(nextPoint.Pt, points, nextPoint.CameFrom);
            counter += 1;
        }

        return points;
    }

    FindNeighbour(currentPoint, points, cameFrom)
    {
        let pt = this.FindNeighbourAtDirection('up', currentPoint, points);
        if(pt)
        {
            return { Pt: pt, CameFrom: 'down'};
        }
        
        pt = this.FindNeighbourAtDirection('right', currentPoint, points);
        if(pt)
        {
            return { Pt: pt, CameFrom: 'left'};
        }

        pt = this.FindNeighbourAtDirection('down', currentPoint, points);
        if(pt)
        {
            return { Pt: pt, CameFrom: 'up'};
        }

        pt = this.FindNeighbourAtDirection('left', currentPoint, points);
        if(pt)
        {
            return { Pt: pt, CameFrom: 'right'};
        }

        pt = this.WalkBack(currentPoint, points, cameFrom);
        if(pt)
        {
            return { Pt: pt, CameFrom: this.GetOpositeDirection(cameFrom) };
        }

        return null;
    }

    WalkBack(currentPoint, points, cameFrom)
    {
        const direction = this.GetWalkDirection(cameFrom);
        let key = this.GetBackKey(currentPoint, direction);
        while(this.pichiMap.Points.has(key))
        {
            let pt = this.pichiMap.Points.get(key);
            if(!pt.IsLand)
            {
                break;
            }

            if(!points.has(pt))
            {
                return pt;
            }
            key = this.GetBackKey(pt, direction);
        }
    }

    GetWalkDirection(cameFrom)
    {
        switch(cameFrom)
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

    GetBackKey(currentPoint, direction)
    {
        const x = currentPoint.X + direction.x;
        const y = currentPoint.Y + direction.y;
        return this.pichiMap.GetKey(x, y);
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

}