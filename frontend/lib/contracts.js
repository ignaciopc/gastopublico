export const mockContractsData = {
  contratos: {
    stats: [
      { label: "Total Adjudicado Hoy", value: "847,2 M€", delta: "+12.4%", bad: false },
      { label: "Contratos con Alerta", value: "142", delta: "▲ 8%", bad: true },
      { label: "Organismos Activos", value: "28", delta: "· estable", bad: false },
      { label: "Licitadores Media", value: "4.2", delta: "▼ 0.5", bad: true },
    ],
    list: [
      {
        fecha: "2026-04-30",
        hora: "10:30",
        objeto: "Suministro de combustible para aviación",
        organismo: "Ministerio de Defensa",
        proc: "Abierto",
        licit: 3,
        adjud: "REPSOL COMERCIAL DE PRODUCTOS PETROLIFEROS, S.A.",
        importe: 12500000,
        flag: "grandes"
      },
      {
        fecha: "2026-04-30",
        hora: "09:15",
        objeto: "Mantenimiento de infraestructuras ferroviarias",
        organismo: "ADIF",
        proc: "Negociado sin publicidad",
        licit: 1,
        adjud: "CONSTRUCCIONES Y CONTRATAS S.A.",
        importe: 4200000,
        flag: "directa"
      },
      {
        fecha: "2026-04-29",
        hora: "14:00",
        objeto: "Servicios de limpieza para sedes judiciales",
        organismo: "Ministerio de Justicia",
        proc: "Abierto",
        licit: 12,
        adjud: "EULEN, S.A.",
        importe: 850000,
        flag: "sobrecoste"
      },
      {
        fecha: "2026-04-28",
        hora: "11:45",
        objeto: "Adquisición de equipamiento informático para centros educativos",
        organismo: "Comunidad de Madrid",
        proc: "Abierto Simplificado",
        licit: 5,
        adjud: "TECNOLOGIAS DE LA INFORMACION S.L.",
        importe: 1200000,
        flag: ""
      },
      {
        fecha: "2026-04-27",
        hora: "16:20",
        objeto: "Suministro de material quirúrgico",
        organismo: "Servicio Madrileño de Salud (SERMAS)",
        proc: "Abierto",
        licit: 2,
        adjud: "MEDTRONIC IBERICA, S.A.",
        importe: 3200000,
        flag: "grandes"
      },
      {
        fecha: "2026-04-26",
        hora: "08:50",
        objeto: "Campaña de publicidad institucional 'Verano 2026'",
        organismo: "Ministerio de Asuntos Económicos",
        proc: "Contrato Menor",
        licit: 1,
        adjud: "PUBLICIDAD Y COMUNICACION S.A.",
        importe: 14500,
        flag: "directa"
      }
    ]
  }
};
