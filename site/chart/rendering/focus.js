import { select, zoomIdentity } from "d3"
import { focus } from "./options.js"
const {
	duration,
	scale,
} = focus
import zoom from "./zoom.js"

export function showDetails({ id }) {
	select("#container .details")
		.classed("open", true)
		.html(`
			<h2>${id}</h2>
			<p>${id}</p>
		`)
}

export function centerNode(x, y) {
	const transform = zoomIdentity.scale(scale).translate(-x, -y)
	select("#container svg")
		.transition()
		.duration(duration)
		.call(zoom.transform, transform)
}
