function renderChartEstados(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    container.selectAll("*").remove();

    const chartData = data;
    const total = d3.sum(chartData, d => d.cantidad);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // We can use a Treemap or a Horizontal Stack. Let's do horizontal bars for states.
    const margin = { top: 20, right: 30, bottom: 20, left: 140 };

    const x = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.cantidad)]).nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
        .domain(chartData.map(d => d.estado))
        .range([margin.top, height - margin.bottom])
        .padding(0.2);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, chartData.length + 2]);

    // Grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(4).tickSize(-height + margin.top + margin.bottom).tickFormat(""));

    // Bars
    svg.selectAll("rect")
        .data(chartData)
        .join("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.estado))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => color(i + 3))
        .attr("rx", 4)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("opacity", 0.8);
            const pct = ((d.cantidad / total) * 100).toFixed(1);
            window.showTooltip(`<strong>${d.estado}</strong>${d.cantidad.toLocaleString()} solicitudes (${pct}%)`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1);
            window.hideTooltip();
        })
        .attr("width", 0)
        .transition().duration(800)
        .delay((d, i) => i * 100)
        .attr("width", d => x(d.cantidad) - x(0));

    // Y Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .attr("dx", "-5px")
        .style("font-size", "10px");

    // Value labels
    svg.selectAll(".value-label")
        .data(chartData)
        .join("text")
        .attr("class", "value-label")
        .attr("y", d => y(d.estado) + y.bandwidth() / 2 + 4)
        .attr("x", x(0) + 5)
        .text(d => d.cantidad)
        .style("fill", "#fff")
        .style("font-size", "10px")
        .style("opacity", 0)
        .transition().duration(800).delay(800)
        .style("opacity", 1)
        .attr("x", d => x(d.cantidad) + 5)
        .style("fill", d => x(d.cantidad) - x(0) < 30 ? "#94a3b8" : "var(--text-sec)");
}
