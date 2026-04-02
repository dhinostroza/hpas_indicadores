# Dashboard de Indicadores Estratégicos HPAS (v0.1)

Este proyecto es un panel de control interactivo diseñado para el **Hospital Pablo Arturo Suárez (HPAS)**. Su objetivo es visualizar indicadores clave de gestión hospitalaria y epidemiológica de manera moderna, rápida y basada en datos precisos.

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Custom Dark Theme con Glassmorphism) y **D3.js v7** para visualizaciones dinámicas.
- **Backend**: **Node.js** con Express para la API REST.
- **Base de Datos**: **ArangoDB** (con un sistema de fallback en memoria para demostración inmediata).
- **Control de Versiones**: Git & GitHub.

## 📊 Indicadores Implementados

1. **Atenciones por Tipo de Paciente**: Comparativa mensual de primeras consultas vs. subsecuentes.
2. **Distribución por Aseguramiento**: Desglose porcentual de pacientes por tipo de seguro (IESS, MSP, SPPAT, etc.).
3. **Estados SAT-REC**: Monitorización del flujo de solicitudes en el sistema de referencias.
4. **Perfil Epidemiológico (CIE-10)**: Top 10 de diagnósticos con mayor volumen de consultas.
5. **Lista de Espera Inteligente**: Visualización tipo *Treemap* con **indicadores de tendencia (▲/▼)** para detectar saturación en servicios.
6. **Demanda Referida SAT-REC**: Análisis de especialidades con mayor carga de solicitudes entrantes.
7. **Disponibilidad de Turnos**: Comparativa de oferta de turnos para los meses de marzo y abril de 2026.

## 📂 Estructura del Proyecto

```text
hpas_indicadores/
├── backend/            # API en Express y scripts de seeding
│   ├── server.js       # Servidor principal (API REST)
│   └── seed_data.js    # Script para poblar ArangoDB
├── dashboard/          # Interfaz web interactiva
│   ├── index.html      # Estructura principal
│   ├── styles.css      # Diseño premium Dark Mode
│   ├── app.js          # Lógica de carga de datos
│   └── charts/         # Módulos individuales D3.js
└── fuentes/            # Archivos PDF y JPEG originales procesados
```

## 🛠️ Instalación y Uso

### Requisitos
- Node.js (v14 o superior)
- Navegador web moderno (Chrome, Edge, Firefox)

### Pasos para ejecutar
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/dhinostroza/hpas_indicadores.git
   cd hpas_indicadores
   ```

2. **Instalar dependencias del backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Lanzar el servidor**:
   ```bash
   node server.js
   ```

4. **Abrir el dashboard**:
   Simplemente abre el archivo `dashboard/index.html` en tu navegador favorito.

---
© 2026 HPAS - Dashboard de Inteligencia Hospitalaria.