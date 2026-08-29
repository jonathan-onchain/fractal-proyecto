import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Building2,
  Car,
  Clock,
  HardHat,
  ShieldCheck,
  TrendingUp,
  UserRoundSearch,
  Wallet,
} from "lucide-react";

import { DonutChart } from "@/components/fractal/DonutChart";
import { Sheet } from "@/components/fractal/Sheet";
import { StepsProgress } from "@/components/fractal/StepsProgress";
import {
  ASSETS,
  MIN_ARS,
  RAMP_BADGE,
  USD_ARS,
  ars,
  convertToArs,
  convertToUsd,
  usd,
  usd0,
  type Asset,
  type AssetId,
} from "@/lib/fractal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRACTAL — De pesos a dólares, automáticamente" },
      {
        name: "description",
        content:
          "Elegí un activo real, invertí con transferencia bancaria en pesos y recibí tu renta en dólares. Alquileres, proyectos inmobiliarios y flotas.",
      },
      { property: "og:title", content: "FRACTAL — Inversión en activos reales (RWA)" },
{
        property: "og:description",
        content:
          "Invertí en pesos, cobrá renta en dólares. Rampa P2P transparente operada por P2P.me Protocol.",
      },
    ],
  }),
  component: Fractal,
});

const ASSET_STYLES: Record<
  AssetId,
  { color: string; text: string; bg: string; bar: string; icon: typeof Building2 }
> = {
  rent: {
    color: "var(--rent)",
    text: "text-rent",
    bg: "bg-rent-soft",
    bar: "bg-rent",
    icon: Building2,
  },
  build: {
    color: "var(--build)",
    text: "text-build",
    bg: "bg-build-soft",
    bar: "bg-build",
    icon: HardHat,
  },
  fleet: {
    color: "var(--fleet)",
    text: "text-fleet",
    bg: "bg-fleet-soft",
    bar: "bg-fleet",
    icon: Car,
  },
};

const INVEST_STEPS = [
  "Conectando con P2P.me zk-KYC...",
  "Buscando LP en la red de P2P.me (Base Sepolia)...",
  "Participación RWA emitida exitosamente",
];

const WITHDRAW_STEPS = [
  "Validando rentas disponibles...",
  "Liquidando USD vía P2P.me (Base Sepolia)...",
  "Pesos enviados a tu CBU",
];

const UNSUB_STEPS = [
  "Registrando solicitud de desuscripción...",
  "Enviando el caso al administrador del fondo...",
  "Solicitud en gestión | Búsqueda de comprador iniciada",
];

