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
        let shape = new PichiShape();

        shape.AddPoint(startingPoint);
        const defaultDirection = 'right';
        let nextPoint = this.FindNeighbour(startingPoint, shape, defaultDirection);


        let counter = 0;
        let maxWalkDistance = this.pichiMap.Height * this.pichiMap.Width;

        while(nextPoint && nextPoint.Pt.Key != startingPoint.Key)
        {
            if(counter > maxWalkDistance)
            {
                break;
            }

            shape.AddPoint(nextPoint.Pt);
            nextPoint = this.FindNeighbour(nextPoint.Pt, shape, nextPoint.Direction);

            // try walk back if next point not found
            if(!nextPoint)
            {
                nextPoint = this.WalkBack(shape);
            }
            counter += 1;
        }

        return shape;
    }

    FindNeighbour(currentPoint, shape, direction)
    {
        const walkSequence = this.GetWalkSequence(direction);

        for(const dir of walkSequence)
        {
            let pt = this.FindNeighbourAtDirection(dir, currentPoint, shape);
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

    FindNeighbourAtDirection(direction, currentPoint, shape)
    {
        let nextLocation = this.GetLocation(direction, currentPoint);

        let pt = this.GetPointAt(nextLocation.x, nextLocation.y);
        if(this.IsValidPoint(pt, shape))
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

    IsValidPoint(nextPoint, shape)
    {
        if(!nextPoint?.IsLand)
        { 
            return false;
        }

        return !shape.has(nextPoint.Key);
    }

    WalkBack(shape)
    {
        //console.log('walking back @ shape length of ', shape.length());
        let point = null;
        for(let i = shape.length() - 2; i > 0; i--)
        {
            //console.log('looking for neighbours at ', i);
            point = this.FindNeighbour(shape.point(i), shape, 'right');
            if(point)
            {
                break;
            }
        }

        return point;
    }

    //GetShiftFromDirection(direction)
    //{
    //    switch(direction)
    //    {
    //        case 'up':
    //            return {x: 0, y: -1};
    //        case 'right':
    //            return {x: 1, y: 0};
    //        case 'down':
    //            return {x: 0, y: 1};
    //        case 'left':
    //            return {x: -1, y: 0};
    //    }
    //}

    //GetLandPointAt(x, y)
    //{
    //    const key = this.pichiMap.GetKey(x, y);
    //    if(!this.pichiMap.Points.has(key))
    //    {
    //        return null;
    //    }
    //
    //    const pt = this.pichiMap.Points.get(key);
    //    if(pt.IsLand)
    //    {
    //        return pt;
    //    }
    //
    //    return null;
    //}


}