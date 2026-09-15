function pdfEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function latinLine(value: string): string {
  return [...value]
    .map((ch) => (ch.charCodeAt(0) < 128 ? ch : "?"))
    .join("")
    .slice(0, 96);
}

function wrapLines(text: string): string[] {
  const lines: string[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = latinLine(raw || " ");
    if (line.length <= 86) {
      lines.push(line);
      continue;
    }
    let rest = line;
    while (rest.length > 86) {
      lines.push(rest.slice(0, 86));
      rest = rest.slice(86);
    }
    if (rest) lines.push(rest);
  }
  return lines.slice(0, 48);
}

export function buildReportPdf(title: string, body: string): Uint8Array {
  const lines = [latinLine(title), "", ...wrapLines(body)];
  const commands = ["BT", "/F1 12 Tf", "50 800 Td", "16 TL"];
  for (const line of lines) {
    commands.push(`(${pdfEscape(line)}) Tj`, "T*");
  }
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];
  let offset = 0;
  const header = "%PDF-1.4\n";
  const chunks = [header];
  offset = Buffer.byteLength(header);
  const xref = [0];
  for (const object of objects) {
    xref.push(offset);
    const chunk = `${object}\n`;
    chunks.push(chunk);
    offset += Buffer.byteLength(chunk);
  }
  const startxref = offset;
  const xrefTable = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...xref.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n `),
    "trailer << /Size " + (objects.length + 1) + " /Root 1 0 R >>",
    "startxref",
    String(startxref),
    "%%EOF",
  ].join("\n");
  chunks.push(xrefTable);
  return Buffer.concat(chunks.map((item) => Buffer.from(item)));
}
