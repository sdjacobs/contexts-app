define(["d3", "app/partial-graph"], function(d3, partialGraph) {
    return (function(viz, dispatch) {
      
        var inputs = d3.selectAll("#p_seedword, #p_nNeighbors, #p_nGenerations"),
            partial = partialGraph();

        dispatch.on_init("graph", function(g) {
            //var graph = g.graph;
            inputs.attr("disabled", null);
            partial.nodes(g.graph.nodes())
            partial.links(g.graph.edges());
        });

        inputs.on("change", function() {
            var seed = d3.select("#p_seedword").node().value
            var n = d3.select("#p_nNeighbors").node().value
            var g = d3.select("#p_nGenerations").node().value
            partial.makePartialGraph(seed, n, g);
            partial.draw()
        });

       
        var view = d3.select(viz);
        view.call(partial);
    });
});
