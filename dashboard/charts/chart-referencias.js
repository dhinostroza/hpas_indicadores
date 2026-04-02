function renderChartReferencias(data, containerSelector) {
    const container = d3.select(containerSelector);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    container.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 140 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cantidad)]).nice()
        .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.especialidad))
        .range([margin.top, height - margin.bottom])
        .padding(0.2);

    // grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(-height + margin.top + margin.bottom).tickFormat(""));

    // bars
    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.especialidad))
        .attr("height", y.bandwidth())
        .attr("fill", "var(--brand-purple)")
        .attr("rx", 3)
        .on("mouseenter", function (event, d) {
            d3.select(this).attr("fill", "#a78bfa");
            window.showTooltip(`<strong>${d.especialidad}</strong>${d.cantidad.toLocaleString()} referencias SAT-REC`, event);
        })
        .on("mouseleave", function () {
            d3.select(this).attr("fill", "var(--brand-purple)");
            window.hideTooltip();
        })
        .attr("width", 0)
        .transition().duration(800)
        .delay((d, i) => i * 80)
        .attr("width", d => x(d.cantidad) - x(0));

    // Axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .attr("dx", "-5px");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));
}
