function renderChartEpi(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const chartData = data;

    container.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 20, left: 240 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.consultas)])
        .range([margin.left, width - margin.right - 20]);

    const y = d3.scaleBand()
        .domain(chartData.map(d => d.codigo_cie10))
        .range([margin.top, height - margin.bottom])
        .padding(0.25);

    // Bars
    svg.selectAll("rect")
        .data(chartData)
        .join("rect")
        .attr("x", margin.left)
        .attr("y", d => y(d.codigo_cie10))
        .attr("height", y.bandwidth())
        .attr("fill", "var(--brand-emerald)")
        .attr("rx", 2)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("fill", "#34d399"); // hover explicit color
            window.showTooltip(`<strong>${d.codigo_cie10}</strong>${d.descripcion}<br/>${d.consultas} consultas (${d.porcentaje}%)`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("fill", "var(--brand-emerald)");
            window.hideTooltip();
        })
        .attr("width", 0)
        .transition().duration(1000).delay((d, i) => i * 50)
        .attr("width", d => x(d.consultas) - margin.left);

    // Labels (Placed on the left panel completely isolated from bars)
    svg.selectAll(".epi-label")
        .data(chartData)
        .join("text")
        .attr("class", "epi-label")
        .attr("x", 10)
        .attr("y", d => y(d.codigo_cie10) + y.bandwidth() / 2 + 4)
        .text(d => `${d.codigo_cie10}: ${d.descripcion.length > 32 ? d.descripcion.substring(0, 32) + '...' : d.descripcion}`)
        .style("fill", "#f8fafc")
        .style("font-size", "11px")
        .style("pointer-events", "none");

    // Values right aligned cleanly near the end of the bar
    svg.selectAll(".epi-value")
        .data(chartData)
        .join("text")
        .attr("class", "epi-value")
        .attr("y", d => y(d.codigo_cie10) + y.bandwidth() / 2 + 4)
        .text(d => d.consultas.toLocaleString())
        .style("fill", "#94a3b8")
        .style("font-size", "11px")
        .style("opacity", 0)
        .attr("x", d => x(d.consultas) + 5)
        .transition().duration(1000).delay(500)
        .style("opacity", 1);
}
