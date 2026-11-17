import type { NextConfig } from "next";

// Secciones retiradas en la reorientación del proyecto a datos de gasto público.
// Redirección permanente (308) para no romper enlaces compartidos ni URLs indexadas.
const RETIRED_SECTIONS = [
  "gobierno",
  "politicos",
  "inmigracion",
  "seguridad",
  "vivienda",
  "paro",
  "pensiones",
  "sanidad",
  "educacion",
];

const nextConfig: NextConfig = {
  async redirects() {
    return RETIRED_SECTIONS.map((section) => ({
      source: `/${section}`,
      destination: "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
