import { zoom as Zoom, zoomIdentity, interpolate } from "d3"
import { zoom as zoomOptions, chart } from "./options.js"

const {
	initial,
	minimum,
	maximum,
	constraintFactor,
} = zoomOptions

const {
	width,
	height,
} = chart

const zoom = Zoom()
	.interpolate(interpolate)
	.scaleExtent([minimum, maximum])
	.translateExtent([
		[
			width / -constraintFactor, height / -constraintFactor
		], [
			width / constraintFactor, height / constraintFactor
		]
	])

export function attachZoom({ bounds, svg }) {
	svg
		.call(zoom)
		.call(() => {
			zoom.on("zoom", ({ transform }) => {
				bounds.attr("transform", transform)
			})
		})
		.call(
			zoom.transform,
			zoomIdentity
				.translate(0, 0)
				.scale(initial)
		)
}

export default zoom
