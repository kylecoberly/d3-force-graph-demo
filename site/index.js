import data from "./data.json"
const { nodes, links, groups } = data
import { renderSimulation, initializeSimulation } from "./chart/simulation/simulation.js"
import { resetZoom } from "./chart/rendering/chart.js"
import { select } from "d3"

const $nodeFiltersList = document.querySelector("#node-filters-list")
const $resetFilters = document.querySelector("#reset-filters")

const $allOption = document.createElement("option")
$allOption.value = "all"
$allOption.textContent = "All"
$nodeFiltersList.append($allOption)

const simulation = initializeSimulation()
renderSimulation({ simulation, nodes, links, groups })

Object.values(groups)
	.map(group => {
		const $option = document.createElement("option")
		$option.textContent = group.label
		$option.value = group.id
		return $option
	}).forEach($option => {
		$nodeFiltersList.append($option)
	})

$resetFilters.addEventListener("click", () => {
	rerender("all")
})

$nodeFiltersList.addEventListener("input", (event) => {
	rerender(event.target.value)
})

function rerender(id) {
	const normalizedLinks = id === "all"
		? links
		: links.filter(({ source, target }) => [source.group, target.group].includes(id))
	const uniqueNodeIds = Array.from(
		(new Set(
			normalizedLinks.flatMap(({ source, target }) => (
				[source.id, target.id]
			))
		))
	)
	const uniqueNodes = nodes.filter(node => uniqueNodeIds.includes(node.id))
	const normalizedGroups = id === "all"
		? groups
		: { [id]: groups[id] }

	renderSimulation({
		simulation,
		nodes: uniqueNodes,
		links: normalizedLinks,
		groups: normalizedGroups,
	})
}

select(window).on("resize", () => {
	resetZoom(window.innerWidth)
})
