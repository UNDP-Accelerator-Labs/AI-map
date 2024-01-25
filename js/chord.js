const basecolors = {
	'dark-blue': '#005687',
	'mid-blue': '#0468b1',
	'light-blue': '#32bee1',
	'dark-red': '#a51e41',
	'mid-red': '#fa1c26',
	'light-red': '#f03c8c',
	'dark-green': '#418246',
	'mid-green': '#61b233',
	'light-green': '#b4dc28',
	'dark-yellow': '#fa7814',
	'mid-yellow': '#ffc10e',
	'light-yellow': '#fff32a',
	'dark-grey': '#000000',
	'mid-grey': '#646464',
	'light-grey': '#969696',
}
const colors = [
	basecolors['mid-blue'],
	basecolors['mid-yellow'],
	basecolors['light-red'],
	basecolors['light-green']
]

function setupSVG (kwargs) {
	const { width, height } = kwargs
	const svg = d3.select('svg')
	.attrs({ 
		'x': 0,
		'y':0,
		'viewBox': `0 0 ${width} ${height}`,
		'preserveAspectRatio': 'xMidYMid meet'
	})
	return svg
}

function drawDendogram () {
	const { clientWidth: cw, clientHeight: ch, offsetWidth: ow, offsetHeight: oh } = d3.select('body').node()
	const width = Math.round(Math.min(cw ?? ow, ch ?? oh))
	const height = width
	const padding = 60
	const edit_layout = true

	const svg = setupSVG({ width, height })

	d3.csv('../data/acclab_data_innovation.csv')
	.then(data => {
		data.shuffle()
		const levels = ['Lab', 'Aggregate datasource', 'Area'].reverse()
		// const levels = ['Lab', 'Datasource', 'Aggregate datasource', 'Area'].reverse()
		
		const lists = levels.map(d => {
			return {
				key: d,
				values: data.unique(d, true).sort((a, b) => a?.localeCompare(b))
			}
		})

		const x = levels.map((d, i) => {
			return d3.scaleLinear()
			.range([padding, width - padding])
			.domain([0, lists.find(c => c.key === d).values.length + 2])
		})	

		const y = d3.scaleLinear()
			.range([padding, height - padding])
			.domain([0, levels.length])

		const rows = svg.addElems('g', 'level', levels)
		.attr('transform', (d, i) => `translate(${[0, y(i)]})`)
		const base = rows.addElems('g', 'base', d => {
			const entries = lists.find(c => c.key === d).values
			return entries.map(c => {
				const obj = {}
				obj.level = levels.indexOf(d)
				obj.value = c
				return obj
			})
		}).attr('transform', (d, i) => {
			let y = 0
			if (d.level === 0) {
				if (i % 2 !== 0) y = -45
				else y = -15
			} else if (d.level % 2 === 0) {
				if (i % 2 !== 0) y = 45
				else y = 15
			}
			return `translate(${[x[d.level](i + 1), y]})`
		})
		base.addElems('text')
		.styles({
			'text-anchor': 'middle',
			'font-face': 'Helvetica, Arial, Sans-serif',
			'font-size': '12px',
			'fill': basecolors['mid-grey'],
		}).text(d => d.value)

		let hierarchy = []
		levels.forEach((d, i) => {
			if (i > 0) {
				const prev = levels[i - 1]
				const nest = data.nest(c => `${c[prev]}---${c[d]}`)
				nest.forEach(c => {
					const sources = lists.find(c => c.key === prev).values
					const targets = lists.find(c => c.key === d).values

					c.source = c.key.split('---')[0]
					c.target = c.key.split('---')[1]

					let x1 = x[levels.indexOf(prev)](sources.indexOf(c.source) + 1)
					let x2 = x[levels.indexOf(d)](targets.indexOf(c.target) + 1)
					let y1 = levels.indexOf(prev) % 2 === 0 ? y(levels.indexOf(prev)) : y(levels.indexOf(prev)) + 10
					let y2 = levels.indexOf(d) % 2 === 0 ? y(levels.indexOf(d)) : y(levels.indexOf(d)) - 15

					if (i - 1 === 0) {
						if (sources.indexOf(c.source) % 2 !== 0) y1 -= 35
					} else if (i % 2 === 0) {
						if (targets.indexOf(c.target) % 2 !== 0) y2 += 30
					}

					c.from = [x1, y1]
					c.q1 = [x1, y1 + (y2 - y1) / 2]
					c.q2 = [x2, y1 + (y2 - y1) / 2]
					c.to = [x2, y2]
				})
				hierarchy.push(nest)
			}
		})
		hierarchy = hierarchy.flat()

		const w = d3.scaleLinear()
			.domain([1, d3.max(hierarchy, d => d.count)])
			.range([1, 10])

		svg.addElems('path', 'connection', hierarchy)
		.attr('d', d => `M ${d.from.join(' ')} C ${d.q1.join(' ')}, ${d.q2.join(' ')}, ${d.to.join(' ')}`)
		.styles({
			'stroke': d => {
				const values = lists.find(c => c.key === 'Aggregate datasource').values
				if (values.includes(d.source)) return colors[values.indexOf(d.source)]
				else if (values.includes(d.target)) return colors[values.indexOf(d.target)]
				
			},'fill': 'none',
			'stroke-width': d => w(d.count),
			'stroke-linecap': 'round',
			'stroke-opacity': .5
		})



	}).catch(err => console.log(err))
}


document.addEventListener('DOMContentLoaded', drawDendogram)