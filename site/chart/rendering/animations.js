import { min, max } from "d3"
import options from "./options.js"
import getSmoothHull from "./hull.js"

const {
	chart: {
		transitionRate,
		boundary,
	},
} = options

export function move(selection, offset = { x: 0, y: 0 }) {
	selection
		.transition()
		.duration(transitionRate)
		.attr("x", ({ x }) => clampToInteger(x - offset.x, -boundary.x, boundary.x))
		.attr("y", ({ y }) => clampToInteger(y - offset.y, -boundary.y, boundary.y))
		.selection()
}

export function movePath(selection) {
	selection
		.transition()
		.duration(transitionRate)
		.attr("d", ({ points }) => getSmoothHull(points))
}

export function moveLink(selection) {
	const offset = {
		x: 0,
		y: -1,
	}

	selection.transition()
		.duration(transitionRate)
		.attr("transform", ({ target, source }) => {
			const dx = target.x - source.x
			const dy = target.y - source.y
			const angle = toDegrees(Math.atan2(dy, dx))
			return `rotate(${angle}) translate(${offset.x}, ${offset.y})`
		})
}

export function fadeIn(selection) {
	selection
		.transition()
		.duration(transitionRate)
		.style("opacity", 1)
		.selection()
}

function clampToInteger(value, lowerBound, upperBound) {
	return Math.round(
		max([
			min([
				value,
				upperBound,
			]),
			lowerBound,
		])
	)
}

function toDegrees(radians) {
	return radians * (180 / Math.PI)
}
