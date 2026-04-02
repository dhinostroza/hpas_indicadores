const { Database } = require('arangojs');

const db = new Database({
    url: "http://127.0.0.1:8529"
});
db.useBasicAuth("root", "");

const dbName = "hpas_indicadores";

const collections = [
    "atenciones_tipo_paciente",
    "atenciones_tipo_seguro",
    "estados_solicitudes_satrec",
    "perfil_epidemiologico",
    "lista_espera",
    "referencias_satrec",
    "turnos_disponibles"
];

// Datos Extraídos de Fuentes
const seedData = {
    atenciones_tipo_paciente: [
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'AUTOREFERIDO', mes: 'ene', anio: 2026, cantidad: 595 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'AUTOREFERIDO', mes: 'feb', anio: 2026, cantidad: 509 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'AUTOREFERIDO', mes: 'mar', anio: 2026, cantidad: 440 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'EMERGENCIA', mes: 'ene', anio: 2026, cantidad: 968 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'EMERGENCIA', mes: 'feb', anio: 2026, cantidad: 773 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'EMERGENCIA', mes: 'mar', anio: 2026, cantidad: 696 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'SAT-REC', mes: 'ene', anio: 2026, cantidad: 1084 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'SAT-REC', mes: 'feb', anio: 2026, cantidad: 902 },
        { tipo_consulta: 'PRIMERA', tipo_referencia: 'SAT-REC', mes: 'mar', anio: 2026, cantidad: 748 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'AUTOREFERIDO', mes: 'ene', anio: 2026, cantidad: 2523 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'AUTOREFERIDO', mes: 'feb', anio: 2026, cantidad: 2397 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'AUTOREFERIDO', mes: 'mar', anio: 2026, cantidad: 2014 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'EMERGENCIA', mes: 'ene', anio: 2026, cantidad: 3428 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'EMERGENCIA', mes: 'feb', anio: 2026, cantidad: 3428 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'EMERGENCIA', mes: 'mar', anio: 2026, cantidad: 2941 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'SAT-REC', mes: 'ene', anio: 2026, cantidad: 2664 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'SAT-REC', mes: 'feb', anio: 2026, cantidad: 2707 },
        { tipo_consulta: 'SUBSECUENTE', tipo_referencia: 'SAT-REC', mes: 'mar', anio: 2026, cantidad: 2208 }
    ],
    atenciones_tipo_seguro: [
        { tipo_seguro: 'IESS AFILIADO SEGURO CAMPESINO', mes: 'ene', anio: 2026, cantidad: 79 },
        { tipo_seguro: 'IESS AFILIADO SEGURO CAMPESINO', mes: 'feb', anio: 2026, cantidad: 81 },
        { tipo_seguro: 'IESS AFILIADO SEGURO GENERAL', mes: 'ene', anio: 2026, cantidad: 1993 },
        { tipo_seguro: 'IESS AFILIADO SEGURO GENERAL', mes: 'feb', anio: 2026, cantidad: 1919 },
        { tipo_seguro: 'MSP/NO APORTA', mes: 'ene', anio: 2026, cantidad: 9299 },
        { tipo_seguro: 'MSP/NO APORTA', mes: 'feb', anio: 2026, cantidad: 8799 },
        { tipo_seguro: 'MSP/NO APORTA', mes: 'mar', anio: 2026, cantidad: 7395 }
    ],
    estados_solicitudes_satrec: [
        { estado: 'CANCELAR', cantidad: 5, periodo: 'Q1-2026' },
        { estado: 'PACIENTE CONFIRMADO', cantidad: 6904, periodo: 'Q1-2026' },
        { estado: 'PROCESADO', cantidad: 2044, periodo: 'Q1-2026' },
        { estado: 'REASIGNADO', cantidad: 237, periodo: 'Q1-2026' },
        { estado: 'RECHAZADO', cantidad: 1197, periodo: 'Q1-2026' },
        { estado: 'REFERIDO', cantidad: 6640, periodo: 'Q1-2026' },
        { estado: 'TURNO ASIGNADO', cantidad: 5660, periodo: 'Q1-2026' }
    ],
    perfil_epidemiologico: [
        { orden: 1, codigo_cie10: 'I10-I15', descripcion: 'Enfermedades hipertensivas', consultas: 974, porcentaje: 4.37, periodo: 'ene-feb 2026' },
        { orden: 2, codigo_cie10: 'M15-M19', descripcion: 'Artrosis', consultas: 878, porcentaje: 3.94, periodo: 'ene-feb 2026' },
        { orden: 3, codigo_cie10: 'M50-M54', descripcion: 'Otras dorsopatías', consultas: 829, porcentaje: 3.72, periodo: 'ene-feb 2026' },
        { orden: 4, codigo_cie10: 'K00-K14', descripcion: 'Enf. de la cavidad bucal', consultas: 694, porcentaje: 3.12, periodo: 'ene-feb 2026' },
        { orden: 5, codigo_cie10: 'E10-E14', descripcion: 'Diabetes mellitus', consultas: 616, porcentaje: 2.77, periodo: 'ene-feb 2026' },
        { orden: 6, codigo_cie10: 'K20-K31', descripcion: 'Enf. de esófago y estómago', consultas: 574, porcentaje: 2.58, periodo: 'ene-feb 2026' },
        { orden: 7, codigo_cie10: 'N40-N51', descripcion: 'Enf. órganos genitales masculinos', consultas: 546, porcentaje: 2.45, periodo: 'ene-feb 2026' },
        { orden: 8, codigo_cie10: 'N17-N19', descripcion: 'Insuficiencia renal', consultas: 541, porcentaje: 2.43, periodo: 'ene-feb 2026' },
        { orden: 9, codigo_cie10: 'M70-M79', descripcion: 'Trastornos de tejidos blandos', consultas: 501, porcentaje: 2.25, periodo: 'ene-feb 2026' },
        { orden: 10, codigo_cie10: 'E00-E07', descripcion: 'Trastornos glándula tiroides', consultas: 494, porcentaje: 2.22, periodo: 'ene-feb 2026' }
    ],
    lista_espera: [
        { especialidad: 'MEDICINA INTERNA', turnos_en_espera: 2136, fecha_corte: '2026-03-24' },
        { especialidad: 'OFTALMOLOGIA', turnos_en_espera: 2049, fecha_corte: '2026-03-24' },
        { especialidad: 'TRAUMATOLOGIA', turnos_en_espera: 1940, fecha_corte: '2026-03-24' },
        { especialidad: 'NEUROLOGIA', turnos_en_espera: 1509, fecha_corte: '2026-03-24' },
        { especialidad: 'UROLOGIA', turnos_en_espera: 1435, fecha_corte: '2026-03-24' },
        { especialidad: 'PSIQUIATRIA', turnos_en_espera: 1371, fecha_corte: '2026-03-24' },
        { especialidad: 'GASTROENTEROLOGIA', turnos_en_espera: 1302, fecha_corte: '2026-03-24' },
        { especialidad: 'ENDOCRINOLOGIA', turnos_en_espera: 1254, fecha_corte: '2026-03-24' },
        { especialidad: 'GINECOLOGIA', turnos_en_espera: 1183, fecha_corte: '2026-03-24' },
        { especialidad: 'OTORRINOLARINGOLOGIA', turnos_en_espera: 927, fecha_corte: '2026-03-24' }
    ],
    referencias_satrec: [
        { especialidad: 'OFTALMOLOGIA', cantidad: 1559, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'GASTROENTEROLOGIA', cantidad: 872, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'TRAUMATOLOGIA', cantidad: 732, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'OTORRINOLARINGOLOGIA', cantidad: 682, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'ENDOCRINOLOGIA', cantidad: 469, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'CIRUGIA VASCULAR', cantidad: 447, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'UROLOGIA', cantidad: 386, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'DERMATOLOGIA', cantidad: 326, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'CIRUGIA MAXILOFACIAL', cantidad: 277, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' },
        { especialidad: 'NEUROLOGIA', cantidad: 247, establecimiento_destino: 'PABLO ARTURO SUAREZ', periodo: 'feb 2026' }
    ],
    turnos_disponibles: [
        { especialidad: 'PRE ANESTESIA', mes: 'mar', anio: 2026, turnos_disponibles: 159 },
        { especialidad: 'PRE ANESTESIA', mes: 'abr', anio: 2026, turnos_disponibles: 310 },
        { especialidad: 'PLANIFICACIÓN FAMILIAR', mes: 'mar', anio: 2026, turnos_disponibles: 120 },
        { especialidad: 'PLANIFICACIÓN FAMILIAR', mes: 'abr', anio: 2026, turnos_disponibles: 191 },
        { especialidad: 'OFTALMOLOGIA CIRUGIAS', mes: 'mar', anio: 2026, turnos_disponibles: 88 },
        { especialidad: 'OFTALMOLOGIA CIRUGIAS', mes: 'abr', anio: 2026, turnos_disponibles: 61 },
        { especialidad: 'NEUMOLOGIA', mes: 'mar', anio: 2026, turnos_disponibles: 76 },
        { especialidad: 'NEUMOLOGIA', mes: 'abr', anio: 2026, turnos_disponibles: 222 },
        { especialidad: 'CARDIOLOGIA', mes: 'abr', anio: 2026, turnos_disponibles: 193 },
        { especialidad: 'FISIATRIA', mes: 'abr', anio: 2026, turnos_disponibles: 217 }
    ]
};

async function seed() {
    try {
        const databases = await db.listDatabases();
        if (!databases.includes(dbName)) {
            await db.createDatabase(dbName);
            console.log(`Base de datos "${dbName}" creada exitosamente.`);
        } else {
            console.log(`Base de datos "${dbName}" ya existía.`);
        }

        db.useDatabase(dbName);

        for (const colName of collections) {
            const collection = db.collection(colName);
            const exists = await collection.exists();
            if (!exists) {
                await collection.create();
                console.log(`Colección "${colName}" creada.`);
            } else {
                console.log(`Colección "${colName}" ya existía.`);
                await collection.truncate(); // Clear old data
            }

            const data = seedData[colName];
            if (data && data.length > 0) {
                await collection.import(data);
                console.log(`Importados ${data.length} documentos en "${colName}".`);
            }
        }

        console.log("¡Carga de datos semilla completada con éxito!");

    } catch (e) {
        console.error("Error cargando semilla:", e);
    }
}

seed();
