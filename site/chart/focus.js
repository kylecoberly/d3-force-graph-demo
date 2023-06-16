import { zoomIdentity } from "d3"
import { svg } from "./chart.js"
import options from "./options.js"
const {
	duration,
	scale,
} = options.focus

const $details = document.querySelector(".details")

export function attachFocus(svg) {
	svg.on("click", (event) => {
		if (event.target.tagName !== "use") {
			$details.classList.remove("open")
		}
	})
}

export function showDetails(d) {
	$details.classList.add("open")
	$details.innerHTML = `
			<h2>${d.id}</h2>
			<p>${d.id}</p>
		`
}

export function centerNode(x, y) {
	const transform = zoomIdentity.translate(-x, -y).scale(scale)

	svg
		.transition()
		.duration(duration)
		.call(zoom.transform, transform)
}
