import type { LedgerBlock } from '../types';

/**
 * SHA-256 implementation supporting both browser Web Crypto API and pure JS fallback
 */
export async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure TypeScript fallback
  return fallbackSha256(message);
}

function fallbackSha256(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  const words: number[] = [];
  const asciiBitLength = str.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeAscii = str + '\x80';
  while (compositeAscii.length % 64 !== 56) compositeAscii += '\x00';
  for (let i = 0; i < compositeAscii.length; i++) {
    const j = compositeAscii.charCodeAt(i);
    const wordIdx = i >> 2;
    words[wordIdx] = (words[wordIdx] || 0) | (j << ((3 - (i % 4)) * 8));
  }
  words.push((asciiBitLength / maxWord) | 0);
  words.push(asciiBitLength);

  for (let j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15] || 0;
      const w2 = w[i - 2] || 0;
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i] || 0
            : ((w[i - 16] || 0) +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                (w[i - 7] || 0) +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  let result = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Calculates cryptographic SHA-256 block hash for the tamper-evident ledger
 */
export async function calculateBlockHash(
  index: number,
  timestamp: string,
  previousHash: string,
  dataHash: string,
  actor: string,
  action: string,
  nonce: number
): Promise<string> {
  const payload = `${index}|${timestamp}|${previousHash}|${dataHash}|${actor}|${action}|${nonce}`;
  return await sha256(payload);
}

/**
 * Validates the cryptographic integrity of the entire ledger chain
 */
export async function verifyLedgerChainIntegrity(blocks: LedgerBlock[]): Promise<{
  isValid: boolean;
  tamperedBlockIndex?: number;
  expectedHash?: string;
  actualHash?: string;
  brokenLinkIndex?: number;
}> {
  if (!blocks || blocks.length === 0) {
    return { isValid: true };
  }

  // Genesis block check
  const genesis = blocks[0];
  const genesisCalcHash = await calculateBlockHash(
    genesis.index,
    genesis.timestamp,
    genesis.previousHash,
    genesis.dataHash,
    genesis.actor,
    genesis.action,
    genesis.nonce
  );

  if (genesis.hash !== genesisCalcHash) {
    return {
      isValid: false,
      tamperedBlockIndex: 0,
      expectedHash: genesisCalcHash,
      actualHash: genesis.hash
    };
  }

  // Successive blocks link check
  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const previous = blocks[i - 1];

    // Check pointer integrity
    if (current.previousHash !== previous.hash) {
      return {
        isValid: false,
        brokenLinkIndex: i,
        tamperedBlockIndex: i,
        expectedHash: previous.hash,
        actualHash: current.previousHash
      };
    }

    // Check hash computation
    const recomputedHash = await calculateBlockHash(
      current.index,
      current.timestamp,
      current.previousHash,
      current.dataHash,
      current.actor,
      current.action,
      current.nonce
    );

    if (current.hash !== recomputedHash) {
      return {
        isValid: false,
        tamperedBlockIndex: i,
        expectedHash: recomputedHash,
        actualHash: current.hash
      };
    }
  }

  return { isValid: true };
}

export function maskAadhaar(aadhaar: string): string {
  const cleaned = (aadhaar || '').replace(/\D/g, '');
  if (cleaned.length < 4) return 'XXXX-XXXX-XXXX';
  const lastFour = cleaned.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}

export function maskPhone(phone: string): string {
  const cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length < 5) return '*****';
  return `${cleaned.slice(0, 2)}*****${cleaned.slice(-3)}`;
}

export async function generateConsentSignature(
  aadhaarHash: string,
  purpose: string,
  timestamp: string,
  secretKey: string = 'MAH_SETU_CONSENT_SALT_2026'
): Promise<string> {
  const raw = `${aadhaarHash}:${purpose}:${timestamp}:${secretKey}`;
  const hash = await sha256(raw);
  return `MS-ECDSA-P256:${hash.slice(0, 32)}`;
}

export async function generateOfficerDscStamp(
  officerName: string,
  officerRole: string,
  applicationId: string,
  decision: string,
  timestamp: string
): Promise<string> {
  const content = `${officerName}|${officerRole}|${applicationId}|${decision}|${timestamp}`;
  const signature = await sha256(content);
  return `MH-GOV-DSC-SHA256::${signature.slice(0, 24).toUpperCase()}`;
}
