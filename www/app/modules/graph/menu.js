
var makeGraph = graphCanvas;

var graph;

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
   
        var v = d3.select('.view1')
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
        //updateList();
        
        var event = new CustomEvent('graphUpdateSelection', { 'detail': graph.selectedNodes() });
        window.parent.dispatchEvent(event);
    });



/* This should move into graph code (TODO) */
function findNeighbors(nodes, edges, node_obj) {
    //var node_obj = nodes.find(function (n) { return n.label == name });
    var nb_l = edges.filter(function(e) { return e.source == node_obj; })
            .map(function (n) { return n.target; });
    var nb_r = edges.filter(function(e) { return e.target == node_obj; })
            .map(function (n) { return n.source; });
    var neighbors = nb_l;
    for (i in nb_r) {
        if (! nb_r[i] in neighbors)
           neighbors.push(nb_r[i]) 
    }
    return neighbors;

}

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
            var tar = addNode(words[i]);
            edges.push({"source": src, "target": tar, "value": weight})
            weight -= 1;
        }
    });

    return {"nodes": nodes, "edges": edges}
}



