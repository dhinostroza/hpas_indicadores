function renderChartTurnos(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    container.selectAll("*").remove();

    // Grouping by especialidad for stacked bars (Marzo vs Abril)
    const grouped = d3.rollup(data,
        v => {
            let mar = 0, abr = 0;
            v.forEach(d => {
                if (d.mes === 'mar') mar = d.turnos_disponibles;
                if (d.mes === 'abr') abr = d.turnos_disponibles;
            });
            return { mar, abr, total: mar + abr };
        },
        d => d.especialidad
    );

    let chartData = Array.from(grouped, ([especialidad, values]) => ({
        especialidad,
        mar: values.mar,
        abr: values.abr,
        total: values.total
    })).sort((a, b) => b.total - a.total);

    // Limit to top 10
    chartData = chartData.slice(0, 10);

    const margin = { top: 20, right: 100, bottom: 40, left: 160 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const stack = d3.stack()
        .keys(["mar", "abr"]);

    const series = stack(chartData);

    const x = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.total)]).nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
        .domain(chartData.map(d => d.especialidad))
        .range([margin.top, height - margin.bottom])
        .padding(0.3);

    const color = d3.scaleOrdinal()
        .domain(["mar", "abr"])
        .range(["#f59e0b", "#fbbf24"]); // amber colors for turnos

    // grids
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(""));

    const groups = svg.selectAll("g.layer")
        .data(series)
        .join("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key));

    groups.selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", d => y(d.data.especialidad))
        .attr("x", d => x(0)) // start an animation
        .attr("height", y.bandwidth())
        .attr("rx", 2)
        .on("mouseenter", function (event, d) {
            const key = d3.select(this.parentNode).datum().key;
            d3.select(this).attr("opacity", 0.8);
            window.showTooltip(`<strong>${d.data.especialidad} (${key.toUpperCase()})</strong>${(d[1] - d[0])} turnos disponibles`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1);
            window.hideTooltip();
        })
        .attr("width", 0)
        .transition().duration(1000).delay((d, i) => i * 50)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]));

    // Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text").attr("dx", "-5px");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 90}, ${margin.top})`);

    ["mar", "abr"].forEach((c, i) => {
        const lg = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(c)).attr("rx", 2);
        lg.append("text").attr("x", 20).attr("y", 10).text(c === "mar" ? "Marzo" : "Abril").style("fill", "#94a3b8").style("font-size", "11px");
    });
}
