"use client";

import dynamic from "next/dynamic";
import AreaSkeleton from "./AreaSkeleton";
import NumberSkeleton from "./NumberSkeleton";

export {
  BotCard,
  BotMessage,
  SystemMessage,
} from "@/components/llm-charts/message";

export { Chart } from "@/components/Charts";
export { spinner } from "@/components/llm-charts/spinner";

const AreaComp = dynamic(
  () => import("./AreaChartComponent").then((mod) => mod.AreaChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const NumberComp = dynamic(
  () =>
    import("./NumberChartComponent").then((mod) => mod.NumberChartComponent),
  {
    ssr: false,
    loading: () => <NumberSkeleton />,
  }
);

const TableComp = dynamic(
  () => import("./TableChartComponent").then((mod) => mod.TableChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const LineComp = dynamic(
  () => import("./LineChartComponent").then((mod) => mod.LineChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

export { AreaComp, LineComp, NumberComp, TableComp };
