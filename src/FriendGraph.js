import React from 'react';

const d3 = require('d3');

const BASE_RADIUS = 25;

const friend_data = {
    "tilmann": ["max", "tobi", "michael"],
    "tobi": ["max", "tilmann"],
    "yanick": ["michael"],
    "michael": ["tobi", "max", "tilmann", "yanick"],
    "max": ["tobi"]
};

const FRIENDS_KEY = "friends";
const GRAPH_INFO_KEY = "graph";

class FriendGraph extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const enriched_data = this.addGraphInformation();

        var svg = d3.select(this.node);
        
        var circles = svg.selectAll("circle")
                        .data(enriched_data)
                        .enter()
                        .append("circle");
        
        var drawn_circles = circles.attr("cx", d => d["graph"].cx)
            .attr("cy", d => d["graph"].cy)
            .attr("r", d => d["graph"].r)
            .style("fill", d => d["graph"].fill)
            .style("stroke", "black")
            .style("stroke-width", 1.5);
    }
    
    render() {
        return (
            <div id='canvas'>
                <svg ref={node => this.node = node} width='100%' height='100%'>
                </svg>
            </div>
        );
    }

    addGraphInformation() {
        var enriched_friend_data = [];

        const start_x = 125;
        // 125 is max radius, we add 10 for some padding
        const start_y = 135;
        const distance = 50;
        const max_friends = this.maxAmountFriends();
        const radius_per_friend = 100 / max_friends;

        var counter = 0;
        for (const user of Object.keys(friend_data)) {
            const friends = friend_data[user];

            let radius = BASE_RADIUS + (friends.length * radius_per_friend);
            let current_x = start_x + (counter * 125) + distance;

            const enriched_friend = {
                "name": user,
                "friends": friends,
                "graph": {
                    cx: current_x,
                    cy: start_y,
                    r: radius,
                    fill: "none"
                }
            };
            enriched_friend_data.push(enriched_friend);

            counter++;
        }

        return enriched_friend_data;
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