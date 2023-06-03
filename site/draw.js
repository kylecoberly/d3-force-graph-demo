import simulation from "./simulation"
import clampToBoundary from "./clamp"
import getLinkLine from "./link-line"
import attractGroups from "./attract-groups"
import shapeLinks from "./shape-links"

export function ticked({ circle, link, text }) {
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
