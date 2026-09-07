import valuePropsData from "@/data/value-props.json";
import type { ValueProp } from "./types";

export async function getValueProps(): Promise<ValueProp[]> {
  return (valuePropsData.items as ValueProp[]).sort(
    (a, b) => a.order - b.order
  );
}
