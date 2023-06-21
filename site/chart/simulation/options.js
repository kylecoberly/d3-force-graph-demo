const options = {
	simulation: {
		tickCount: 300,
		alphaCutoff: 0.3,
	},
	forces: {
		positional: {
			x: 0,
			y: 0,
		},
		charge: {
			initial: -100,
			final: -10,
		},
		collision: {
			initial: 0,
			final: 0,
		},
		link: {
			distance: {
				initial: 0.1,
				final: 1,
			},
			strength: {
				initial: 0.2,
				final: 0.9,
			},
		},
		group: {
			charge: {
				initial: 0.5,
				final: 0.5,
			},
			link: {
				strength: {
					initial: 1,
					final: 0.5,
				},
			},
			distance: {
				cutoff: 30,
				rate: 100,
			},
		},
	},
}

export default options
