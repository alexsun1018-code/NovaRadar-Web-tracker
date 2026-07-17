import { Converter } from "opencc-js";

let convertTwToCn: ((text: string) => string) | null = null;

export function zhTwToZhCn(text: string): string {
  if (!text) return text;
  if (!convertTwToCn) {
    convertTwToCn = Converter({ from: "tw", to: "cn" });
  }
  return convertTwToCn(text);
}
