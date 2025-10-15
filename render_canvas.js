// 説明文をキャンバスに描画し、テクスチャ用のDataURLを返す
function renderTextToTexture(item, callback) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ヘッダー帯
  ctx.fillStyle = "#f3f5f9";
  ctx.fillRect(0, 0, canvas.width, Math.floor(canvas.height*0.36));

  // タイトル
  ctx.fillStyle = "#111";
  ctx.font = "bold 48px system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans JP', sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(item.title || "", 36, 28);

  // サブタイトル
  ctx.fillStyle = "#555";
  ctx.font = "28px system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans JP', sans-serif";
  ctx.fillText(item.subtitle || "", 36, 96);

  // 説明（簡易改行）
  ctx.fillStyle = "#222";
  ctx.font = "30px system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans JP', sans-serif";
  const text = (item.description || "").trim();
  const maxWidth = canvas.width - 72;
  const lineHeight = 44;
  let x = 36, y = 160;

  const lines = wrapByMeasure(ctx, text, maxWidth);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
    if (y > canvas.height - 36) break;
  }

  callback(canvas.toDataURL());
}

function wrapByMeasure(ctx, text, maxWidth) {
  // 日本語対応の簡易折返し："。"や"、"で区切って測定
  const units = text.includes("。") ? text.split("。").map(s=>s? s+"。" : "").filter(Boolean)
               : text.split(" ");
  const lines = [];
  let line = "";
  for (const u of units) {
    const test = line ? line + (text.includes("。") ? "" : " ") + u : u;
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line);
      line = u;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
