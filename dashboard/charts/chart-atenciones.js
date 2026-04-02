function renderChartAtenciones(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    container.selectAll("*").remove();

    // Grouping by month, and then stacking by tipo_referencia OR plotting by consulta (PRIMERA vs SUBSECUENTE)
    // To simplify for high-level insight, let's show PRIMERA vs SUBSECUENTE by mes
    const summary = d3.rollup(data,
        v => d3.sum(v, d => d.cantidad),
        d => d.mes,
        d => d.tipo_consulta
    );

    const meses = ["ene", "feb", "mar", "abr"];
    const consultas = ["PRIMERA", "SUBSECUENTE"];

    // Flatten
    const chartData = meses.map(m => {
        const item = { mes: m };
        consultas.forEach(c => {
            item[c] = summary.get(m)?.get(c) || 0;
        });
        return item;
    });

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const x0 = d3.scaleBand()
        .domain(meses)
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.2);

    const x1 = d3.scaleBand()
        .domain(consultas)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

    const yMax = d3.max(chartData, d => Math.max(...consultas.map(k => d[k])));
    const y = d3.scaleLinear()
        .domain([0, yMax]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(consultas)
        .range(["#3b82f6", "#06b6d4"]); // brand-blue, brand-cyan

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "axis")
        .call(d3.axisBottom(x0).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")));

    // Grids
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right).tickFormat(""));

    // Bars
    const g = svg.append("g")
        .selectAll("g")
        .data(chartData)
        .join("g")
        .attr("transform", d => `translate(${x0(d.mes)},0)`);

    g.selectAll("rect")
        .data(d => consultas.map(key => ({ key, value: d[key], mes: d.mes })))
        .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", height - margin.bottom) // start animation from bottom
        .attr("width", x1.bandwidth())
        .attr("height", 0)
        .attr("fill", d => color(d.key))
        .attr("rx", 4)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("opacity", 0.8);
            window.showTooltip(`<strong>${d.mes.toUpperCase()} - ${d.key}</strong>${d.value.toLocaleString()} atenciones`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1);
            window.hideTooltip();
        })
        .transition().duration(800).ease(d3.easeCubicOut)
        .delay((d, i) => i * 100)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value));

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

    consultas.forEach((c, i) => {
        const lg = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
        lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(c)).attr("rx", 2);
        lg.append("text").attr("x", 20).attr("y", 10).text(c).style("fill", "#94a3b8").style("font-size", "11px");
    });
}
