import { fadeIn } from "../../utilities.js"

export default function addLabels(node) {
	const offset = {
		x: 0,
		y: 4,
	}

	node
		.append("text")
		.classed("label", true)
		.attr("x", ({ x }) => Math.round(x + offset.x))
		.attr("y", ({ y }) => Math.round(y + offset.y))
		.attr("text-anchor", "middle")
		.text(({ id }) => id)
		.call(fadeIn)
}
