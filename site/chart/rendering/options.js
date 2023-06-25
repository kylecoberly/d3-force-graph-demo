const options = {
	chart: {
		height: window.innerHeight * 0.8,
		width: window.innerWidth * 0.8,
		boundary: window.innerWidth * 0.7,
		resetScalingFactor: 5,
		transitionRate: 500,
		hullPadding: 5,
		nodeDiameter: 4,
	},
	zoom: {
		initialScale: 4,
		initialCoordinates: { x: 0, y: 0 },
		minimum: 4,
		maximum: 30,
		constraintFactor: 7,
	},
	focus: {
		duration: 500,
		scale: 18,
	},
}

export default options
