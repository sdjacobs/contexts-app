define(["d3", "partial-graph"], function(d3, partialGraph) {
    return (function(viz, dispatch) {
      
        var graph,
            inputs = d3.selectAll("#p_seedword, #p_nNeighbors, #p_nGenerations");

        dispatch.on("graph", function(g) {
            graph = g.graph;
            inputs.attr("disabled", null);
        });

        inputs.on("change", function() {
            var seed = d3.select("#p_seedword").node().value
            var n = d3.select("#p_nNeighbors").node().value
            var g = d3.select("#p_nGenerations").node().value
            makePartialGraph(seed, n, g);
        });

        function makePartialGraph(word, nNeighbors, nGenerations) {
            var allNodes = graph.nodes()
            var allEdges = graph.edges()
            var x = allNodes.find(function(d) { return d.label == word; });
            if (!x) {
                alert("selected node not found")
                return;
            }
            var queue = [{"node":x, "ngens":nGenerations, "id": 0}]
            var nodes = [], links = []
            var id = 0
            while (queue.length > 0) {
                var d = queue.pop()
                nodes.push({"label": d.node.label, "id": d.id, "size": (d.ngens+1)*10})
                
                if (d.ngens == 0)
                    continue;

                var neighbors = findNeighbors(allNodes, allEdges, d.node)
                neighbors = neighbors.slice(0, nNeighbors)
                neighbors.forEach(function(x) {
                    var tar = nodes.findIndex(function(d) { return d.label == x.label })
                    if (tar == -1) {
                        id++
                        queue.push({"node": x, "ngens": d.ngens - 1, "id": id})
                        tar = id
                    }
                    links.push({"source": d.id, "target":tar})
                }); 

            }
            var partial = partialGraph()
                .nodes(nodes)
                .links(links)

           var view = d3.select(viz);
           view.selectAll("*").remove()
           view.call(partial);
        }
   
    });
});
