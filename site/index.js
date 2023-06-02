import * as d3 from "d3"

// 1. Access the data
import data from "./data.json"
const { nodes, links } = data
// const { nodes, links } = await d3.json("./data.json")

const linkCounts = links.reduce((counts, link) => {
	counts[link.source] = counts[link.source] ?? { from: 0, to: 0 }
	counts[link.target] = counts[link.target] ?? { from: 0, to: 0 }
	counts[link.source].from = counts[link.source].from + 1
	counts[link.target].to = counts[link.target].to + 1
	return counts
}, {})

// 2. Create chart dimensions
const { width, height, margin } = getDimensions({
	// width: d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]),
	width: window.innerWidth * 0.9,
	height: window.innerHeight * 0.9,
	margin: {
		top: 10,
		right: 10,
		bottom: 10,
		left: 10,
	},
})
const { top, right, bottom, left } = margin

// 3. Draw canvas (chart and bounds)
const container = d3.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", [-50, -50, 100, 100])

const bounds = container
	.append("g")
// 	.style("transform", `translate(
// 	${left}px,
// 	${top}px
// )`)

const zoomCover = container.append("rect")
	.attr("width", width)
	.attr("height", height)
	.style("fill", "none")
	.style("pointer-events", "all")

// 4. Create scales (for every data-to-physical transformation you need)
const simulation = d3.forceSimulation()
	.force("charge", d3.forceManyBody()
		.strength(-100)
	).force("x", d3.forceX(0))
	.force("y", d3.forceY(0))
	.force("collision", d3.forceCollide(3))
	.force("link", d3.forceLink()
		.id(d => d.id)
		.distance(3)
		.strength(link => {
			if (link.source.group === link.target.group) {
				return 1
			} else {
				return 0.1
			}
		})
	).nodes(nodes)

// 5. Draw data

let link = bounds.selectAll(".link")
	.data(links)
	.join("polyline")
	.attr("stroke", "black")
	.attr("marker-start", "url(#arrow)")
	.attr("marker-mid", "url(#arrow)")
	.attr("marker-end", "url(#arrow)")
	.attr("fill", "none")
	.attr("class", "link")

let node = bounds.selectAll(".node")
	.data(nodes)
	.join("g")
	.attr("class", "node")

let circle = node.append("circle")
	.attr("r", 2)
	.attr("fill", "white")

let text = node.append("text")
	.attr("class", "label")

simulation.on("tick", ticked({ node, circle, link, text }))
	.force("link")
	.links(links)

// 6. Draw peripherals (axes, labels, legends)

// Arrows
container
	.append("defs")
	.append("marker")
	.attr("id", "arrow")
	.attr("viewBox", [0, 0, 10, 10])
	.attr("refX", 5)
	.attr("refY", 5)
	.attr("markerWidth", 3)
	.attr("markerHeight", 3)
	.attr("orient", "auto")
	.attr("class", "arrow")
	.append("path")
	.attr("d", `
		M 0 0
		L 10 5
		L 0 10
		z
	`)


// 7. Set up interactions (event listeners)

// Enable Zoom
const zoom = d3.zoom()
	.scaleExtent([1 / 3, 6])
	.on("zoom", ({ transform }) => bounds.attr("transform", transform))

zoomCover
	.call(zoom)
	.call(zoom.translateTo, 0, 0);

d3.select(window).on("resize", () => {
	simulation.restart()
})


// Utilities

