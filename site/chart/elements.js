import { select } from "d3"
import data from "../data.json"
import {
	centerToRadius,
	getSegmentCount,
	clampToLowerBound,
	generateMidPoints,
	scale,
} from "./utilities.js"
import { bounds } from "./chart.js"

export const { nodes, links } = data

export const linkGroup = bounds
	.selectAll(".link")
	.data(links)
	.join("g")

export const link = linkGroup
	.append("polyline")
	.attr("marker-mid", "url(#arrow)")
	.classed("link", true)

export const node = bounds
	.selectAll(".node")
	.data(nodes)
	.join("g")
	.classed("node", true)

export const text = node
	.append("text")
	.classed("label", true)

export function addMarchingAnts(element, id) {
	select(element)
		.append("path")
		.attr("transform", `scale(.1)`)
		.classed("arrow", true)
		.attr("d", `
			M 0 0
			L 10 5
			L 0 10
			L 5 5
			z
		`)
		.classed("ant", true)
		.append("animateMotion")
		.attr("dur", "3s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", `#link-${id}`)
}

export function addCircles(element, linkCounts) {
	select(element)
		.append("use")
		.attr("href", "#circle")
		.attr("cx", d => d.x)
		.attr("cy", d => d.y)
		.attr("transform", d => `translate(${d.x} ${d.y})`)
		.classed("open", (d) => linkCounts[d.id]?.to === 0)
		.classed("closed", (d) => linkCounts[d.id]?.to !== 0)
		.classed("completed", (d) => d.complete)
		.classed("in-progress", (d) => d["in_progress"])
		.classed("critical", (d) => d.critical)
		.on("click", (event) => {
			const { cx, cy } = event.target.attributes
			// centerNode(cx.value, cy.value)
		})
}

export function addLink(element) {
	select(element)
		.append("polyline")
		.attr("marker-mid", "url(#arrow)")
		.classed("link", true)
		.attr("id", (d) => `link-${d.source.id}${d.target.id}`.replaceAll(" ", ""))
		.attr("points", getLinkLine)
}

export function addTextLabel(element) {
	const {
		textOffset,
	} = {
		textOffset: {
			x: 2.5,
			y: 7,
		},
	}

	select(element)
		.attr("x", d => d.x + textOffset.x)
		.attr("y", d => d.y + textOffset.y)
		.attr("text-anchor", "middle")
		.text(d => d.id)
}

export function getLinkLine({ source, target }) {
	const {
		source: normalizedSource,
		target: normalizedTarget
	} = centerToRadius(3, scale({ source, target }, 1))

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
