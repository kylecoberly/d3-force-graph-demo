import { select } from "d3"
import data from "../data.json"
import {
	centerToRadius,
	getSegmentCount,
	clampToLowerBound,
	generateMidPoints,
} from "./utilities.js"
import { svg, bounds, centerNode } from "./chart.js"

const $details = document.querySelector(".details")

export const { nodes, links } = data

export const linkGroup = bounds
	.selectAll(".link")
	.data(links)
	.join("g")

svg.on("click", function(event) {
	if (event.target.tagName !== "use") {
		$details.classList.remove("open")
	}
})

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
defs
	.append("symbol")
	.attr("id", "arrow")
	.attr("viewBox", "0 0 10 10")
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
	.append("circle")
	.attr("r", 4)
	.attr("cx", 0)
	.attr("cr", 0)

function toDegrees(radians) {
	return radians * (180 / Math.PI)
}

export function addMarchingAnts(element, { source, target }) {
	const id = `${source.id}${target.id}`.replaceAll(" ", "")
	const dx = target.x - source.x
	const dy = target.y - source.y
	const angle = toDegrees(Math.atan2(dy, dx))

	const arrow = select(element)
		.append("g")

	arrow.append("use")
		.attr("href", "#arrow")
		.attr("width", 2)
		.attr("height", 2)
		.classed("ant", true)
		.attr("transform", `rotate(${angle}) translate(0, -1)`)
		.append("animateMotion")
		.attr("dur", "0.5s")
		.attr("repeatCount", "indefinite")
		.append("mpath")
		.attr("href", `#link-${id}`)

	return arrow
}

export function addCircles(element, linkCounts) {
	const offset = {
		x: 2,
		y: 2,
	}
	return select(element)
		.append("g")
		.classed("open", (d) => linkCounts[d.id]?.to === 0)
		.classed("closed", (d) => linkCounts[d.id]?.to !== 0)
		.classed("completed", (d) => d.complete)
		.classed("in-progress", (d) => d["in_progress"])
		.classed("critical", (d) => d.critical)
		.on("click", (_, d) => {
			centerNode(d.x, d.y)
			showDetails(d)
		})
		.append("use")
		.attr("width", 4)
		.attr("height", 4)
		.attr("x", d => Math.round(d.x - offset.x))
		.attr("y", d => Math.round(d.y - offset.y))
		.attr("href", "#circle")
}

function showDetails(d) {
	$details.classList.add("open")
	$details.innerHTML = `
			<h2>${d.id}</h2>
			<p>${d.id}</p>
		`
}

export function addLink(element) {
	return select(element)
		.append("path")
		.classed("link", true)
		.attr("id", (d) => `link-${d.source.id}${d.target.id}`.replaceAll(" ", ""))
		.attr("d", ({ source, target }) => {
			return `M${source.x},${source.y} ${target.x},${target.y}`
		})
}

export function addTextLabel(element) {
	const {
		textOffset,
	} = {
		textOffset: {
			x: 0,
			y: 4,
		},
	}

	return select(element)
		.attr("x", d => Math.round(d.x + textOffset.x))
		.attr("y", d => Math.round(d.y + textOffset.y))
		.attr("text-anchor", "middle")
		.text(d => d.id)
}

export function getLinkLine({ source, target }) {
	const {
		source: normalizedSource,
		target: normalizedTarget
	} = centerToRadius(4, { source, target })

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
