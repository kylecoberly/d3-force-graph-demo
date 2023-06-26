import { select, zoomIdentity } from "d3"
import { move, fadeIn } from "../../utilities.js"
import { zoom } from "../zoom.js"
import options from "../options.js"

const {
	focus: settings,
	chart: {
		nodeDiameter
	},
} = options

export default function renderNodes(node, links) {
	node
		.append("use")
		.attr("width", nodeDiameter)
		.attr("height", nodeDiameter)
		.attr("href", "#circle")
		.call(move)

	const linkCounts = getLinkCounts(links)
	node
		.classed("open", ({ id }) => linkCounts[id]?.to === 0)
		.classed("closed", ({ id }) => linkCounts[id]?.to !== 0)
		.classed("completed", ({ complete }) => complete)
		.classed("in-progress", ({ in_progress }) => in_progress)
		.classed("critical", ({ critical }) => critical)
		.on("click", (_, d) => {
			const svg = select("#container svg")
			centerNode({ element: svg, zoom, x: d.x, y: d.y, settings })
			showDetails(d)
		})

	node
		.append("text")
		.classed("label", true)
		.attr("text-anchor", "middle")
		.text(({ id }) => id)
		.call(move, { x: 0, y: 4 })
}

function centerNode({ element, zoom, x, y, settings }) {
	const { scale, duration } = settings
	const transform = zoomIdentity
		.scale(scale)
		.translate(-x, -y)

	element
		.transition()
		.duration(duration)
		.selection()
		.call(zoom.transform, transform)
}

function showDetails({ id }) {
	select("#container .details")
		.classed("open", true)
		.html(`
			<h2>${id}</h2>
			<p>${id}</p>
		`)
}

function getLinkCounts(links) {
	return links.reduce((counts, link) => {
		counts[link.source.id] = counts[link.source.id] || { from: 0, to: 0 }
		counts[link.target.id] = counts[link.target.id] || { from: 0, to: 0 }
		counts[link.source.id].from = counts[link.source.id].from + 1
		counts[link.target.id].to = counts[link.target.id].to + 1
		return counts
	}, {})
}

