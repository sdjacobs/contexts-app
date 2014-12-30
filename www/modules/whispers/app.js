function main(viz, dispatch) {

    var content = d3.select(viz)

    dispatch.on("graph", setup);
    
    function setup(data) {
        var graph = data.graph;
        var svg = d3.select(data.container);
        var node = svg.selectAll(".node")

        var color = d3.scale.category20();
        var whispers = makeWhispers();

        d3.select("#runWhispers")
            .on("click", function() {
                    graph.stop()
                    whispers.start()
            });

        d3.select("#animateTicks").on("change", function() { whispers.animateTicks(d3.event.target.checked); });

        d3.select("#stopWhispers").on("click", whispers.end)

        var i = 0;
        whispers
            .nodes(graph.nodes())
            .edges(graph.edges())
            .on("tick", function(evt) {
                node.style("fill", function(d) { return color(d.group); })
            })
            .on("step", function(evt) {
                d3.select("#nIterations").text(String(i))
                d3.select("#nGroups").text(String(lengthNonNull(evt.groups)));
                node.style("fill", function(d) { return color(d.group); })
                i++;
             })
            .on("end.g", function(evt) { i = 0; makeGroupList(graph.nodes()) })

    }

  
  
    function lengthNonNull(a) {
        return a.filter(function(d) { return d != 0 }).length
    }

    function makeGroupList(nodes) {
        var nodesByGroup = {}
        nodes.forEach(function(d) {
            g = d.group.toString()
            if (nodesByGroup[g] == undefined)
                nodesByGroup[g] = []
            nodesByGroup[g].push(d.label) 
        })
       
        content.selectAll("*").remove()

        content.append("ul")
            .selectAll("li")
            .data(d3.entries(nodesByGroup)).enter()
            .append("li")
            .text(function(d) { return d.key + ": " + d.value.join(", ") })
    }

}


define(['d3', 'chinese-whispers'], function(d3, makeWhispers) { 
    return main;
});
