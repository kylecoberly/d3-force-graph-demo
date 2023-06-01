// const width = 400
// const height = 300
const svg = d3.select("svg")
	.attr("viewBox", [-50, -50, 100, 100]);

// Get data
const { nodes, links } = await d3.json("data.json")

// Set up simulation
const simulation = d3.forceSimulation()
	.force("charge", d3.forceManyBody())
	.force("link", d3.forceLink().id(d => d.id))
	.force("x", d3.forceX())
	.force("y", d3.forceY())
	.on("tick", ticked)
	.nodes(nodes)
	.force("link").links(links)

// Create nodes and lines
let link = svg.selectAll(".link")
	.data(links)
	.join("line")
	.attr("class", "link")
let node = svg.selectAll(".node")
	.data(nodes)
	.join("circle")
	.attr("class", "node")
	.attr("r", 6)
	.style("fill", d => d.id)

// Position nodes and lines
function ticked() {
	node.attr("cx", d => d.x)
		.attr("cy", d => d.y);

	link.attr("x1", d => d.source.x)
		.attr("y1", d => d.source.y)
		.attr("x2", d => d.target.x)
		.attr("y2", d => d.target.y);
}
