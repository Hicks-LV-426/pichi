namespace mapGenNet;
 
public class Map
{
    public int Height { get; private set; }

    public HashSet<Point> Points { get; private set; }

    public int Width { get; private set; }

    public Map(int height, int width)
    {
        this.Height = height;
        this.Width = width;
        this.Points = new HashSet<Point>(height * width);
        this.Initialize();
    }

    private void Initialize()
    {
        for (int x = 0; x < this.Width; x++)
        {
            for (int y = 0; y < this.Height; y++)
            {
                this.Points.Add(new Point(x, y));
            }
        }
    }

    public void SetWhite(Point point)
    {
        this.Points.First(p => p.X == point.X && p.Y == point.Y).IsWhite = true;
    }
}
