import data from "./data.json"
const { nodes, links, groups } = data
import runSimulation from "./chart/simulation/simulation.js"
import render from "./chart/rendering/render.js"

const $nodeFiltersList = document.querySelector("#node-filters-list")

const $allOption = document.createElement("option")
$allOption.value = "all"
$allOption.textContent = "All"
$nodeFiltersList.append($allOption)

Object.values(groups)
	.map(group => {
		const $option = document.createElement("option")
		$option.textContent = group.label
		$option.value = group.id
		return $option
	}).forEach($option => {
		$nodeFiltersList.append($option)
	})

const $resetFilters = document.querySelector("#reset-filters")
$resetFilters.addEventListener("click", () => {
	rerender("all")
})

$nodeFiltersList.addEventListener("input", (event) => {
	rerender(event.target.value)
})

const simulation = runSimulation({ nodes, links, groups })
render({ nodes, links, groups })

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

	runSimulation({
		simulation,
		nodes: uniqueNodes,
		links: normalizedLinks,
		groups: normalizedGroups,
	})
	render({
		nodes: uniqueNodes,
		links: normalizedLinks,
		groups: normalizedGroups
	})
}
