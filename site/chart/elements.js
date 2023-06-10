import { select } from "d3"
import data from "../data.json"
import {
	centerToRadius,
	getSegmentCount,
	clampToLowerBound,
	generateMidPoints,
	scale,
} from "./utilities.js"
import { svg, bounds } from "./chart.js"

export const { nodes, links } = data

export const linkGroup = bounds
	.selectAll(".link")
	.data(links)
	.join("g")

export const node = bounds
	.selectAll(".node")
	.data(nodes)
	.join("g")
	.classed("node", true)

export const text = node
	.append("text")
	.classed("label", true)

const defs = svg.append("defs")

// Arrow symbol
const arrow = defs
	.append("symbol")
	.attr("id", "arrow")
	.attr("viewBox", "0 0 10 10")
	.attr("width", 2)
	.attr("height", 2)
	.append("path")
	.classed("arrow", true)
	.attr("d", `
			M 0 0
			L 10 5
			L 0 10
			L 5 5
			z
		`)

// Circle Node
defs
	.append("symbol")
	.attr("id", "circle")
	.attr("viewBox", "-5 -5 10 10")
	.attr("width", 4)
	.attr("height", 4)
	.append("circle")
	.attr("r", 4)
	.attr("cx", 0)
	.attr("cr", 0)

export function addMarchingAnts(element, { source, target }) {
	const id = `${source.id}${target.id}`.replaceAll(" ", "")
	// const { source: normalizedSource, target: normalizedTarget } = centerToRadius(4, { source, target })
	const angle = Math.atan2(target.y - source.y, target.x - source.x) * (180 / Math.PI)

	const arrow = select(element)
		.append("g")

	arrow.append("animateMotion")
		.attr("dur", "3s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", `#link-${id}`)

	arrow.append("use")
		.attr("href", "#arrow")
		.classed("ant", true)
		.attr("transform", `translate(10 6) rotate(${angle})`)

	return arrow
}

export function addCircles(element, linkCounts) {
	return select(element)
		.append("g")
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
		.attr("transform", d => `translate(${d.x - 2} ${d.y - 2})`) // Account for radius
		.classed("open", (d) => linkCounts[d.id]?.to === 0)
		.classed("closed", (d) => linkCounts[d.id]?.to !== 0)
		.classed("completed", (d) => d.complete)
		.classed("in-progress", (d) => d["in_progress"])
		.classed("critical", (d) => d.critical)
		.on("click", (event) => {
			const { cx, cy } = event.target.attributes
			// centerNode(cx.value, cy.value)
		})
		.append("use")
		.attr("href", "#circle")
}

export function addLink(element) {
	return select(element)
		.append("polyline")
		.classed("link", true)
		.attr("id", (d) => `link-${d.source.id}${d.target.id}`.replaceAll(" ", ""))
		.attr("points", getLinkLine)
}

export function addTextLabel(element) {
	const {
		textOffset,
	} = {
		textOffset: {
			x: 2.1,
			y: 6,
		},
	}

	return select(element)
		.attr("x", d => d.x + textOffset.x)
		.attr("y", d => d.y + textOffset.y)
		.attr("text-anchor", "middle")
		.text(d => d.id)
}

export function getLinkLine({ source, target }) {
	const {
		source: normalizedSource,
		target: normalizedTarget
	} = centerToRadius(6, { source, target })

	const segmentCount = getSegmentCount(2, { source: normalizedSource, target: normalizedTarget })
	const segments = generateMidPoints(
		clampToLowerBound(1, segmentCount - 1),
		{
			source: normalizedSource,
			target: normalizedTarget,
		},
	)

	return [
		normalizedSource.x, normalizedSource.y,
		...segments,
		normalizedTarget.x, normalizedTarget.y,
	]
}

export function positionArrow(arrow) {
	const offset = "-10 -5"

	return arrow.attr("transform", `translate(${offset})`)
}
