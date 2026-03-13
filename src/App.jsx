import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   內嵌 SVG 圖示系統（不使用 lucide-react）
   24x24 viewBox，描邊式，2px 描邊
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   字體 + 全域樣式
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   色彩
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   資料
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "2026年3月12日";
const LEVELS = [
  { key: "all", label: "全部" }, { key: "foundation", label: "基礎" },
  { key: "core", label: "核心" }, { key: "power", label: "進階功能" }, { key: "expert", label: "專家" },
];

const CORE_FEATURES = [
  { title: "搜尋", ico: "globe", color: "#0284c7", description: "即時網頁結果，可查詢最新資訊、價格、新聞、法規，以及其他會變動的內容。", when: "凡是可能在模型訓練截止後發生變化的內容。" },
  { title: "深度研究", ico: "search", color: "#4f46e5", description: "可跨網頁來源、檔案與已連接應用程式進行多步驟、附資料依據的研究。", when: "你需要的是附來源的報告，而不是快速答案。" },
  { title: "專案", ico: "folderOpen", color: "#059669", description: "可長期使用的工作空間，包含共享檔案、自訂指示與對話記憶。", when: "任何你會反覆回來處理的工作：課程、客戶、創業專案。" },
  { title: "記憶", ico: "database", color: "#d97706", description: "在不同對話間儲存長期偏好與經常出現的背景資訊。", when: "適合偏好與習慣，不是精確文件儲存。" },
  { title: "自訂指示", ico: "settingsGear", color: "#57534e", description: "持續生效的行為規則，用來設定語氣、格式與回應結構。", when: "你希望所有對話都預設遵循你的規則。" },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "可見的寫作與程式編輯介面，支援精準的局部修改。", when: "需要反覆編修長文或程式碼時。" },
  { title: "任務", ico: "clock", color: "#7c3aed", description: "排程稍後執行的工作，完成後通知你結果。", when: "提醒、每日簡報、定期摘要。" },
  { title: "應用程式（連接器）", ico: "wrench", color: "#0d9488", description: "連接外部工具，讓 ChatGPT 能讀取並操作你的資料。", when: "最佳上下文存在於聊天之外時。" },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "可跨瀏覽器、檔案、程式碼與已連接應用程式自主執行。", when: "需要跨網站與多步驟行動的任務。" },
  { title: "自訂 GPT", ico: "bot", color: "#44403c", description: "具穩定指示與知識檔案的可重複使用助手。", when: "某個工作流程重複到值得制度化時。" },
  { title: "語音", ico: "mic", color: "#e11d48", description: "以口說互動進行低負擔的思考與探索。", when: "想一邊說一邊想，或需要多工處理時。" },
  { title: "圖片", ico: "imagePlus", color: "#c026d3", description: "可上傳分析、依描述生成，並直接進行編修。", when: "需要視覺理解、創作或精修時。" },
  { title: "檔案與資料", ico: "fileText", color: "#0891b2", description: "上傳 PDF、試算表與文件，結合程式執行進行分析。", when: "圖表、摘要、計算。" },
  { title: "模型", ico: "brain", color: "#65a30d", description: "可選擇偏重速度、平衡，或深度推理的模式。", when: "依任務複雜度匹配所需能力。" },
];

const ADDITIONAL_FEATURES = [
  { title: "學習模式", ico: "school", color: "#059669", description: "透過提問與理解檢查進行引導式學習。" },
  { title: "錄音", ico: "headphones", color: "#0284c7", description: "記錄口頭會議，再產出摘要。" },
  { title: "群組對話", ico: "users", color: "#7c3aed", description: "邀請他人進入同一場對話，共同規劃。" },
  { title: "分享連結", ico: "link2", color: "#57534e", description: "透過網址分享一段對話。" },
  { title: "圖片編修", ico: "camera", color: "#c026d3", description: "選取並微調已生成圖片的區域。" },
  { title: "互動式表格", ico: "table2", color: "#0891b2", description: "在分析前先以視覺方式檢視上傳資料。" },
  { title: "技能", ico: "share2", color: "#0d9488", description: "將重複工作流程做成可重複使用的機制，維持一致性。" },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "非同步研究，並整理回傳視覺化摘要。" },
];

