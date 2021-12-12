using Microsoft.VisualStudio.TestTools.UnitTesting;
using mapGenNet;
using System.Drawing;

namespace mapGenNet.Tests
{
    [TestClass()]
    public class FinderTests
    {
        Finder finder = new Finder();

        [TestMethod()]
        public void FindEdgeNeighbour_EmptyMapTest()
        {
            // arrange
            var map = new Map(0, 0);

            // act
            var result = finder.FindEdgeNeighbour(new Point(0, 0), map);

            //
            Assert.IsNull(result);
        }

        [TestMethod()]
        public void FindEdgeNeighbour_HomePointNotOnMap()
        {
            // arrange
            var map = new Map(10, 10);
            var point = new Point(-1, 0);

            // act
            var result = finder.FindEdgeNeighbour(point, map);

            // assert
            Assert.IsNull(result);
        }

        [TestMethod()]
        public void FindEdgeNeighbour_HomePointIsTheOnlyWhitePoint()
        {
            // arrange
            var map = new Map(10, 10);
            var point = new Point(5, 5);
            map.SetWhite(point);

            // act
            var result = finder.FindEdgeNeighbour(point, map);

            // assert
            Assert.IsNull(result);
        }
    }
}