// Position nodes and lines
function ticked({ node, circle, link, text }) {
	return () => {
		const nodes = simulation.nodes()

		const groupCoordinates = nodes.reduce((groupCoordinates, node) => {
			// Initialize
			groupCoordinates[node.group] = groupCoordinates[node.group] || []
			groupCoordinates[node.group].push([node.x, node.y])
			return groupCoordinates
		}, {})

		const centroids = Object.entries(groupCoordinates).reduce((centroids, [group, coordinates]) => {
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

		// don't modify points close the the group centroid:
		let minDistance = 3;

		// modify the min distance as the force cools:
		const alpha = simulation.alpha()
		if (simulation < 0.2) {
			minDistance = 3 + (1000 * (0.2 - alpha))
		}

		nodes.forEach(d => {
			const cx = centroids[d.group].x;
			const cy = centroids[d.group].y;
			const x = d.x;
			const y = d.y;

			const dx = cx - x;
			const dy = cy - y;
			const r = Math.sqrt(dx * dx + dy * dy)

			// if (r > minDistance) {
			// 	d.x = x * 0.9 + cx * 0.1;
			// 	d.y = y * 0.9 + cy * 0.1;
			// }
		})
		nodes.forEach(d => {
			d.x = d3.max([d.x, -300])
			d.y = d3.max([d.y, -300])
			d.x = d3.min([d.x, 300])
			d.y = d3.min([d.y, 300])
		})

		// Weaken charge and strengthen links over time
		if (alpha < 0.2) {
			simulation.force("charge", d3.forceManyBody()
				.strength(-20)
			)
				.force("link", d3.forceLink()
					.id(d => d.id)
					.distance(3)
					.strength(1)
				)
		}

		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)

		link
			.attr("points", d => {
				const radius = 4
				const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x)
				const cosine = Math.cos(angle) * radius
				const sine = Math.sin(angle) * radius
				return [
					// x1
					d.source.x + cosine,
					// y1
					d.source.y + sine,
					// Midpoint
					(d.source.x / 2) + (d.target.x / 2), (d.source.y / 2) + (d.target.y / 2),
					// x2
					d.target.x - cosine,
					// y2
					d.target.y - sine,
				]
			})

		text
			.attr("x", d => d.x)
			.attr("y", d => d.y + 6)
			.attr("text-anchor", "middle")
			.text(d => d.id)
	}
}

// Get dimensions, including dynamic ones
function getDimensions(baseDimensions) {
	const { height, width, margin } = baseDimensions
	const { top, bottom, left, right } = margin
	const boundedDimensions = {
		boundedHeight: height - top - bottom,
		boundedWidth: width - left - right,
	}

	return {
		...baseDimensions,
		...boundedDimensions,
	}
}

