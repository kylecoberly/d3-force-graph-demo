import { min, max } from "d3"
import options from "./rendering/options.js"

const {
	chart: {
		transitionRate,
		boundary,
	},
} = options

export function getCentroids(nodes) {
	const groupCoordinates = getGroupCoordinates(nodes)

	const centroids = Object
		.entries(groupCoordinates)
		.reduce((centroids, [group, coordinates]) => {
			const count = coordinates.length;
			let tx = 0;
			let ty = 0;

			coordinates.forEach(([x, y]) => {
				tx += x;
				ty += y;
			})

			const cx = tx / count;
			const cy = ty / count;

			centroids[group] = { x: cx, y: cy }

			return centroids
		}, {})

	return centroids
}

function getGroupCoordinates(nodes) {
	return nodes.reduce((groupCoordinates, node) => {
		groupCoordinates[node.group] = groupCoordinates[node.group] || []
		groupCoordinates[node.group].push([node.x, node.y])
		return groupCoordinates
	}, {})
}

export function toDegrees(radians) {
	return radians * (180 / Math.PI)
}

export function move(selection, offset = { x: 2, y: 2 }) {
	selection
		.transition()
		.duration(transitionRate)
		.attr("x", ({ x }) => clampToInteger(x - offset.x, -boundary.x, boundary.x))
		.attr("y", ({ y }) => clampToInteger(y - offset.y, -boundary.y, boundary.y))
}

export function fadeIn(selection) {
	selection
		.transition()
		.duration(transitionRate)
		.style("opacity", 1)
}

export function clampToInteger(value, lowerBound, upperBound) {
	return Math.round(
		max([
			min([
				value,
				lowerBound,
			]),
			upperBound,
		])
	)
}