function Fractal() {
  const [holdings, setHoldings] = useState<Record<AssetId, number>>({
    rent: 625,
    build: 375,
    fleet: 250,
  });
  const [earnings, setEarnings] = useState(84.5);

  const [investAsset, setInvestAsset] = useState<Asset | null>(null);
  const [unsubAsset, setUnsubAsset] = useState<Asset | null>(null);
  const [pendingUnsub, setPendingUnsub] = useState<Record<AssetId, number>>({
    rent: 0,
    build: 0,
    fleet: 0,
  });
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const total = holdings.rent + holdings.build + holdings.fleet;

  const slices = useMemo(
    () =>
      ASSETS.map((a) => ({
        id: a.id,
        value: holdings[a.id],
        color: ASSET_STYLES[a.id].color,
      })),
    [holdings],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 pb-16">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            FRACTAL
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-card">
          <ShieldCheck className="h-3.5 w-3.5 text-fleet" />
          RWA verificados
        </span>
      </header>

      <section className="pb-7">
        <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-tight text-foreground">
          De pesos a dólares,
          <br />
          <span className="text-fleet">automáticamente</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Elegí un activo, invertí con transferencia bancaria y recibí tu renta en dólares.
        </p>
      </section>

      <section className="rounded-2xl bg-card p-5 shadow-card">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Mi portafolio
            </p>
            <p className="mt-1 text-[32px] font-extrabold leading-none tabular-nums tracking-tight text-foreground">
              {usd0(total)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Capital total invertido</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <DonutChart slices={slices} total={total} label="Capital" />
          <ul className="flex-1 space-y-3">
            {ASSETS.map((a) => {
              const value = holdings[a.id];
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <li key={a.id} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: ASSET_STYLES[a.id].color }}
                    />
                    <span className="font-semibold text-foreground">{pct}%</span>
                    <span className="truncate text-muted-foreground">{a.name}</span>
                  </div>
                  <p className="ml-4.5 mt-0.5 font-semibold tabular-nums text-muted-foreground">
                    {usd0(value)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 shadow-card">
<div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-foreground">Rendimientos generados</p>
          <span className="rounded-full bg-fleet-soft px-2.5 py-1 text-xs font-bold tabular-nums text-fleet">
            +{usd(earnings)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Renta histórica</p>

        <div className="mt-4 space-y-2">
          <Yield label="Alquileres" amount="+$45.00 USD" cadence="Mensual" tone="rent" />
          <Yield label="Flotas" amount="+$39.50 USD" cadence="Semanal" tone="fleet" />
        </div>

<button
          onClick={() => setWithdrawOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Retirar Rentas a CBU vía P2P.me
        </button>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">
          Elegí tu activo
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Participaciones fraccionadas en activos reales.
        </p>

        <div className="mt-4 space-y-3">
          {ASSETS.map((a) => {
            const s = ASSET_STYLES[a.id];
            const Icon = s.icon;
            return (
              <div
                key={a.id}
                className="w-full rounded-2xl bg-card p-4 text-left shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${s.text}`} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{a.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.subtitle}</p>
                    <span
                      className={`mt-2 inline-block rounded-full ${s.bg} px-2.5 py-1 text-[11px] font-bold ${s.text}`}
                    >
                      {a.yieldLabel}
                    </span>
                  </div>
                </div>
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span>Cupo</span>
                    <span className={s.text}>{a.funded}% Financiado</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${s.bar}`}
                      style={{ width: `${a.funded}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setInvestAsset(a)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl ${s.bar} px-4 py-3 text-sm font-bold text-card shadow-card transition-opacity hover:opacity-90`}
                >
                  <Wallet className="h-4 w-4" strokeWidth={2.4} />
                  Fondear e invertir
                </button>
                <button
                  onClick={() => setUnsubAsset(a)}
                  disabled={holdings[a.id] <= 0}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <UserRoundSearch className="h-4 w-4" />
                  Solicitar desuscripción
                </button>
                {pendingUnsub[a.id] > 0 && (
                  <p className="mt-2 flex items-start gap-2 rounded-xl bg-build-soft px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-build">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Desuscripción en gestión por {usd(pendingUnsub[a.id])}. El administrador
                    del fondo está buscando un comprador y te contacta dentro de 72 hs.
                  </p>
                )}
              </div>
            );
          })}

        </div>
      </section>

<p className="mt-8 text-center text-[11px] leading-relaxed text-muted-foreground">
        Rampa P2P operada de forma transparente por P2P.me Protocol
      </p>

      <InvestSheet
        asset={investAsset}
        onClose={() => setInvestAsset(null)}
        onDone={(assetId, netUsd) => {
          setHoldings((h) => ({ ...h, [assetId]: h[assetId] + netUsd }));
        }}
      />

      <WithdrawSheet
        open={withdrawOpen}
        available={earnings}
        onClose={() => setWithdrawOpen(false)}
        onDone={(amount) => setEarnings((e) => Math.max(0, e - amount))}
      />

      <UnsubscribeSheet
        asset={unsubAsset}
        available={unsubAsset ? holdings[unsubAsset.id] : 0}
        onClose={() => setUnsubAsset(null)}
        onDone={(assetId, amountUsd) => {
          setPendingUnsub((p) => ({ ...p, [assetId]: p[assetId] + amountUsd }));
        }}
      />
    </main>
  );
}

function UnsubscribeSheet({
  asset,
  available,
  onClose,
  onDone,
}: {
  asset: Asset | null;
  available: number;
  onClose: () => void;
  onDone: (assetId: AssetId, amountUsd: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const value = Math.min(Number(amount) || 0, available);

  const flow = useFlow(UNSUB_STEPS, () => {
    if (asset) onDone(asset.id, value);
  });

  const close = () => {
    onClose();
    flow.reset();
    setAmount("");
  };

  return (
    <Sheet
      open={!!asset}
      onClose={close}
      title={asset ? `Desuscribirse de ${asset.name}` : ""}
    >
      {!flow.running ? (
        <div className="space-y-4">
          <p className="rounded-xl bg-build-soft p-3 text-xs font-semibold leading-relaxed text-build">
            Esta operación no es inmediata. La desuscripción queda sujeta a la gestión del
            administrador del fondo, que debe enlazar un comprador para tu participación. En
            un lapso de 72 hs el administrador se va a contactar con vos para coordinar la
            salida.
          </p>
          <p className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
            Tu capital sigue generando renta hasta que la venta se concrete. Recién cuando se
            cierre la operación el capital queda disponible en USD para retirar a tu CBU.
          </p>

          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">
              Participación a vender en USD (disponible {usd(available)})
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold tabular-nums text-foreground outline-none transition-colors focus:border-fleet"
              placeholder="0.00"
            />
          </label>

          <button
            onClick={() => setAmount(available.toFixed(2))}
            className="text-xs font-semibold text-fleet"
          >
            Desuscribirme del total ({usd(available)})
          </button>

          <div className="space-y-2.5 rounded-xl bg-background p-4">
            <Row label="Participación a vender" value={usd(value)} />
            <Row label="Comisión de gestión" value="Sin costo" />
            <Row label="Contacto del administrador" value="Dentro de 72 hs" />
            <Row label="Estado inicial" value="Sujeto a gestión del admin" strong />
          </div>

          <button
            disabled={value <= 0}
            onClick={flow.start}
            className="w-full rounded-xl bg-fleet px-4 py-3.5 text-sm font-bold text-card shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Solicitar desuscripción al administrador
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <StepsProgress steps={UNSUB_STEPS} current={flow.step} />
          {flow.step >= UNSUB_STEPS.length && (
            <>
              <div className="space-y-2 rounded-xl bg-build-soft p-3 text-center">
                <p className="text-sm font-bold text-build">
                  Solicitud en gestión por {usd(value)}
                </p>
                <p className="text-[11px] font-medium leading-relaxed text-build">
                  El administrador del fondo está buscando un comprador para tu participación.
                  Dentro de las próximas 72 hs se va a contactar con vos para coordinar la
                  salida. Vas a ver el estado actualizado en la tarjeta del activo.
                </p>
              </div>
              <button
                onClick={close}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
              >
                Listo
              </button>
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}

function Yield({
  label,
  amount,
  cadence,
  tone,
}: {
  label: string;
  amount: string;
  cadence: string;
  tone: AssetId;
}) {
  const s = ASSET_STYLES[tone];
  return (
    <div className="flex items-center justify-between rounded-xl bg-background px-3 py-2.5">
      <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
        {label}
      </span>
      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
        <span className="text-fleet">{amount}</span> · {cadence}
      </span>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between text-xs ${
        strong ? "border-t border-border pt-2.5 font-bold text-foreground" : ""
      }`}
    >
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${strong ? "text-fleet" : "font-semibold text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

function useFlow(steps: string[], onFinish: () => void) {
  const [step, setStep] = useState(-1);

  const start = () => {
    setStep(0);
    steps.forEach((_, i) => {
      setTimeout(() => setStep(i + 1), (i + 1) * 1000);
    });
    setTimeout(() => {
      onFinish();
    }, steps.length * 1000);
  };

  return { step, running: step >= 0, reset: () => setStep(-1), start };
}

function InvestSheet({
  asset,
  onClose,
  onDone,
}: {
  asset: Asset | null;
  onClose: () => void;
  onDone: (assetId: AssetId, netUsd: number) => void;
}) {
  const [amount, setAmount] = useState("150000");
  const value = Number(amount) || 0;
  const { gross, fee, net } = convertToUsd(value);

  const flow = useFlow(INVEST_STEPS, () => {
    if (asset) onDone(asset.id, net);
  });

  const close = () => {
    onClose();
    flow.reset();
    setAmount("150000");
  };

  return (
    <Sheet
      open={!!asset}
      onClose={close}
      title={asset ? `Invertir en ${asset.name}` : ""}
    >
      {!flow.running ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">
              Monto a transferir en Pesos (ARS)
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={MIN_ARS}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold tabular-nums text-foreground outline-none transition-colors focus:border-fleet"
              placeholder="0"
            />
            <span className="mt-1.5 block text-[11px] font-semibold text-muted-foreground">
              Monto mínimo de fondeo: {ars(MIN_ARS)}
            </span>
          </label>

<div className="space-y-2.5 rounded-xl bg-background p-4">
            <Row label="Pesos recibidos" value={ars(value)} />
            <Row label={`USD Brutos (1 USD = ${USD_ARS.toLocaleString("es-AR")} ARS)`} value={usd(gross)} />
            <Row label="Fee P2P.me (1%)" value={`-${usd(fee)}`} />
            <Row label="USD acreditados a RWA" value={usd(net)} strong />
          </div>

          {value > 0 && value < MIN_ARS && (
            <p className="rounded-xl bg-build-soft px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-build">
              El monto mínimo para fondear es de {ars(MIN_ARS)}.
            </p>
          )}

          <button
            disabled={value < MIN_ARS}
            onClick={flow.start}
            className="w-full rounded-xl bg-fleet px-4 py-3.5 text-sm font-bold text-card shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Confirmar Transferencia Bancaria
          </button>
          <p className="rounded-xl border border-border bg-background px-3 py-2.5 text-center text-[10px] font-semibold leading-relaxed text-muted-foreground">
            {RAMP_BADGE}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <StepsProgress steps={INVEST_STEPS} current={flow.step} />
          {flow.step >= INVEST_STEPS.length && (
            <>
              <p className="rounded-xl bg-fleet-soft p-3 text-center text-sm font-bold text-fleet">
                Acreditado: {usd(net)} en {asset?.name}
              </p>
              <button
                onClick={close}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
              >
                Ver mi portafolio
              </button>
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}

function WithdrawSheet({
  open,
  available,
  onClose,
  onDone,
}: {
  open: boolean;
  available: number;
  onClose: () => void;
  onDone: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(available.toFixed(2));
  const value = Math.min(Number(amount) || 0, available);
  const { gross, fee, net } = convertToArs(value);

  const flow = useFlow(WITHDRAW_STEPS, () => onDone(value));

  const close = () => {
    onClose();
    flow.reset();
  };

  return (
    <Sheet open={open} onClose={close} title="Retirar rentas a tu CBU">
      {!flow.running ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-muted-foreground">
              USD acumulados a retirar (disponible {usd(available)})
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold tabular-nums text-foreground outline-none transition-colors focus:border-fleet"
            />
          </label>

<div className="space-y-2.5 rounded-xl bg-background p-4">
            <Row label="Rentas a vender" value={usd(value)} />
            <Row label={`Pesos Brutos (1 USD = ${USD_ARS.toLocaleString("es-AR")} ARS)`} value={ars(gross)} />
            <Row label="Fee P2P.me (1%)" value={`-${ars(fee)}`} />
            <Row label="Pesos acreditados en tu CBU" value={ars(net)} strong />
          </div>

          <button
            disabled={value <= 0}
            onClick={flow.start}
            className="w-full rounded-xl bg-fleet px-4 py-3.5 text-sm font-bold text-card shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Confirmar retiro a CBU
          </button>
          <p className="rounded-xl border border-border bg-background px-3 py-2.5 text-center text-[10px] font-semibold leading-relaxed text-muted-foreground">
            {RAMP_BADGE}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <StepsProgress steps={WITHDRAW_STEPS} current={flow.step} />
          {flow.step >= WITHDRAW_STEPS.length && (
            <>
              <p className="rounded-xl bg-fleet-soft p-3 text-center text-sm font-bold text-fleet">
                Enviamos {ars(net)} a tu cuenta bancaria
              </p>
              <button
                onClick={close}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground"
              >
                Listo
              </button>
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}
