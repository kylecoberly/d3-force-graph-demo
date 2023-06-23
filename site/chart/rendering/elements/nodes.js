import { centerNode, showDetails } from "../chart.js"
import { getLinkCounts, fadeIn } from "../../utilities.js"

export default function renderNodes(node, links) {
	const linkCounts = getLinkCounts(links)

	node
		.classed("open", ({ id }) => linkCounts[id]?.to === 0)
		.classed("closed", ({ id }) => linkCounts[id]?.to !== 0)
		.classed("completed", ({ complete }) => complete)
		.classed("in-progress", ({ in_progress }) => in_progress)
		.classed("critical", ({ critical }) => critical)
		.on("click", (_, d) => {
			centerNode(d.x, d.y)
			showDetails(d)
		})
		.call(fadeIn)
}
