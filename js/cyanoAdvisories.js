const advisories = [
    {
        year: '2009',
        days: 42,
    },
    {
        year: '2010',
        days: 77,
    },
    {
        year: '2012',
        days: 63,
    },
    {
        year: '2013',
        days: 14,
    },
    {
        year: '2014',
        days: 38,
    },
    {
        year: '2015',
        days: 86,
    },
    {
        year: '2016',
        days: 76,
    },
    {
        year: '2017',
        days: 46,
    },
    {
        year: '2018',
        days: 40,
    },
];

const svg = d3.select('svg');
const svgContainer = d3.select('#cyanoAdvisoriesChart');

const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(advisories.map((s) => s.year))
    .padding(0.4)

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);

// grid lines

const makeYLines = () => d3.axisLeft()
    .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));


chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )

const barGroups = chart.selectAll()
    .data(advisories)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.year))
    .attr('y', (g) => yScale(g.days))
    .attr('height', (g) => height - yScale(g.days))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3.selectAll('.days')
            .attr('opacity', 0)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.year) - 5)
            .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.days)

        line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)

        barGroups.append('text')
            .attr('class', 'numdays')
            .attr('x', (a) => xScale(a.year) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.days) + 30)
            .attr('text-anchor', 'middle')
            .text((a) => `${a.days} days`)

    })
    .on('mouseleave', function () {
        d3.selectAll('.days')
            .attr('opacity', 1)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.year))
            .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.numdays').remove()

    })

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Number of Summer Advisory Days (Unswimmable)')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Year')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text(' Massachusetts Department of Public Health (MDPH) Cyanobacteria Advisories')


// design from https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/