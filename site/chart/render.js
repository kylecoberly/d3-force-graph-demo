import { select } from "d3"
import {
	toDegrees,
} from "./utilities.js"
import "./icons.js"
import {
	centerNode,
	showDetails,
} from "./focus.js"

export default function render({ linkGroup, node, linkCounts, text }) {
	node
		.each((_, i, nodes) => {
			addCircles(nodes[i], linkCounts)
		})

	text
		.each((_, i, nodes) => {
			addTextLabel(nodes[i])
		})

	linkGroup
		.each(({ source, target }, i, nodes) => {
			addLink(nodes[i])
			addMarchingAnts(nodes[i], { source, target })
		})
}

function addCircles(element, linkCounts) {
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

function addTextLabel(element) {
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

function addLink(element) {
	return select(element)
		.append("path")
		.classed("link", true)
		.attr("id", (d) => `link-${d.source.id}${d.target.id}`.replaceAll(" ", ""))
		.attr("d", ({ source, target }) => {
			return `M${source.x},${source.y} ${target.x},${target.y}`
		})
}

function addMarchingAnts(element, { source, target }) {
	const id = `${source.id}${target.id}`.replaceAll(" ", "")
	const dx = target.x - source.x
	const dy = target.y - source.y
	const angle = toDegrees(Math.atan2(dy, dx))

	select(element)
		.append("g")
		.append("use")
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
}
