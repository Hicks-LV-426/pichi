namespace mapGenNet;

public class Finder
{
    public Point? FindEdgeNeighbour(Point homePoint, Map map)
    {
        if (map.Points.Count == 0) return null;

        if(!map.Points.Contains(homePoint)) return null;

        throw new NotImplementedException();
    }
}
