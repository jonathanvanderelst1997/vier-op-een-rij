import assert from 'node:assert/strict'
import fs from 'node:fs'

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8')
const css = fs.readFileSync(new URL('./stijl.css', import.meta.url), 'utf8')
const script = fs.readFileSync(new URL('./script.js', import.meta.url), 'utf8')

assert.match(html, /<meta name="viewport"/i, 'viewport meta is required')
assert.match(html, /id="status"[^>]*role="status"[^>]*aria-live="polite"/i, 'polite live status is required')
assert.match(html, /id="opnieuw"/, 'restart control is required')
assert.match(html, /Rood = R, geel = G/i, 'non-color R/G cue is required')
assert.match(script, /for \(let column = 0; column < COLS; column \+= 1\)/, 'seven column controls must be generated from COLS')
assert.match(script, /button\.disabled = gameOver \|\| findDropRow\(board, column\) < 0/, 'full columns/game over must disable column controls')
assert.match(css, /min-height:\s*44px/, 'primary controls need at least 44px minimum height')
assert.match(css, /focus-visible/, 'visible keyboard focus style is required')
assert.match(css, /\.cel\.rood::after\s*\{\s*content:\s*'R'/, 'red discs need non-color marker')
assert.match(css, /\.cel\.geel::after\s*\{\s*content:\s*'G'/, 'yellow discs need non-color marker')

console.log('vier-op-een-rij static accessibility contract: ok')
