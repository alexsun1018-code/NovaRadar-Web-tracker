import { getTranslations } from "next-intl/server";
import Icon, { type IconName } from "@/components/ui/Icon";

const items: { key: string; icon: IconName }[] = [
  { key: "marketGap", icon: "target" },
  { key: "techInnovation", icon: "lightbulb" },
  { key: "domainExpertise", icon: "users" },
];

// 2026-09-08 依客戶指示：原獨立「Strategic Focus Areas」區塊（含標題）併入本區塊延續呈現，
// 不再另起一個 <section>／不再顯示獨立標題；原始版本保留於 StrategicFocusAreas.tsx（孤兒元件，未再被引用）
// 2026-09-08 四項目版面改為直接還原客戶原始簡報排版（見客戶截圖「Strategic Focus Areas」投影片：
// 左右各兩欄文字說明，中間夾一組 2x2 花瓣狀圖示；曾嘗試環形圖／花瓣放射狀連接線版面，
// 客戶反饋效果不如預期後改回此版）。與原始簡報唯一差異：描述文字**不**使用紅色粗體首字
// （客戶另外明確指示取消，統一與其餘內文同色）
const focusAreas: { key: string; icon: IconName; column: "left" | "right"; row: 0 | 1 }[] = [
  { key: "cancer", icon: "barChart", column: "left", row: 0 },
  { key: "targetDrug", icon: "lightbulb", column: "right", row: 0 },
  { key: "neuro", icon: "leaf", column: "left", row: 1 },
  { key: "rareDisease", icon: "shield", column: "right", row: 1 },
];
// 中央 2x2 花瓣圖示叢排列順序（左上／右上／左下／右下），每個花瓣尖角朝向叢集中心
// 基準形狀 borderRadius "50% 50% 50% 0" 的尖角預設在左下角，故左上格需轉 270 度、
// 右下格需轉 90 度，尖角才會分別朝向自己右下角／左上角（即叢集共同中心點）
const petalGrid: { key: string; rotate: number }[] = [
  { key: "cancer", rotate: 270 },
  { key: "targetDrug", rotate: 0 },
  { key: "neuro", rotate: 180 },
  { key: "rareDisease", rotate: 90 },
];

export default async function WeInvestIn() {
  const t = await getTranslations("WeInvestIn");
  const tFocus = await getTranslations("StrategicFocus");

  return (
    <section className="bg-section-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-brand-primary sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-brand-neutral-100 bg-background p-8"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Icon name={item.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-neutral-900">
                {t(`items.${item.key}.label`)}
              </h3>
              <p className="mt-3 text-base text-brand-neutral-600">
                {t(`items.${item.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* 策略聚焦領域：延續上方 We Invest In 版面，不另立標題。桌機版還原客戶簡報排版
            （左右文字欄夾住中間 2x2 花瓣圖示叢），手機/平板改為簡單的圖示＋文字直式列表 */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-14">
          {/* 左欄文字（桌機限定，手機改用下方直式列表） */}
          <div className="hidden lg:block lg:space-y-14">
            {focusAreas
              .filter((a) => a.column === "left")
              .map((area) => (
                <div key={area.key}>
                  <h3 className="text-lg font-bold text-brand-primary">
                    {tFocus(`areas.${area.key}.label`)}
                  </h3>
                  <p className="mt-2 text-base text-brand-neutral-600">
                    {tFocus(`areas.${area.key}.description`)}
                  </p>
                </div>
              ))}
          </div>

          {/* 中央 2x2 花瓣圖示叢（桌機限定） */}
          <div className="mx-auto hidden grid-cols-2 gap-1.5 lg:grid">
            {petalGrid.map((p) => {
              const area = focusAreas.find((a) => a.key === p.key)!;
              return (
                <span
                  key={p.key}
                  className="flex h-28 w-28 items-center justify-center text-brand-primary"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, white)",
                    borderRadius: "50% 50% 50% 0",
                    transform: `rotate(${p.rotate}deg)`,
                  }}
                >
                  <span style={{ transform: `rotate(${-p.rotate}deg)` }}>
                    <Icon name={area.icon} className="h-9 w-9" />
                  </span>
                </span>
              );
            })}
          </div>

          {/* 右欄文字（桌機限定） */}
          <div className="hidden lg:block lg:space-y-14">
            {focusAreas
              .filter((a) => a.column === "right")
              .map((area) => (
                <div key={area.key}>
                  <h3 className="text-lg font-bold text-brand-primary">
                    {tFocus(`areas.${area.key}.label`)}
                  </h3>
                  <p className="mt-2 text-base text-brand-neutral-600">
                    {tFocus(`areas.${area.key}.description`)}
                  </p>
                </div>
              ))}
          </div>

          {/* 手機/平板：圖示＋文字直式列表 */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:hidden">
            {focusAreas.map((area) => (
              <div key={area.key} className="flex gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center text-brand-primary"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, white)",
                    borderRadius: "50% 50% 50% 0",
                  }}
                >
                  <Icon name={area.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-brand-primary">
                    {tFocus(`areas.${area.key}.label`)}
                  </h3>
                  <p className="mt-1 text-sm text-brand-neutral-600">
                    {tFocus(`areas.${area.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
