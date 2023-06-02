// 1. Access the data
const { nodes, links } = await d3.json("data.json")

// 2. Create chart dimensions
const { width, height, margin } = getDimensions({
	width: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
	height: window.innerHeight * 0.9,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	},
})
const { top, right, bottom, left } = margin

// 3. Draw canvas (chart and bounds)
const container = d3.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [0, 0, 100, 100])

const bounds = container
	.append("g")
// 	.style("transform", `translate(
// 	${left}px,
// 	${top}px
// )`)

const zoomCover = container.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "none")
	.style("pointer-events", "all")

// 4. Create scales (for every data-to-physical transformation you need)
const simulation = d3.forceSimulation()
	.force("charge", d3.forceManyBody())
	.force("link", d3.forceLink().id(d => d.id))
	.force("x", d3.forceX(50))
	.force("y", d3.forceY(50))
	.nodes(nodes)

// 5. Draw data

let link = bounds.selectAll(".link")
	.data(links)
	.join("polyline")
	.attr("stroke", "black")
	.attr("marker-start", "url(#arrow)")
	.attr("marker-mid", "url(#arrow)")
	.attr("marker-end", "url(#arrow)")
	.attr("fill", "none")
	.attr("class", "link")

let node = bounds.selectAll(".node")
	.data(nodes)
	.join("g")
	.attr("class", "node")

let circle = node.append("circle")
	.attr("r", 2)
	.attr("fill", "white")

let text = node.append("text")
	.attr("class", "label")


simulation.on("tick", ticked({ node, circle, link, text }))
	.force("link")
	.links(links)


// 6. Draw peripherals (axes, labels, legends)

// Arrows
container
	.append("defs")
	.append("marker")
	.attr("id", "arrow")
	.attr("viewBox", [0, 0, 10, 10])
	.attr("refX", 5)
	.attr("refY", 5)
	.attr("markerWidth", 3)
	.attr("markerHeight", 3)
	.attr("orient", "auto")
	.attr("class", "arrow")
	.append("path")
	.attr("d", `
		M 0 0
		L 10 5
		L 0 10
		z
	`)


// 7. Set up interactions (event listeners)

// Enable Zoom
const zoom = d3.zoom()
	.scaleExtent([1 / 3, 6])
	.on("zoom", ({ transform }) => bounds.attr("transform", transform))

zoomCover
	.call(zoom)
	.call(zoom.translateTo, 0, 0);

// const attachZoomControls = d3.zoom()
// 	.on("zoom", zoomed);
// attachZoomControls(container); //adding the zoom event handler to the svg container

// Utilities

// Position nodes and lines
function ticked({ node, circle, link, text }) {
	return () => {
		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);

		link
			.attr("points", d => {
				const radius = 4
				const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x)
				const cosine = Math.cos(angle) * radius
				const sine = Math.sin(angle) * radius
				return [
					// x1
					d.source.x + cosine,
					// y1
					d.source.y + sine,
					// Midpoint
					(d.source.x / 2) + (d.target.x / 2), (d.source.y / 2) + (d.target.y / 2),
					// x2
					d.target.x - cosine,
					// y2
					d.target.y - sine,
				]
			})

		text
			.attr("x", d => d.x)
			.attr("y", d => d.y + 6)
			.attr("text-anchor", "middle")
			.text(d => d.id)
	}
}

// Get dimensions, including dynamic ones
function getDimensions(baseDimensions) {
	const { height, width, margin } = baseDimensions
	const { top, bottom, left, right } = margin
	const boundedDimensions = {
		boundedHeight: height - top - bottom,
		boundedWidth: width - left - right,
	}

	return {
		...baseDimensions,
		...boundedDimensions,
	}
}
