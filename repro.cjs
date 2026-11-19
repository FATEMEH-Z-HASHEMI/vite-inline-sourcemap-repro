const PREFIX =
  '//# sourceMappingURL=data:application/json;base64,'

const sourceMap = {
  version: 3,
  sources: ['a.js'],
  names: [],
  mappings: 'AAAAA',
}

const base64 = Buffer.from(JSON.stringify(sourceMap))
  .toString('base64')
  .replace(/=+$/, '')

function extractInlineSourceMap(code) {
  const start = code.lastIndexOf(PREFIX)
  if (start === -1) return

  const dataStart = start + PREFIX.length
  let dataEnd = code.indexOf('\n', dataStart)

  if (dataEnd === -1) dataEnd = code.length
  if (code.charCodeAt(dataEnd - 1) === 13) dataEnd--

  return code.slice(dataStart, dataEnd)
}

const cases = [
  ['LF', '\n', true],
  ['CR', '\r', false],
  ['CRLF', '\r\n', true],
  ['LINE_SEPARATOR', '\u2028', false],
  ['PARAGRAPH_SEPARATOR', '\u2029', false],
]

let failed = false

for (const [name, separator, shouldPass] of cases) {
  const code = [
    'const before = 1;',
    `${PREFIX}${base64}`,
    'const afterMap = 2;',
  ].join(separator)

  try {
    const extracted = extractInlineSourceMap(code)
    const parsed = JSON.parse(
      Buffer.from(extracted, 'base64').toString(),
    )

    const passed = parsed.mappings === sourceMap.mappings

    if (passed !== shouldPass) {
      failed = true
      console.error(`${name}: UNEXPECTED RESULT`)
    } else {
      console.log(`${name}: ${passed ? 'PASS' : 'BUG REPRODUCED'}`)
    }
  } catch {
    if (shouldPass) {
      failed = true
      console.error(`${name}: UNEXPECTED FAILURE`)
    } else {
      console.log(`${name}: BUG REPRODUCED`)
    }
  }
}

if (failed) process.exitCode = 1
