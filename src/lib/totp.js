// Verifikasi TOTP (RFC 6238) murni di browser via Web Crypto API — tanpa library.
// Kompatibel dengan Google Authenticator / Authy (SHA-1, 6 digit, periode 30 detik).

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32ToBytes(base32) {
  const clean = base32.replace(/=+$/, '').toUpperCase().replace(/\s/g, '')
  let bits = ''
  for (const char of clean) {
    const idx = BASE32_ALPHABET.indexOf(char)
    if (idx === -1) continue
    bits += idx.toString(2).padStart(5, '0')
  }
  const bytes = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }
  return new Uint8Array(bytes)
}

async function generateTOTP(secret, counter) {
  const keyBytes = base32ToBytes(secret)

  // counter -> 8-byte big-endian
  const counterBytes = new Uint8Array(8)
  let tmp = counter
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = tmp & 0xff
    tmp = Math.floor(tmp / 256)
  }

  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, counterBytes))

  // dynamic truncation
  const offset = sig[sig.length - 1] & 0x0f
  const binary =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff)

  return (binary % 1_000_000).toString().padStart(6, '0')
}

// Verifikasi kode user. window=1 → toleransi ±30 detik (jaga-jaga jam beda tipis).
export async function verifyTOTP(secret, code, window = 1) {
  if (!secret || !/^\d{6}$/.test(code)) return false
  const counter = Math.floor(Date.now() / 1000 / 30)
  for (let w = -window; w <= window; w++) {
    const expected = await generateTOTP(secret, counter + w)
    if (expected === code) return true
  }
  return false
}
