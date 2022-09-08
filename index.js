const plotWidth = 800
const plotHeight = 600
const padding = 60
let state = false

const barColor = "#607EAA"
const selectionColor = "#1C3879"

const toolTipEl = document.getElementById("tooltip")

const onHover = event => {
    const [ date, gdp ] = event.target.__data__
    
    event.target.style["fill"] = selectionColor

    toolTipEl.style.display = "inline"

    let i = parseInt(event.target.attributes.x.nodeValue)
    toolTipEl.style.transform = `translate(${i - 300}px, ${0}px)`
    
    toolTipEl.innerHTML = 
    `<div class="date-holder">
        date: ${date}
    </div>
    <div class="gdp-holder">
        gdp: ${gdp}
    <div>`
    
    toolTipEl.attributes[1].value = date
    
    console.log(i)
}

const onOut = event => {
    toolTipEl.style.display = "none"
    event.target.style["fill"] = barColor
}

const plotGraph = data => {
    // data.forEach(item => console.log(`date: ${item[0]}, gdp: ${item[1]}`))
    // console.log(data.length)
    // console.log(d3.min(data, d => parseInt(d)))

    const barWidth = plotWidth/data.length

    const xScale = d3
                    .scaleLinear()
                    .domain([0, data.length])
                    .range([0, plotWidth - 2*padding])

    const xScale2 = d3
                    .scaleLinear()
                    .domain([parseInt(data[0][0]), parseInt(data[data.length - 1][0])])
                    .range([0, plotWidth - 2*padding])

    const yScale2 = d3
                    .scaleLinear()
                    .domain([0, d3.max(data, d => d[1])])
                    .range([plotHeight - 2*padding, 0])

    const yScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(data, d => d[1])])
                    .range([0, plotHeight - 2*padding])

    const svg = d3
        .select("#container")
        .append("svg")
        .attr("width", plotWidth)
        .attr("height", plotHeight)
    
    svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("onmouseover", "onHover(event)")
        .attr("onmouseout", "onOut(event)")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("fill", barColor)
        .attr("width", barWidth)
        .attr("height", d => { return yScale(d[1])})
        .attr("x", (d, i) => xScale(i) + padding)
        .attr("y", d => plotHeight - yScale(d[1]) - padding)

    
    const xAxis = d3
        .axisBottom(xScale2)
        .tickFormat(d3.format("d"))

    const yAxis = d3.axisLeft(yScale2)

    svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${padding}, ${plotHeight - padding})`)
        .call(xAxis)

    svg
        .append('text')
        .attr('text-anchor', 'middle')
        // .attr('transform', 'rotate(-90)')
        .attr("transform", `translate(${plotWidth/2}, ${plotHeight - padding + 40})`)
        .text('Year')
    
    svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, ${padding})`)
        .call(yAxis)

    svg
        .append('text')
        .attr('text-anchor', 'middle')
        // .attr('transform', 'rotate(-90)')
        .attr("transform", `translate(${padding + 25}, ${plotHeight/2}) rotate(-90)`)
        .text('Gross Domestic Product (billion $US)')
      
}

const getData = url => {
    fetch(url)
        .then(response => response.json())
        .then(({ data }) => plotGraph(data))
}

getData("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")