const TOOL_CHOOSER = [
  { goal: "快速答案或草稿", tool: "一般聊天", ico: "messageSquare", reason: "摩擦最低。" },
  { goal: "最新資訊", tool: "搜尋", ico: "globe", reason: "適用於任何可能已變動的內容。" },
  { goal: "持續進行且有檔案的工作", tool: "專案", ico: "folderOpen", reason: "可跨多次對話保留上下文。" },
  { goal: "編修長文件", tool: "Canvas", ico: "panelsTopLeft", reason: "更適合精準修訂。" },
  { goal: "多來源報告", tool: "深度研究", ico: "search", reason: "多步驟整合並附上引用。" },
  { goal: "複雜的線上任務", tool: "Agent", ico: "workflow", reason: "可跨多個網站與動作。" },
  { goal: "定期輸出", tool: "任務", ico: "clock", reason: "可非同步執行並通知你。" },
  { goal: "經常重複同一流程", tool: "GPT 或技能", ico: "bot", reason: "把模式轉化為系統。" },
];

const PROMPT_BLOCKS = [
  { label: "目標", example: "為投資人會議寫一頁式專案簡報。", color: "#10a37f" },
  { label: "背景", example: "這家新創尚未營收，A 輪前，屬於氣候科技。", color: "#0284c7" },
  { label: "限制", example: "400 字以內。不要術語。不要條列點。", color: "#7c3aed" },
  { label: "格式", example: "請依序寫成：問題、解法、進展、需求。", color: "#d97706" },
  { label: "品質", example: "以麥肯錫顧問等級撰寫，不要像模板。", color: "#e11d48" },
  { label: "驗證", example: "凡是需要來源支持的主張都請標示。", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"先建立正確的心智模型", ico:"brain", color:"#65a30d",
    summary:"把 ChatGPT 當成推理夥伴，而不是神諭。它的第一個回答通常只是可用草稿，不是最終答案。任何輸出都應先檢查，再暫時採信。",
    whyItMatters:"多數失望來自錯誤期待。你應期待高品質初稿，而不是絕對確定。",
    beginnerMoves:["先假設第一個答案只是草稿，並批判性閱讀。","追問它做了哪些假設。","用 ChatGPT 加速判斷，而不是取代判斷。"],
    advancedMoves:["要求它提出最強反方論點。","把探索、建議與風險審查拆成不同輪次。","在高影響決策上，把它當成第二意見。"],
    commonMistakes:["未經驗證就相信數字。","把沉默誤解成自信。","直接逐字照抄輸出。"],
    promptExamples:[{prompt:"你做了哪些假設？",why:"可揭露隱藏推理。"},{prompt:"懷疑型專家最可能挑戰甚麼？",why:"進行對抗式自我審查。"},{prompt:"對你建議最強的反對論點是甚麼？",why:"避免確認偏誤。"},{prompt:"請把每個主張的信心評分 1 到 5。",why:"把事實與推測分開。"}],
    beforeAfter:{before:"幫我寫一份咖啡店商業計畫。",after:"請為波士頓市中心的精品咖啡店起草一頁式商業計畫。目標客群是研究生與遠端工作者。凡屬估算而非有來源支持的內容請標示。",improvement:"加入背景、受眾、地點與驗證規則。"},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"先懂工作空間，再去鑽研提示詞", ico:"laptop", color:"#059669",
    summary:"現代 ChatGPT 是分層工作空間。不同工作應該放在不同層。比起在錯誤層裡寫很聰明的提示，一個普通但放對位置的提示效果更好。",
    whyItMatters:"在開始打字前，選對工作空間是最具槓桿的決定。",
    beginnerMoves:["一般聊天適合一次性快速任務。","專案適合任何你會重複處理的事情。","臨時聊天適合完全乾淨的起點。"],
    advancedMoves:["每門課、每位客戶、每個計畫各自一個專案。","把專案當長期知識中心。","Canvas 用來反覆修訂；聊天用來做策略思考。"],
    commonMistakes:["每次都開新聊天，而不是回到既有專案。","長文件還用聊天，不用 canvas。","完全忽略任務與 agent。"],
    promptExamples:[{prompt:"這件事應該用聊天、專案，還是 GPT？",why:"讓模型協助選擇工作層。"},{prompt:"幫我規劃這學期最理想的專案結構。",why:"先規劃架構再開始。"},{prompt:"我應該加入哪些檔案與指示？",why:"最佳化專案上下文。"}],
    beforeAfter:{before:"我一直重新開始新聊天，結果老是丟失上下文。",after:"建立一個專案。上傳參考資料。設定指示。之後都回到同一個專案。",improvement:"短暫聊天變成持續性工作空間。"},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"提示設計：清楚比花俏更重要", ico:"penTool", color:"#0284c7",
    summary:"好的提示是操作簡報。華麗措辭可有可無，但明確限制不可少。模型看不到你腦中的標準，除非你寫出來。",
    whyItMatters:"模糊提示只會得到泛泛而談的輸出。大多數挫折都來自輸入規格不足。",
    beginnerMoves:["明確寫出受眾與使用情境。","說清楚你要的成果長甚麼樣子。","指定格式、語氣、長度，以及應避免事項。"],
    advancedMoves:["先要大綱，核准後再寫全文。","把事實與詮釋分開。","提供一套自我評分標準。"],
    commonMistakes:["用三個字的提示卻期待客製化結果。","一次塞進太多限制。","用「你可以嗎…？」代替直接指令。"],
    promptExamples:[{prompt:"目標：__。背景：__。限制：__。請產出：__。",why:"通用骨架。"},{prompt:"先給我大綱，先不要開始寫全文。",why:"避免後續重寫整體結構。"},{prompt:"在寫之前，先告訴我你還需要知道甚麼。",why:"讓模型先提出釐清問題。"},{prompt:"請以 [角色] 的角度向 [受眾] 說明。",why:"固定語氣與深度。"}],
    beforeAfter:{before:"幫我寫求職信。",after:"請為 McKinsey 的 Strategy Analyst 職位寫求職信。背景：國際管理研究生，具 SOP 與 CRM 經驗。語氣自信但不傲慢。350 字。不要出現 'I am passionate about.'",improvement:"角色、背景、語氣、長度與負面限制都更明確。"},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"修訂流程比一次到位更重要", ico:"refreshCcw", color:"#7c3aed",
    summary:"高品質使用方式是反覆迭代：定義、起草、批判、修訂、包裝。多數使用者會重來，其實應該修。",
    whyItMatters:"一次生成的品質上限只停留在第一輪。修訂通常穩定帶來更好的結果。",
    beginnerMoves:["草稿完成後先問：『哪裡薄弱或遺漏？』","用更窄的目標進行修訂。","除非方向根本錯誤，否則不要重開。"],
    advancedMoves:["固定分輪：結構、準確性、語氣、壓縮、包裝。","先自我批判，再改寫。","明確指定壓縮比例。"],
    commonMistakes:["不讓模型先自我診斷，就自己一直重寫。","回饋太空泛，例如『幫我改好一點』。","修訂輪次太多且沒有焦點。"],
    promptExamples:[{prompt:"你的回答為甚麼沒有達到目標？",why:"先自我診斷再修訂。"},{prompt:"邏輯要更銳利，但保留原結構。",why:"限制修訂範圍。"},{prompt:"在不失去核心內容下壓縮 35%。",why:"強迫排序重點。"},{prompt:"依這些標準評分。哪些地方低於 4/5？",why:"結構化自我評估。"}],
    beforeAfter:{before:"這樣不對，再試一次。",after:"第 2 段論證有循環問題。請改寫，並加入上傳報告中的一個數據點，其餘部分保留。",improvement:"明確指出錯誤、修正方向與保留部分。"},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"寫作、改寫與轉化", ico:"fileText", color:"#57534e",
    summary:"ChatGPT 特別擅長做轉化：替不同受眾改寫、調整語氣、摘要、重組。很多時候，修改現成文字比從零起草更有效。",
    whyItMatters:"多數專業寫作其實都是轉化工作。這正是 AI 回報率最高的地方。",
    beginnerMoves:["貼上原文，說清楚哪些要保留、哪些要改。","指定受眾、媒介與語氣。","語氣不確定時，要求多個版本。"],
    advancedMoves:["對照式版本：正式、精簡、說服型。","逐句診斷。","保留事實前提下做風格轉換。"],
    commonMistakes:["明明已有筆記，卻還從零開始寫。","只看第一個語氣版本，不比較替代案。","沒說清楚哪些內容必須保留。"],
    promptExamples:[{prompt:"改寫成寄給教授的 email：尊重、直接、不要廢話。",why:"精準轉化。"},{prompt:"請給我三個版本：正式、精簡、說服型。",why:"透過對照選擇最佳版本。"},{prompt:"哪些句子太空泛？為甚麼？",why:"逐句診斷。"},{prompt:"保留事實與結構，只改語氣。",why:"限制修改範圍。"}],
    beforeAfter:{before:"幫我把這封 email 改好。",after:"改寫成寄給系主任的版本。語氣尊重、直接。移除術語。150 字內。保留行動項目。",improvement:"受眾、語氣、反模式、長度與保留條件都更清楚。"},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"檔案、PDF、試算表與資料", ico:"table2", color:"#0891b2",
    summary:"ChatGPT 可以檢視檔案、摘要文件、對資料執行程式並生成圖表。關鍵順序是：先描述，再分析，最後下結論。",
    whyItMatters:"先檢查資料再解讀，可避免最常見的錯誤。",
    beginnerMoves:["先問檔案裡有甚麼，再問它代表甚麼。","先要求欄位審核。","PDF 要分開看結構、論點與證據。"],
    advancedMoves:["要求列出完整假設軌跡。","在下結論前，先重述抽取出的表格。","大型資料集用程式執行。"],
    commonMistakes:["一開始就問『有甚麼重點洞察？』","沒有驗證就相信圖表標籤。","假設 PDF 解析一定完美。"],
    promptExamples:[{prompt:"先描述：欄位、日期範圍、缺失值，以及可做的分析選項。",why:"先審核再分析。"},{prompt:"先抽出核心論點，再開始批判。",why:"先理解再判斷。"},{prompt:"請列出這張圖用到的所有假設。",why:"建立可稽核軌跡。"},{prompt:"請寫 Python 清理這份資料，執行後顯示結果。",why:"可重現的分析。"}],
    beforeAfter:{before:"這份試算表有甚麼重點？",after:"先做審核：欄位、型別、日期範圍、缺失值。提出三種最有用的分析，依實用性排序。在我核准前先不要執行。",improvement:"先檢查、再提案、再等待核准。"},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"搜尋、深度研究與引用", ico:"search", color:"#4f46e5",
    summary:"搜尋適合查最新資訊，並附上來源。深度研究適合多步驟報告。凡是最新、受管制或快速變動的內容，都不應只依賴靜態記憶。",
    whyItMatters:"沒有搜尋時，ChatGPT 的回答其實來自固定時間點的知識快照。",
    beginnerMoves:["凡是可能變動的內容都先搜尋。","檢查引用來源是否真的支持對應主張。","高風險議題優先使用第一手來源。"],
    advancedMoves:["要求『把確認事實與你的推論分開』。","指定來源類型、地區與日期範圍。","深度研究前先定義範圍。"],
    commonMistakes:["拿模型內建知識回答當前事件。","看到『有來源』就直接相信，卻不點進去。","簡單事實問題也用深度研究。"],
    promptExamples:[{prompt:"請搜尋，只用第一手來源。",why:"即時檢索並設下品質限制。"},{prompt:"把事實與推論分開，逐項標示。",why:"讓知識狀態更透明。"},{prompt:"哪些內容在六個月內可能過時？",why:"標示時間敏感性。"},{prompt:"深度研究：[主題]。範圍：[地區、日期]。",why:"明確定義任務。"}],
    beforeAfter:{before:"AI 監管最新進展？",after:"請搜尋過去 30 天內歐盟與美國的 AI 監管進展。只用第一手來源。把已生效與仍在提案中的內容分開。",improvement:"範圍、時間、品質與分類都更明確。"},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"語音、圖片與多模態工作流程", ico:"imagePlus", color:"#c026d3",
    summary:"語音、圖片理解、生成與編修都已是標準能力。關鍵仍是具體：模糊的視覺要求只會得到泛化結果。",
    whyItMatters:"多模態讓 ChatGPT 同時成為視覺分析工具、圖片工作區與免手操作的思考助手。",
    beginnerMoves:["上傳圖片時要明確說要它做甚麼。","速度比修飾重要時可用語音。","圖片生成要指定主體、構圖、氛圍與風格。"],
    advancedMoves:["串接模式：先分析、再解釋、再整理成筆記。","用圖片批判做設計審查。","局部編修時，要指明區域與變更內容。"],
    commonMistakes:["上傳圖片卻不給任何指示。","用模糊描述卻期待擬真效果。","忘記語音也沿用同一份上下文。"],
    promptExamples:[{prompt:"請擷取這份菜單內容，並按分類整理。",why:"具體抽取任務。"},{prompt:"請用 120 字向非技術主管解釋這張圖。",why:"有條件的分析。"},{prompt:"生成：9:16 直式、電影感、黃金時刻。",why:"攝影式規格描述。"},{prompt:"把背景改成純白攝影棚，主體保留。",why:"局部且具體的編修。"}],
    beforeAfter:{before:"幫我做一張很酷的圖。",after:"16:9：東京現代咖啡店黃昏場景。建築攝影風格，淺景深，暖色調。木質吧台、義式咖啡機、城市燈光。不要人物。",improvement:"比例、主體、風格、氛圍、元素與排除條件都更完整。"},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"學習、錄音、群組、連結與技能", ico:"layoutGrid", color:"#0d9488",
    summary:"這些功能分別用於學習、擷取口語內容、協作、分享，以及把流程正式化。",
    whyItMatters:"學習不是拿答案而已。協作也不是單人提示的延伸。",
    beginnerMoves:["用學習模式來學，不只是拿答案。","會議與課堂可用錄音功能。","分享連結與群組對話更適合乾淨協作。"],
    advancedMoves:["把錄音摘要當作專案來源檔。","把重複任務做成技能。","群組對話搭配專案，共享上下文。"],
    commonMistakes:["拿一般聊天來讀書，反而削弱學習效果。","忘記有錄音功能。","用截圖分享，而不是直接用分享連結。"],
    promptExamples:[{prompt:"不要直接告訴我答案，請先考我。",why:"更符合教學邏輯。"},{prompt:"把這段錄音整理成行動項目與後續跟進草稿。",why:"一份輸入，多份輸出。"},{prompt:"把這個工作流程轉成一個技能。",why:"把流程制度化。"}],
    beforeAfter:{before:"解釋一下光合作用。",after:"我在準備生物考試。先不要解釋。請從簡單到進階提問，檢查我的理解，並在我答錯時簡短糾正。",improvement:"從給答案變成引導式學習。"},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"記憶、指示、回應風格、臨時聊天", ico:"database", color:"#d97706",
    summary:"記憶用來存背景。指示用來定規則。回應風格用來調整質感。臨時聊天則是乾淨房。這些不能互相取代。",
    whyItMatters:"個人化設定若配置錯誤，傷害結果的程度往往大於幫助。",
    beginnerMoves:["記憶：放穩定且廣泛的偏好。","指示：放全域寫作規則。","臨時聊天：完全不承接。"],
    advancedMoves:["回應風格只應調整質感，不應取代指示。","專案專屬規則優先於全域設定。","定期檢查記憶內容。"],
    commonMistakes:["甚麼都塞進記憶，而不是放進指示。","記憶累積過時內容。","想用回應風格改能力，而不是改風格。"],
    promptExamples:[{prompt:"你目前記得我哪些事情？",why:"用於檢查記憶。"},{prompt:"請忘記我偏好正式語氣這件事。",why:"定向清理。"},{prompt:"請用空白模式，不要帶入任何既有偏好。",why:"乾淨起點模式。"}],
    beforeAfter:{before:"偏好都放進記憶裡，但結果還是很不一致。",after:"行為規則放進指示。事實背景放進記憶。領域規則放進專案指示。",improvement:"把不同資訊放到正確層。"},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"把專案當成你的作業系統", ico:"folderOpen", color:"#16a34a",
    summary:"專案能把 ChatGPT 變成具上下文感知的工作台。設定良好的專案，效果遠勝任何單次聊天。",
    whyItMatters:"對多階段工作而言，專案是槓桿最高的組織工具。",
    beginnerMoves:["每個工作流一個專案，名稱要清楚。","只上傳相關檔案。","寫好專案指示。"],
    advancedMoves:["把對話摘要也加入作為來源檔案。","每週工作放進同一個專案，不要一直開新聊天。","建立一個個人生產力的 meta-project。"],
    commonMistakes:["專案切得太碎太窄。","甚麼都上傳，造成上下文膨脹。","沒有專案指示。"],
    promptExamples:[{prompt:"幫我規劃這學期最理想的專案結構。",why:"先設計工作空間。"},{prompt:"請依照我先前的內容風格起草一份 memo。",why:"利用累積上下文。"},{prompt:"整理過去五段對話的關鍵決策。",why:"形成活的摘要。"}],
    beforeAfter:{before:"檔案散得到處都是，一直搞不清楚。",after:"每個領域一個專案。放入參考資料。寫明指示。持續回來使用。定期摘要。",improvement:"把分散對話變成有結構的工作流。"},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"甚麼時候該建立 GPT（以及甚麼時候不該）", ico:"bot", color:"#44403c",
    summary:"只有在流程會重複、指示穩定，而且值得重用時才真正有用。但多數人太早開始做 GPT。",
    whyItMatters:"太早做 GPT，等於把尚未成熟的流程提前固化。時機正確時，它才會變成一鍵工具。",
    beginnerMoves:["先保存提示詞：提示本身就是原型。","重複三次後再正式化。","目的要窄，一次只做一件事。"],
    advancedMoves:["四層結構：角色、指示、知識、工具。","明寫失敗規則。","做對抗式測試。"],
    commonMistakes:["只做過一次的事就建 GPT。","範圍太大：『甚麼都做』。","沒有知識檔案。"],
    promptExamples:[{prompt:"把我們目前的流程整理成 GPT 藍圖。",why:"從實際經驗抽出規格。"},{prompt:"請列出指示、輸入/輸出結構與失敗規則。",why:"形成完整規格。"},{prompt:"這個 GPT 應該處理哪些邊界情況？",why:"測試韌性。"}],
    beforeAfter:{before:"做一個幫我處理所有 email 的 GPT。",after:"做一個專門回覆教授 email 的 GPT。語氣尊重、直接。150 字內。先問背景後再起草。未確認前拒絕直接寄出。上傳：風格指南。",improvement:"範圍更窄，並加入安全規則與參考依據。"},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"用 Canvas 做寫作與程式修訂", ico:"panelsTopLeft", color:"#334155",
    summary:"它是與聊天並列的可視工作區。凡是像文件一樣需要精準局部修改的內容，Canvas 都比線性對話更合適。",
    whyItMatters:"長篇成果物放在聊天裡很容易失控。Canvas 讓文件本身成為重心。",
    beginnerMoves:["長內容請用 Canvas。","一個用途一個檔案。","要求具體修改，不要空泛重寫。"],
    advancedMoves:["聊天用於策略；Canvas 用於執行。","先做架構，再做小範圍 diff。","用版本紀錄做比較。"],
    commonMistakes:["長文件仍用聊天處理。","明明只要修一段，卻整篇重寫。","除錯時沒有使用程式碼畫布。"],
    promptExamples:[{prompt:"打開寫作 Canvas。只重寫前言。",why:"限定範圍。"},{prompt:"找出邏輯錯誤，只修補那些行。",why:"精準修碼。"},{prompt:"把第 3 節移到第 2 節前面，並把第 4 與 5 節合併。",why:"結構重組。"}],
    beforeAfter:{before:"幫我重寫這篇文章。[2000 字貼在聊天中]",after:"請在 Canvas 打開。先不要修改。先標記強弱段落，之後我再指示你改哪裡。",improvement:"先檢視、再修改。"},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"任務、應用程式、Pulse 與 Agent", ico:"workflow", color:"#16a34a",
    summary:"這一層是執行層。任務負責稍後執行。應用程式帶入資料。Pulse 做非同步研究。Agent 則負責自主多步驟工作。",
    whyItMatters:"大多數人只用即時問答。這一層才真正把 ChatGPT 變成會替你做事的系統。",
    beginnerMoves:["任務：提醒、簡報、定期摘要。","應用程式：當資訊在 Drive、Slack、email 等外部系統。","Agent：適合原本需要手動花 15 分鐘以上的多步驟流程。"],
    advancedMoves:["把 Agent 提示寫成工作簡報，附上停點。","用 Pulse 做主動追蹤更新。","任務 + 專案 用來做每週自動摘要。"],
    commonMistakes:["不知道 Agent 已經存在。","Agent 指示模糊，沒有停下規則。","把任務只當提醒工具。"],
    promptExamples:[{prompt:"建立每日任務：早上 8 點簡報 [主題]，列前三點。",why:"主動式簡報。"},{prompt:"請結合已連接來源與公開來源做競品分析。",why:"整合內外部資料。"},{prompt:"Agent：照這些步驟執行，提交前先暫停。",why:"自主執行但保留檢查點。"}],
    beforeAfter:{before:"幫我查五個網站並比較價格。",after:"Agent：造訪五家競品網站，擷取價格，整理成表格。若需要登入就暫停。若價格過時請標示。",improvement:"把範圍與例外處理都交代清楚。"},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"模型與模式的選擇", ico:"compass", color:"#65a30d",
    summary:"不同模式在速度、推理深度與工具支援上各有取捨。要讓模型能力匹配任務。",
    whyItMatters:"任何事都用最強模式會浪費時間；從不升級則會錯過深度。",
    beginnerMoves:["日常工作先用 Auto。","邏輯複雜或需要整合時再升級。","最強不等於永遠最好。"],
    advancedMoves:["草稿用快的，關鍵審查用深的。","注意不同推理模式的工具限制。","可在對話中途從輕模式升級。"],
    commonMistakes:["所有事情都用最強模式。","明明是模式不對，卻怪模型。","不檢查方案是否支援該功能。"],
    promptExamples:[{prompt:"先給我快速答案，再做第二輪深入版。",why:"先求速度，再求深度。"},{prompt:"這是複雜邏輯題。請延伸思考，逐步推理。",why:"明確要求深度推理。"},{prompt:"這件事適合快速起草還是謹慎推理？",why:"讓模型協助選擇模式。"}],
    beforeAfter:{before:"所有任務都用最進階模型。",after:"快速任務用 Auto。邏輯分析用推理模式。腦力激盪則可用快模式。",improvement:"讓能力與任務型態相匹配。"},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"隱私、資料控制與風險", ico:"shield", color:"#e11d48",
    summary:"能力越強，越需要邊界。敏感資料上傳要有紀律。高風險輸出一定要有人類複核。",
    whyItMatters:"有能力卻沒有邊界，最終就會造成資料外洩或過度依賴。",
    beginnerMoves:["不要隨意上傳敏感內容。","上傳前先去識別化。","臨時聊天最接近乾淨隱私模式。"],
    advancedMoves:["建立紅黃綠三色上傳政策。","高風險決策前一定找專家覆核。","定期做資料稽核。"],
    commonMistakes:["其實只需樣本，卻上傳整個資料庫。","誤以為臨時聊天就等於完全不處理資料。","在受管制領域把 AI 輸出當最終決策。"],
    promptExamples:[{prompt:"哪些部分需要人類專家驗證？",why:"標示限制。"},{prompt:"在完整上傳前先幫我做去識別化。",why:"安全準備。"},{prompt:"這裡有哪些可識別個人資訊？請移除。",why:"偵測 PII。"}],
    beforeAfter:{before:"這是完整客戶名單，幫我分析趨勢。",after:"先移除姓名、email、電話。公司名稱也匿名化。之後再分析各分眾營收。",improvement:"保留分析價值，同時去除識別資訊。"},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   區塊 SVG 視覺圖
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"你的目標",{bold:true})}{tx(276,39,"AI 草稿",{bold:true})}{tx(180,137,"你的判斷",{bold:true})}{tx(180,84,"檢視、決定、行動",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","一般聊天"],["54","38","252","24","專案 + Canvas"],["68","68","224","24","記憶 + 指示"],["82","98","196","24","GPT + 學習 + 技能"],["96","128","168","24","任務 + 應用程式 + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"簡單",{dim:true,size:8})}{tx(336,146,"強大",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","目標"],["126","8","背景"],["234","8","規則"],["18","92","格式"],["126","92","品質"],["234","92","驗證"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","定義"],["100","起草"],["170","批判"],["240","修訂"],["310","完成"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"每一輪都會增加精準度",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"原文",{bold:true})}{tx(180,38,"轉化",{bold:true})}{tx(294,38,"輸出",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. 檢查",{dim:true,size:9})}{tx(252,126,"2. 下結論",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"第一手",{bold:true})}{tx(242,69,"第二手",{bold:true})}{tx(242,109,"推論",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","文字"],["120","圖片"],["204","語音"],["288","編修"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"把不同模式串在一起",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","錄音"],["100","6","120","42","學習"],["100","78","120","42","群組"],["238","24","80","42","分享"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","記憶"],["100","10","120","40","指示"],["232","10","108","40","風格"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"穩定輸出",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"聊天",{bold:true})}{tx(166,76,"檔案",{bold:true})}{tx(264,52,"來源",{bold:true,size:9})}{tx(264,100,"規則",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","角色"],["116","4","96","42","知識"],["116","94","96","42","工具"],["234","48","110","42","規則"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"大綱",{bold:true,size:10})}{tx(190,22,"草稿",{bold:true,size:10})}{tx(290,22,"修改",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","目標"],["90","6","64","40","瀏覽"],["90","94","64","40","檔案"],["174","6","64","40","應用"],["174","94","64","40","程式"],["258","48","80","40","完成"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","自動"],["116","4","72","40","快速"],["116","96","72","40","深度"],["268","48","72","40","專業"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"能力越強，邊界越重要",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   子元件
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>適用時機： </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>前後對照</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">較弱</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">較強</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>為甚麼重要</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>從這裡開始</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>進階</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>常見錯誤</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>視覺模型</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>提示範例</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   主體
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "基礎", core: "核心技能", power: "進階功能", expert: "專家" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* 頁首 */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> 實用參考</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>ChatGPT 完整指南</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>每個工具是做甚麼的、何時該用，以及如何穩定得到更好的結果。先為一般使用者而寫，也為想更深入的人保留進階內容。</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> 已驗證 {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 個章節 &middot; 60+ 提示</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>ChatGPT 現在能做甚麼</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","回答","聊天、搜尋"],["150","4","120","38","整理","專案、記憶"],["284","4","120","38","製作","canvas、圖片"],["16","120","120","38","學習","學習、錄音"],["150","120","120","38","分享","群組、連結"],["284","120","120","38","執行","任務、agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>完整能力堆疊</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* 六項原則 */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>六項原則</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"清楚提問",d:"目標、背景、限制、格式。"}, {ico:"layoutGrid",t:"選對工作層",d:"聊天、專案、Canvas、搜尋、Agent。"}, {ico:"shield",t:"重要時就驗證",d:"當前資訊或高風險內容要查證。"}, {ico:"refreshCcw",t:"修訂，不要重來",d:"第二輪往往才有好結果。"}, {ico:"bot",t:"把有效做法制度化",d:"變成專案、GPT、任務或技能。"}, {ico:"eye",t:"用視覺加速思考",d:"表格、圖解、截圖。"}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* 工具選擇表 */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>判斷表</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>你該用哪個工具？</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>你的目標</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>最佳工具</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>原因</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* 提示公式 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>提示模式</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>六個模組，讓任何提示都更強</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* 核心功能 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>功能堆疊</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>ChatGPT 的核心工具</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* 額外功能 */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>常被忽略</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>多數使用者會錯過的功能</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* 導覽器 */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜尋..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>全部展開</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>全部收合</button>
          </div>
        </section>

        {/* 指南章節 */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* 範圍 + 核心結論 */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>範圍</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>本指南涵蓋甚麼</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>以使用者端功能為主，不涵蓋企業管理員功能。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>重實務應用，不重產品冷知識。</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>功能可用性依方案與平台而異。</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>最大升級</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>不要再問「我該怎麼把提示寫得更好？」</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>改問：「這件事適合放在 ChatGPT 的哪一層來做？」這個轉變帶來的提升，通常比提示技巧本身更大。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 頁尾 */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">最終結論</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">真正熟練的樣子</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>選對模式。清楚定義任務。驗證重要資訊。聰明修訂。把成功做法轉成可重複系統。真正用得好的人，本質上是思路清楚的人，只是剛好會用 AI。</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              ChatGPT User Guide
              <br />
              © 2026 EugeneYip.com All Rights Reserved. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">持續重新檢查</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["功能能力","價格","更新說明","專案","記憶 FAQ","Canvas","任務","應用程式","搜尋","深度研究","學習模式","錄音","分享連結","群組","技能","Agent","語音","圖片 FAQ"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
