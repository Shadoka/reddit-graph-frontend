import React from 'react';

const d3 = require('d3');

const friend_data = {
    "tilmann": ["max", "tobi", "michael"],
    "tobi": ["max", "tilmann"],
    "yanick": ["michael"],
    "michael": ["tobi", "max", "tilmann", "yanick"],
    "max": ["tobi"]
};

let drag = simulation => {
    function dragStarted(event) {
        if (!event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event) {
        if (!event.active) {
            simulation.alphaTarget(0);
        }
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}

class FriendGraph extends React.Component {

    componentDidMount() {
        const data = this.convertToGraphData();

        const nodes = data.nodes.map(d => Object.create(d));
        const links = data.links.map(d => Object.create(d));

        const width = 600;
        const height = 600;

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.name))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        var svg = d3.select(this.node)
            .attr("viewBox", [0, 0, width, height]);
        
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1);

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "green")
            .call(drag(simulation));

        node.append("title").text(d => d.name);

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });
    }
    
    render() {
        return (
            <div id='canvas'>
                <svg ref={node => this.node = node} width='600px' height='600px'>
                </svg>
            </div>
        );
    }

    convertToGraphData() {
        var nodes = [];
        var links = [];

        for (const [user, friends] of Object.entries(friend_data)) {
            let current_node = {
                "name": user,
                "size": friends.length
            };
            nodes.push(current_node);

            for (const friend of friends) {
                let current_link = {
                    "source": user,
                    "target": friend
                };
                links.push(current_link);
            }
        }

        return {
            "nodes": nodes,
            "links": links
        };
    }

    maxAmountFriends() {
        var result = 0;
        for (const [user, friends] of Object.entries(friend_data)) {
            if (friends.length > result) {
                result = friends.length;
            }
        }
        return result;
    }
}

export default FriendGraph;