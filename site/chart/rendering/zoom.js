import { select, zoomIdentity, zoom as Zoom, interpolate } from "d3"
import options from "./options.js"

const {
	chart: { width, height, resetScalingFactor },
	zoom: {
		initialScale,
		initialCoordinates,
		minimum,
		maximum,
		constraintFactor,
	},
} = options

export const zoom = Zoom()
	.interpolate(interpolate)
	.scaleExtent([minimum, maximum])
	.translateExtent([
		[width / -constraintFactor, height / -constraintFactor],
		[width / constraintFactor, height / constraintFactor]
	])

export function initializeZoom(svg) {
	const { x, y } = initialCoordinates
	const initialTransform = zoomIdentity
		.translate(x, y)
		.scale(initialScale)

	svg.call(zoom.transform, initialTransform)

	select(window).on("resize", () => {
		resetZoom(svg)
	})
}

export function attachZoomListener(bounds, zoom) {
	zoom.on("zoom", ({ transform }) => {
		bounds.attr("transform", transform)
	})
}

export function resetZoom(element, currentWidth = window.innerWidth) {
	const widthRatio = currentWidth / width
	const newScale = widthRatio * resetScalingFactor
	const initialTransform = zoomIdentity.scale(newScale)

	element.call(zoom.transform, initialTransform)
}
