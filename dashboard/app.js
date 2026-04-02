// URL base de la API del Backend (Express) - Detecta si estamos en el servidor o local
const API_BASE = (window.location.hostname === '' || window.location.hostname === 'localhost')
    ? 'http://localhost:3000/api'
    : `http://${window.location.hostname}:3000/api`;

// Inicializar el reloj del dashboard
function initClock() {
    const clock = document.getElementById('time-display');
    setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString('es-EC', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }, 1000);
}

// Inicializador principal
async function initDashboard() {
    initClock();

    let data;
    // Intentar cargar desde la API
    try {
        const [
            atencionesPaciente,
            atencionesSeguro,
            estadosSatrec,
            perfilEpi,
            listaEspera,
            referenciasSatrec,
            turnosDisponibles
        ] = await Promise.all([
            fetch(`${API_BASE}/atenciones/tipo-paciente`).then(res => res.json()),
            fetch(`${API_BASE}/atenciones/tipo-seguro`).then(res => res.json()),
            fetch(`${API_BASE}/estados-satrec`).then(res => res.json()),
            fetch(`${API_BASE}/perfil-epidemiologico`).then(res => res.json()),
            fetch(`${API_BASE}/lista-espera`).then(res => res.json()),
            fetch(`${API_BASE}/referencias-satrec`).then(res => res.json()),
            fetch(`${API_BASE}/turnos-disponibles`).then(res => res.json())
        ]);
        data = {
            atencionesPaciente, atencionesSeguro, estadosSatrec,
            perfilEpi, listaEspera, referenciasSatrec, turnosDisponibles
        };
    } catch (apiErr) {
        console.warn("API no disponible, cargando desde JSON estático...", apiErr);
        try {
            const staticData = await fetch('data/indicators.json').then(res => res.json());
            data = {
                atencionesPaciente: staticData.atenciones_tipo_paciente,
                atencionesSeguro: staticData.atenciones_tipo_seguro,
                estadosSatrec: staticData.estados_solicitudes_satrec,
                perfilEpi: staticData.perfil_epidemiologico,
                listaEspera: staticData.lista_espera,
                referenciasSatrec: staticData.referencias_satrec,
                turnosDisponibles: staticData.turnos_disponibles
            };
        } catch (staticErr) {
            console.error("Error crítico: No se pudo cargar data estática tampoco.", staticErr);
            throw staticErr;
        }
    }

    try {
        console.log("Data loaded successfully!");
        const { atencionesPaciente, atencionesSeguro, estadosSatrec, perfilEpi, listaEspera, referenciasSatrec, turnosDisponibles } = data;

        // Eliminar loaders
        document.querySelectorAll('.loader').forEach(l => l.remove());

        // Renderizar cada panel - Asumiendo que las funciones globales existen desde los scripts de /charts
        if (window.renderChartAtenciones) renderChartAtenciones(atencionesPaciente, '#chart-atenciones');
        if (window.renderChartSeguro) renderChartSeguro(atencionesSeguro, '#chart-seguro');
        if (window.renderChartEstados) renderChartEstados(estadosSatrec, '#chart-estados');
        if (window.renderChartEpi) renderChartEpi(perfilEpi, '#chart-epi');
        if (window.renderChartEspera) renderChartEspera(listaEspera, '#chart-espera');
        if (window.renderChartReferencias) renderChartReferencias(referenciasSatrec, '#chart-referencias');
        if (window.renderChartTurnos) renderChartTurnos(turnosDisponibles, '#chart-disponibles');

        // Escuchar redimensionamiento responsivo
        window.addEventListener('resize', () => {
            // Un debounce sencillo aquí sería ideal, para redibujar 
            // TODO: call render functions again for responsiveness
        });

    } catch (err) {
        console.error("Error fetching data:", err);
        document.querySelectorAll('.chart-container').forEach(c => {
            c.innerHTML = `<p style="color: #f43f5e;font-size:12px;">Error cargando datos. Asegúrese que el backend corre en el puerto 3000.</p>`;
        });
    }
}

// Utils (Global tooltip instance)
const tooltip = d3.select("body").append("div")
    .attr("class", "d3-tooltip")
    .style("opacity", 0);

window.showTooltip = function (html, event) {
    tooltip.html(html)
        .style("opacity", 1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("transform", "scale(1)");
};
window.hideTooltip = function () {
    tooltip.style("opacity", 0).style("transform", "scale(0.95)");
};

// Bootstrap
document.addEventListener('DOMContentLoaded', initDashboard);