/*
////////
	
let force1 = null
let force2 = null
let nodes1 = null
let nodes2 = null
let links1 = null
let links2 = null
	
var force1 = null, force2 = null,
	nodes1 = null, nodes2 = null,
	links1 = null, links2 = null;
	
// We can also create the SVG container that will hold the
// visualization. D3 makes it easy to set this container's
// dimensions and add it to the DOM.
	
var svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height);
	
// Now we'll define a few helper functions. You might not
// need to make these named function in a typical visualization,
// but they'll make it easy to control the visualization in
// this case.
	
// First up is a function to initialize our visualization.
	
var initForce = function() {
	
	// Before we do anything else, we clear out the contents
	// of the SVG container. This step makes it possible to
	// restart the layout without refreshing the page.
	
	svg.selectAll('*').remove();
	
	// Define the data for the example. In general, a force layout
	// requires two data arrays. The first array, here named `nodes`,
	// contains the object that are the focal point of the visualization.
	// The second array, called `links` below, identifies all the links
	// between the nodes. (The more mathematical term is "edges.")
	
	// As far as D3 is concerned, nodes are arbitrary objects.
	// Normally the objects wouldn't be initialized with `x` and `y`
	// properties like we're doing below. When those properties are
	// present, they tell D3 where to place the nodes before the force
	// layout starts its magic. More typically, they're left out of the
	// nodes and D3 picks random locations for each node. We're defining
	// them here so we can get a consistent application of the layout.
	
	// Because we're running two layouts in parallel, we have two
	// separate sets of nodes and links. The only difference between
	// the two, however, is that one is an inverted version of the other
	
	var dataNodes1 = [
		{ x: 4 * width / 10, y: 6 * height / 9 },
		{ x: 6 * width / 10, y: 6 * height / 9 },
		{ x: width / 2, y: 7 * height / 9 },
		{ x: 4 * width / 10, y: 7 * height / 9 },
		{ x: 6 * width / 10, y: 7 * height / 9 },
		{ x: width / 2, y: 5 * height / 9 }
	];
	
	var dataNodes2 = [
		{ x: 4 * width / 10, y: 3 * height / 9 },
		{ x: 6 * width / 10, y: 3 * height / 9 },
		{ x: width / 2, y: 2 * height / 9 },
		{ x: 4 * width / 10, y: 2 * height / 9 },
		{ x: 6 * width / 10, y: 2 * height / 9 },
		{ x: width / 2, y: 4 * height / 9 }
	];
	
	// The `links` array contains objects with a `source` and a `target`
	// property. The values of those properties are the indices in
	// the `nodes` array of the two endpoints of the link. Our links
	// bind the first three nodes into one graph and leave the last
	// two nodes isolated.
	
	var dataLinks1 = [
		{ source: 0, target: 1 },
		{ source: 1, target: 2 },
		{ source: 2, target: 0 }
	];
	
	var dataLinks2 = [
		{ source: 0, target: 1 },
		{ source: 1, target: 2 },
		{ source: 2, target: 0 }
	];
	
	// Now we create a force layout objects and define their properties.
	// Those include the dimensions of the visualization and the arrays
	// of nodes and links.
	
	force1 = d3.layout.force()
		.size([width, height])
		.nodes(dataNodes1)
		.links(dataLinks1);
	
	force2 = d3.layout.force()
		.size([width, height])
		.nodes(dataNodes2)
		.links(dataLinks2);
	
	// The only difference between the two layouts is that we remove
	// the gravity from the second layout. The first retains its
	// default value.
	
	force2.gravity(0);
	
	// Define the `linkDistance` for the graph. This is the
	// distance we desire between connected nodes.
	
	force1.linkDistance(height / 2);
	force2.linkDistance(height / 2);
	
	// Now we'll add the nodes and links to the visualization.
	// Note that we're just sticking them into the SVG container
	// at this point. We start with the links. The order here is
	// important because we want the nodes to appear "on top of"
	// the links. SVG doesn't really have a convenient equivalent
	// to HTML's `z-index`; instead it relies on the order of the
	// elements in the markup. By adding the nodes _after_ the
	// links we ensure that nodes appear on top of links.
	
	// Links are pretty simple. They're just SVG lines. We're going
	// to position the lines according to the centers of their
	// source and target nodes. You'll note that the `source`
	// and `target` properties are indices into the `nodes`
	// array. That's how our data is structured and that's how
	// D3's force layout expects its inputs. As soon as the layout
	// begins executing, however, it's going to replace those
	// properties with references to the actual node objects
	// instead of indices.
	
	links1 = svg.selectAll('.link1')
		.data(dataLinks1)
		.enter().append('line')
		.attr('class', 'link1')
		.attr('x1', function(d) { return dataNodes1[d.source].x; })
		.attr('y1', function(d) { return dataNodes1[d.source].y; })
		.attr('x2', function(d) { return dataNodes1[d.target].x; })
		.attr('y2', function(d) { return dataNodes1[d.target].y; });
	
	// Now it's the nodes turn. Each node is drawn as a circle and
	// given a radius and initial position within the SVG container.
	// As is normal with SVG circles, the position is specified by
	// the `cx` and `cy` attributes, which define the center of the
	// circle. We actually don't have to position the nodes to start
	// off, as the force layout is going to immediately move them.
	// But this makes it a little easier to see what's going on
	// before we start the layout executing.
	
	nodes1 = svg.selectAll('.node1')
		.data(dataNodes1)
		.enter().append('circle')
		.attr('class', 'node1')
		.attr('r', width / 40)
		.attr('cx', function(d) { return d.x; })
		.attr('cy', function(d) { return d.y; });
	
	// Same code but for the second layout.
	
	links2 = svg.selectAll('.link2')
		.data(dataLinks2)
		.enter().append('line')
		.attr('class', 'link2')
		.attr('x1', function(d) { return dataNodes2[d.source].x; })
		.attr('y1', function(d) { return dataNodes2[d.source].y; })
		.attr('x2', function(d) { return dataNodes2[d.target].x; })
		.attr('y2', function(d) { return dataNodes2[d.target].y; });
	
	nodes2 = svg.selectAll('.node2')
		.data(dataNodes2)
		.enter().append('circle')
		.attr('class', 'node2')
		.attr('r', width / 40)
		.attr('cx', function(d) { return d.x; })
		.attr('cy', function(d) { return d.y; });
	
	// Finally we tell D3 that we want it to call the step
	// function at each iteration. Although it's less efficient,
	// we'll let the same function handle both layouts.
	
	force1.on('tick', stepForce1);
	force2.on('tick', stepForce2);
	
};
	
// The next function is the event handler that will execute
// at each iteration of the layout.
	
var stepForce1 = function() {
	
	// When this function executes, the force layout
	// calculations have been updated. The layout will
	// have set various properties in our nodes and
	// links objects that we can use to position them
	// within the SVG container.
	
	// First let's reposition the nodes. As the force
	// layout runs it updates the `x` and `y` properties
	// that define where the node should be centered.
	// To move the node, we set the appropriate SVG
	// attributes to their new values.
	
	// The code here differs depending on whether or
	// not we're running the layout at full speed.
	// In full speed we simply set the new positions.
	
	if (force1.fullSpeed) {
	
		nodes1.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });
	
		// Otherwise, we use a transition to move them to
		// their positions instead of simply setting the
		// values abruptly.
	
	} else {
	
		nodes1.transition().ease('linear').duration(animationStep)
			.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });
	}
	
	// We also need to update positions of the links.
	// For those elements, the force layout sets the
	// `source` and `target` properties, specifying
	// `x` and `y` values in each case.
	
	// Here's where you can see how the force layout has
	// changed the `source` and `target` properties of
	// the links. Now that the layout has executed at least
	// one iteration, the indices have been replaced by
	// references to the node objects.
	
	// As with the nodes, at full speed we don't use any
	// transitions.
	
	if (force1.fullSpeed) {
	
		links1.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	
	} else {
	
		links1.transition().ease('linear').duration(animationStep)
			.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	}
	
	// Unless the layout is operating at normal speed, we
	// only want to show one step at a time.
	
	if (!force1.fullSpeed) {
		force1.stop();
	}
	
	// If we're animating the layout in slow motion, continue
	// after a delay to allow the animation to take effect.
	
	if (force1.slowMotion) {
		setTimeout(
			function() { force1.start(); },
			animationStep
		);
	}
	
}
	
// Same function but for the second layout. This could
// obviously be simplified to reuse code for both layouts,
// but we'll keep them separate so that the code itself
// is a little easier to read.
	
var stepForce2 = function() {
	
	// When this function executes, the force layout
	// calculations have been updated. The layout will
	// have set various properties in our nodes and
	// links objects that we can use to position them
	// within the SVG container.
	
	// First let's reposition the nodes. As the force
	// layout runs it updates the `x` and `y` properties
	// that define where the node should be centered.
	// To move the node, we set the appropriate SVG
	// attributes to their new values.
	
	// The code here differs depending on whether or
	// not we're running the layout at full speed.
	// In full speed we simply set the new positions.
	
	if (force2.fullSpeed) {
	
		nodes2.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });
	
		// Otherwise, we use a transition to move them to
		// their positions instead of simply setting the
		// values abruptly.
	
	} else {
	
		nodes2.transition().ease('linear').duration(animationStep)
			.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });
	
	}
	
	// We also need to update positions of the links.
	// For those elements, the force layout sets the
	// `source` and `target` properties, specifying
	// `x` and `y` values in each case.
	
	// Here's where you can see how the force layout has
	// changed the `source` and `target` properties of
	// the links. Now that the layout has executed at least
	// one iteration, the indices have been replaced by
	// references to the node objects.
	
	// As with the nodes, at full speed we don't use any
	// transitions.
	
	if (force2.fullSpeed) {
	
		links2.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	
	} else {
	
		links2.transition().ease('linear').duration(animationStep)
			.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	
	}
	
	// Unless the layout is operating at normal speed, we
	// only want to show one step at a time.
	
	if (!force2.fullSpeed) {
		force2.stop();
	}
	
	// If we're animating the layout in slow motion, continue
	// after a delay to allow the animation to take effect.
	
	if (force2.slowMotion) {
		setTimeout(
			function() { force2.start(); },
			animationStep
		);
	}
	
}
	
// Now let's take care of the user interaction controls.
// We'll add functions to respond to clicks on the individual
// buttons.
	
// When the user clicks on the "Advance" button, we
// start the force layout (The tick handler will stop
// the layout after one iteration.)
	
d3.select('#advance').on('click', function() {
	
	force1.start();
	force2.start();
	
});
	
// When the user clicks on the "Slow Motion" button, we're
// going to run the force layouts until they concludes.
	
d3.select('#slow').on('click', function() {
	
	// Indicate that the animation is in progress.
	
	force1.slowMotion = force2.slowMotion = true;
	force1.fullSpeed = force2.fullSpeed = false;
	
	// Get the animations rolling
	
	force1.start();
	force2.start();
	
});
	
// When the user clicks on the "Slow Motion" button, we're
// going to run the force layout until it concludes.
	
d3.select('#play').on('click', function() {
	
	// Indicate that the full speed operation is in progress.
	
	force1.slowMotion = force2.slowMotion = false;
	force1.fullSpeed = force2.fullSpeed = true;
	
	// Get the animations rolling
	
	force1.start();
	force2.start();
	
});
	
// When the user clicks on the "Reset" button, we'll
// start the whole process over again.
	
d3.select('#reset').on('click', function() {
	
	// If we've already started the layout, stop it.
	if (force1) {
		force1.stop();
	}
	if (force2) {
		force2.stop();
	}
	
	// Re-initialize to start over again.
	
	initForce();
	
});
	
// Now we can initialize the force layout so that it's ready
// to run.
	
initForce();
	
*/
