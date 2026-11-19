# Vite Inline Source Map Reproduction

Minimal reproduction of incorrect inline source map extraction when JavaScript line terminators other than LF are used.

## Requirements

- Node.js

## Run

```bash
node repro.cjs
```

## Expected output

```text
LF: PASS
CR: BUG REPRODUCED
CRLF: PASS
LINE_SEPARATOR: BUG REPRODUCED
PARAGRAPH_SEPARATOR: BUG REPRODUCED
```

## Affected behavior

The extraction logic searches for LF (`\n`) and only handles CR (`\r`) when it appears immediately before LF.

Standalone CR, LINE SEPARATOR (`\u2028`), and PARAGRAPH SEPARATOR (`\u2029`) are not recognized as line terminators.

As a result, subsequent JavaScript code can be included in the extracted source map data, causing JSON parsing to fail.
