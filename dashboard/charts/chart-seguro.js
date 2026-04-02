function renderChartSeguro(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    container.selectAll("*").remove();

    // Sum quantities by seguro
    const summary = d3.rollup(data,
        v => d3.sum(v, d => d.cantidad),
        d => d.tipo_seguro
    );
    const chartData = Array.from(summary, ([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);

    // Give more space (160px) for the legend on the right
    const radius = Math.min(width - 160, height) / 2 - 20;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${(width - 160) / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.key))
        .range(["#8b5cf6", "#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#06b6d4"]);

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.55).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(radius * 0.55).outerRadius(radius + 10);

    const arcs = svg.selectAll("path")
        .data(pie(chartData))
        .join("path")
        .attr("fill", d => color(d.data.key))
        .attr("stroke", "#1a1d29")
        .attr("stroke-width", "2px")
        .on("mouseenter", function (event, d) {
            d3.select(this).transition().duration(200).attr("d", arcHover);
            window.showTooltip(`<strong>${d.data.key}</strong>${d.data.value.toLocaleString()} pacientes`, event);
        })
        .on("mouseleave", function (event, d) {
            d3.select(this).transition().duration(200).attr("d", arc);
            window.hideTooltip();
        });

    // Animate
    arcs.transition().duration(1000)
        .attrTween("d", function (d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) { return arc(i(t)); }
        });

    // Legend placed right aligned
    const legend = container.select("svg").append("g")
        .attr("transform", `translate(${width - 150}, ${height / 2 - (chartData.length * 12)})`);

    chartData.forEach((d, i) => {
        const lg = legend.append("g").attr("transform", `translate(0, ${i * 24})`);
        lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(d.key)).attr("rx", 3);

        let label = d.key;
        if (label.length > 20) label = label.substring(0, 19) + '...';
        lg.append("text").attr("x", 20).attr("y", 10).text(label)
            .style("fill", "#94a3b8").style("font-size", "11px");
    });
}
