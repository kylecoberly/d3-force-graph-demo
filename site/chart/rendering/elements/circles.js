import { fadeIn } from "../../utilities.js"

export default function addCircles(node) {
	const { width, height } = {
		width: 4,
		height: 4,
	}
	const offset = {
		x: 2,
		y: 2,
	}

	node
		.append("use")
		.attr("width", width)
		.attr("height", height)
		.attr("x", ({ x }) => Math.round(x - offset.x))
		.attr("y", ({ y }) => Math.round(y - offset.y))
		.attr("href", "#circle")
		.call(fadeIn)
}
