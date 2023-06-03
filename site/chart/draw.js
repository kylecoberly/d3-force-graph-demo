import simulation from "./simulation.js"
import clampToBoundary from "./rendering/clamp.js"
import getLinkLine from "./rendering/link-line.js"
import attractGroups from "./rendering/attract-groups.js"
import shapeLinks from "./rendering/shape-links.js"

export default function ticked({ circle, link, text }) {
	return () => {
		const nodes = simulation.nodes()
		const alpha = simulation.alpha()

		attractGroups(nodes, alpha)
		clampToBoundary(nodes, 300)
		shapeLinks(simulation, alpha)

		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)

		link
			.attr("points", getLinkLine)

		text
			.attr("x", d => d.x)
			.attr("y", d => d.y + 6)
			.attr("text-anchor", "middle")
			.text(d => d.id)
	}
}
