class ShapeFinder
{

    Shapes = new Map();

    constructor(pMap)
    {
        this.pichiMap = pMap;
        this.MaxShapeId = 0;
    }

    FindShape()
    {
        let started = false;
        let finished = false;
        let currentPixel = null;
        let pixels = [];

        const width = this.pichiMap.Width;
        const height = this.pichiMap.Height;

        for(let y = 0; y < height; y++)
        {
            for(let x = 0; x < width; x++)
            {
                currentPixel = this.pixel(x, y);
                
                if(!currentPixel.IsLand)
                {
                    continue;
                }

                pixels.push(currentPixel);

                if(currentPixel.IsLand && this.pixel(x-1, y)?.IsLand != true)
                {
                    started = true;
                }
                if(currentPixel.IsLand && this.pixel(x+1, y)?.IsLand != true)
                {
                    finished = true;
                }

                if(started && finished)
                {
                    this.addShape(pixels);
                    started = false;
                    finished = false;
                    pixels = [];
                }
                //if pixel(i; j) == 1 and pixel(i - 1; j) == 0 then
                //  ledge = Pixel(i; j)
                //end if
            }
        }

        return this.Shapes;
    }

    pixel(x, y)
    {
        return this.pichiMap.GetPoint(x, y);
    }
    getKey(x, y)
    {
        return this.pichiMap.GetKey(x, y);
    }

    getNewShapeId()
    {
        this.MaxShapeId += 1;
        return this.MaxShapeId;
    }

    addShape(pixels)
    {
        // find existing shape above left to right edge
        let abovePixelKey = null;
        
        const currentShapeId = this.getNewShapeId();

        let shapeIds = [];
        shapeIds.push(currentShapeId);

        for(let pixel of pixels)
        {
            this.addPixelToShape(pixel, currentShapeId);

            abovePixelKey = this.getKey(pixel.X, pixel.Y - 1);
            
            
            if(this.Shapes.has(abovePixelKey))
            {
                let aboveShapeId = this.Shapes.get(abovePixelKey).ShapeId;
                if(!shapeIds.includes(aboveShapeId))
                {
                    shapeIds.push(aboveShapeId);
                }
            }
        }

        if(shapeIds.length > 1)
        {
            this.mergeShapes(shapeIds);
        }
    }

    addPixelToShape(pixel, shapeId)
    {
        
        pixel.ShapeId = shapeId;
        this.Shapes.set(pixel.Key, pixel);
    }

    mergeShapes(shapeIDs)
    {
        let shapeId = 0;

        for(const [key, pixel] of this.Shapes)
        {
            if(shapeIDs.includes(pixel.ShapeId))
            {
                if(shapeId == 0)
                {
                    shapeId = pixel.ShapeId;
                }

                pixel.ShapeId = shapeId;
            }
        }
    }

}