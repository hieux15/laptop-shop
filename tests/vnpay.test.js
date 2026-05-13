import { describe, it, expect } from 'vitest';
import { sortObject, generateSignature } from '@/lib/vnpay';

describe('lib/vnpay', () => {
  it('sortObject: sorts keys and encodes values (space -> +)', () => {
    const input = { b: 'hello world', a: '1' };
    const out = sortObject(input);
    expect(Object.keys(out)).toEqual(['a', 'b']);
    expect(out.a).toBe('1');
    expect(out.b).toBe('hello+world');
  });

  it('sortObject: does not include inherited properties', () => {
    const base = { inherited: 'x' };
    const input = Object.create(base);
    input.z = '1';
    input.a = '2';

    const out = sortObject(input);
    expect(Object.keys(out)).toEqual(['a', 'z']);
    expect(out.inherited).toBeUndefined();
  });

  it('generateSignature: returns deterministic sha512 hmac hex', () => {
    const data = { a: '1', b: '2' };
    const secret = 'secret';
    const sig1 = generateSignature(data, secret);
    const sig2 = generateSignature(data, secret);

    expect(sig1).toMatch(/^[0-9a-f]{128}$/);
    expect(sig1).toBe(sig2);
  });
});
