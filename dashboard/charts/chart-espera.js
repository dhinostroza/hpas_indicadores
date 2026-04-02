function renderChartEspera(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    container.selectAll("*").remove();

    // Data for Treemap needs a root node
    const rootData = {
        name: "Root",
        children: data
    };

    const root = d3.hierarchy(rootData)
        .sum(d => d.turnos_en_espera)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .paddingInner(2)
        .paddingOuter(2)
        .round(true)
        (root);

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Color
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.especialidad))
        .range(["#1e40af", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]);

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
        .attr("fill", d => color(d.data.especialidad))
        .attr("width", 0)
        .attr("height", 0)
        .attr("rx", 3)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("opacity", 0.8);
            const trend = d.data.tendencia;
            const trendText = trend > 0 ? `▲ +${trend}` : (trend < 0 ? `▼ ${trend}` : `▶ 0`);
            window.showTooltip(`<strong>${d.data.especialidad}</strong>${d.data.turnos_en_espera.toLocaleString()} turnos en espera<br/>Tendencia vs. ciclo anterior: ${trendText}`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1);
            window.hideTooltip();
        })
        .transition().duration(1000).delay((d, i) => i * 50)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    leaf.append("text")
        .selectAll("tspan")
        .data(d => d.data.especialidad.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 12)
        .text(d => d)
        .style("font-size", d => (d.x1 - d.x0) < 55 || (d.y1 - d.y0) < 30 ? "0px" : "10px")
        .style("fill", "#fff")
        .style("opacity", 0)
        .transition().duration(800).delay(800)
        .style("opacity", 0.9);

    leaf.append("text")
        .attr("x", 4)
        .attr("y", d => (d.y1 - d.y0) - 6)
        .html(d => {
            const t = d.data.tendencia;
            let arrow = ""; let tColor = "#fff";
            if (t > 0) { arrow = "▲ +" + t; tColor = "#fca5a5"; } // Red for waitlist increase (bad)
            else if (t < 0) { arrow = "▼ " + t; tColor = "#86efac"; } // Green for decrease (good)
            else { arrow = "▶ 0"; tColor = "#cbd5e1"; }
            return `${d.data.turnos_en_espera} <tspan fill="${tColor}" font-size="10px" font-weight="normal">${arrow}</tspan>`;
        })
        .style("font-size", d => (d.x1 - d.x0) < 65 || (d.y1 - d.y0) < 40 ? "0px" : "12px")
        .style("font-weight", "600")
        .style("fill", "#fff")
        .style("opacity", 0)
        .transition().duration(800).delay(800)
        .style("opacity", 1);
}
