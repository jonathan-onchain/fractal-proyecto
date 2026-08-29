export const USD_ARS = 1500;
export const RAMP_FEE = 0.01;
export const MIN_ARS = 10000;

export const RAMP_PROVIDER = "P2P.me Protocol";
export const RAMP_BADGE =
  "On-Ramp / Off-Ramp zk-enabled operado por P2P.me Protocol (Base Sepolia / Solana)";

export type AssetId = "rent" | "build" | "fleet";

export type Asset = {
  id: AssetId;
  name: string;
  subtitle: string;
  funded: number;
  yieldLabel: string;
};

export const ASSETS: Asset[] = [
  {
    id: "rent",
    name: "Alquileres",
    subtitle: "Renta mensual | $0.003 USD/mes estim.",
    funded: 85,
    yieldLabel: "10% Anual estimado en USD",
  },
  {
    id: "build",
    name: "Proyectos Inmobiliarios",
    subtitle: "Ganancia al final | Plazo 12-18m",
    funded: 60,
    yieldLabel: "10% Anual estimado en USD",
  },
  {
    id: "fleet",
    name: "Flotas / Turismo",
    subtitle: "Renta semanal | Pool activo de 15+ vehículos",
    funded: 92,
    yieldLabel: "10% Anual estimado en USD",
  },
];

export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

export const usd0 = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;

export const ars = (n: number) =>
  `$${n.toLocaleString("es-AR", { maximumFractionDigits: 0 })} ARS`;

export function convertToUsd(arsAmount: number) {
  const gross = arsAmount / USD_ARS;
  const fee = gross * RAMP_FEE;
  return { gross, fee, net: gross - fee };
}

export function convertToArs(usdAmount: number) {
  const gross = usdAmount * USD_ARS;
  const fee = gross * RAMP_FEE;
  return { gross, fee, net: gross - fee };
}
