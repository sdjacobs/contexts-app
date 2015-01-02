define(["d3", "filepicker", "chinese-whispers"], function(d3, filepicker, makeWhispers) {

    
    var controls = {};
    controls.whispers = makeWhispers();
    
    d3.select("#addColor").on("click", function() {
        if (! controls.groupsByWord) {
            alert("Load data or run an algorithm to generate groups.")
        }
        else if (! controls.color) {
            alert("Load a graph.");
        }
        else 
            controls.color()
    });



    d3.select("#inputAlgo").on("click", function() {
        d3.select("#algorithm-controls").style("visibility", "visible");
        d3.select("#groupsFile").attr("disabled", true);
        d3.select("#addColor").attr("disabled", true);
    });

    d3.select("#inputFile").on("click", function() {
        d3.select("#algorithm-controls").style("visibility", "hidden");
        d3.select("#groupsFile").attr("disabled", null);
        d3.select("#addColor").attr("disabled", null);
    });


    d3.select("#groupsFile").call(filepicker(), ["12dicts-categories.csv"], loadData);
    function loadData(x) {
        var data = d3.csv.parse(x);
        controls.groupsByWord = {}
        data.forEach(function(d) {
            controls.groupsByWord[d.word] = d.group;
        });
        if (controls.color)
            updateGroups()
    }

    function getGraph(data) {
        controls.graph = data.graph;
        controls.nodes = data.graph.nodes();
        controls.edges = data.graph.edges();
        controls.container = data.container;
        controls.type = data.type;
        
        var node = d3.select(controls.container).selectAll(".node"),
            color = d3.scale.category20();
        if (data.type == "svg") {
            controls.color = (function() {
                node.style("fill", function(d) { return color(d.group); })
            })
        }
        else {
            controls.color = (function() {
                controls.nodes.forEach(function(d) {
                    d.color = color(d.group);
                });
                controls.graph.redraw();
            });
        }

        if (controls.groupsByWord)
            updateGroups()

        initWhispers();
    }



    function updateGroups() {
        controls.nodes.forEach(function(d) {
            d.group = controls.groupsByWord[d.label] || "other";
        });
        makeGroupList();
    }

    function makeGroupList() {
        var nodesByGroup = {},
            nodes = controls.nodes,
            content = d3.select(controls.viz);

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
    
    /* Chinese whispers control code */

    d3.select("#runWhispers").on("click", function() {
        controls.graph.stop()
        controls.whispers.start();
    });

   d3.select("#animateTicks").on("change", function() { whispers.animateTicks(d3.event.target.checked); });

   d3.select("#stopWhispers").on("click", controls.whispers.end)

   function initWhispers() {
        var i = 0;
        controls.whispers
            .nodes(controls.nodes)
            .edges(controls.edges)
            .on("tick", controls.color)
            .on("step", function(evt) {
                d3.select("#nIterations").text(String(i))
                d3.select("#nGroups").text(String(lengthNonNull(evt.groups)));
                controls.color();
                i++;
             })
            .on("end.g", function(evt) { i = 0; makeGroupList(controls.nodes) })
   }

    function lengthNonNull(a) {
        return a.filter(function(d) { return d != 0 }).length
    }
   

    

    return function(viz, dispatch) {
        controls.viz = viz;
        dispatch.on("graph", getGraph);
    };

});
