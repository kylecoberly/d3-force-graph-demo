import { zoom as _zoom, zoomIdentity, interpolate } from "d3"
import { zoom, dimensions } from "./options.js"

const {
	initial,
	minimum,
	maximum,
	constraintFactor,
} = zoom

const {
	width,
	height,
} = dimensions

export function attachZoom({ bounds, svg }) {
	const zoom = _zoom()
		.interpolate(interpolate)
		.scaleExtent([minimum, maximum])
		.translateExtent([
			[
				width / -constraintFactor, height / -constraintFactor
			], [
				width / constraintFactor, height / constraintFactor
			]
		]).on("zoom", ({ transform }) => {
			bounds.attr("transform", transform)
		})

	svg
		.call(zoom)
		.call(
			zoom.transform,
			zoomIdentity
				.translate(width / -constraintFactor, height / -constraintFactor)
				.scale(initial)
		)
}
