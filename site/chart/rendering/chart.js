import { select } from "d3"
import { addArrow, addCircle } from "./elements/icons.js"
import options from "./options.js"
import {
	zoom,
	attachZoomListener,
	initializeZoom,
	resetZoom
} from "./zoom.js"

const {
	chart: { width, height },
} = options

const svg = select("#container")
	.append("svg")
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [width / -2, height / -2, width, height])
	.call(attachFocusListener)
	.call(zoom)
	.call(resetZoom)
	.append("g")
	.classed("bounds", true)
	.attr("width", `${width}`)
	.attr("height", `${height}`)
	.call(attachZoomListener, zoom)

svg.call(initializeZoom)

svg.append("defs")
	.call(addArrow)
	.call(addCircle)

function attachFocusListener(svg) {
	svg.on("click", (event) => {
		if (event.target.tagName !== "use") {
			select("#container .details")
				.classed("open", false)
		}
	})
}
