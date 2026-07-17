import valuePropsData from "@/data/value-props.json";
import { withAutoZhCN } from "./localize";
import type { ValueProp } from "./types";

export async function getValueProps(): Promise<ValueProp[]> {
  return (valuePropsData.items as ValueProp[])
    .map((item) => withAutoZhCN(item, ["title", "description"]))
    .sort((a, b) => a.order - b.order);
}
