function go(viz, dispatch) {

    var makeGraph = graphCanvas;

    var graph;

    d3.select("#dataFile").on("change", function() {
        d3.select(viz).selectAll(".container *").remove();
        var file = "data/" + d3.event.target.value
        d3.text(file, "text/plain", main);
    });

    function main(data) {

        var g = adjListToGraph(data.split('\n'));

        graph = makeGraph()
            .nodes(g.nodes)
            .edges(g.edges)
        
        d3.select(viz).call(graph);

    }


    d3.select("#graphType")
        .on("change", function() {

            makeGraph =  (d3.event.target.value == "svg") ? graphSVG : graphCanvas
            if (!graph)
                return;
            
            var new_graph = makeGraph()
            
            new_graph
                .nodes(graph.nodes())
                .edges(graph.edges())
                .selectedNodes(graph.selectedNodes())
                .force(graph.force())
       
            var v = d3.select(viz)
            v.selectAll('*').remove()
            v.call(new_graph);
            
            //new_graph.redraw()
            
            graph = new_graph
        });

    d3.select("#centerGraph")
        .on("click", function() {
            graph.center() // if we didn't have an extra function here, we would center the wrong graph (I think)
        });

    d3.select("#stopGraph")
        .on("click", function() {
            graph.stop()
        });

    d3.select("#startGraph")
        .on("click", function() {
            graph.start()
            dispatch.graph({"graph": graph, "container": viz})
        });

    d3.select("#drawLabels")
        .on("change", function() {
            graph.labels(d3.event.target.checked);
        });

    d3.select("#searchBox")
        .on("change", function() {
            var x = d3.event.target.value;
            var node = graph.nodes().find(function(d) { return d.label == x });
            if (!node)
                return;

            if (graph.selectedNodes().indexOf(node) > 0)
                graph.unSelectNode(node)
            else
                graph.selectNode(node)

            if (window.dispatch)
                window.dispatch.export({ name: "wordlist",
                                        value: graph.selectedNodes().map(function(d) { return d.label }) 
                                       });
        });


    function adjListToGraph(adj) {
        var nodes = [],
            edges = []

        var node_dict = {}
        var nNodes = 0
        
        function addNode(w) {
            var i = node_dict[w]
            if (i != undefined)
                return nodes[i];
            i = nNodes;
            node_dict[w] = i;
            nNodes ++;
            nodes.push({"label": w})
            return nodes[i];
        }
        
        adj.forEach(function(line) {
            if (line[0] == "#")
                return
            words = line.split(' ')
            var weight = 10; /* arbitrary init weight */
            var src = addNode(words[0])
            for (var i = 1; i < words.length; i++) {
                var tar = addNode(words[i])
                edges.push({"source": src, "target": tar, "value": weight})
                weight -= 1;
            }
        });

        return {nodes: nodes, edges: edges}
    }

}


define(['d3', 'graphCanvas', 'graphSVG'], function(d3, graphCanvas, graphSVG) { 
    return go;
});
