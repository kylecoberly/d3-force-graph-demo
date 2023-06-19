import { node } from "./chart/data.js"
import data from "./data.json"
const { nodes, links, groups } = data
import { rerun, initializeSimulation } from "./chart/simulation.js"
import { select } from "d3"

const $nodeFiltersList = document.querySelector("#node-filters-list")
const $resetFilters = document.querySelector("#reset-filters")

const $allOption = document.createElement("option")
$allOption.value = "all"
$allOption.textContent = "All"
$nodeFiltersList.append($allOption)

const simulation = initializeSimulation()
rerun({ simulation, nodes, links, groups })

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
	node.data(nodes)
})

$nodeFiltersList.addEventListener("input", (event) => {
	const id = event.target.value
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
		: Object.values(groups).filter((group) => group.id === id)

	rerun({
		simulation,
		nodes: uniqueNodes,
		links: normalizedLinks,
		groups: normalizedGroups,
	})
})

select(window).on("resize", () => {
	simulation.restart()
	rerun({ simulation, nodes, links, groups })
})
