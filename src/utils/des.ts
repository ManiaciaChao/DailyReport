import { createCipheriv } from 'crypto';

const magicTable = [0, 1, 2, 6, 38, 37, 36, 7, 8, 9, 10, 14, 46, 45, 44, 15, 16, 17, 18, 22, 54, 53, 52, 23, 24, 25, 26, 30, 62, 61, 60, 31, 32, 33, 34, 35, 5, 4, 3, 39, 40, 41, 42, 43, 13, 12, 11, 47, 48, 49, 50, 51, 21, 20, 19, 55, 56, 57, 58, 59, 29, 28, 27, 63];

const toBuffer = (t: string) => Buffer.from(t.padEnd(Math.ceil(t.length / 4) * 4, '\0'), 'utf16le').swap16();
const toBits = (str: string) => [...toBuffer(str)].flatMap((i) => i.toString(2).padStart(8, '0').split('').map(Number));
const desEncrypt = (plain: Buffer, key: string) => {
    const k = magicTable.map((i) => toBits(key)[i]).join('').match(/.{1,8}/g)!.map(i => parseInt(i, 2));
    const cipher = createCipheriv('DES-ECB', Buffer.from(k), null).setAutoPadding(false);
    return Buffer.concat([cipher.update(plain), cipher.final()]);
}

export const desEEE = (plain: string, k1: string, k2: string, k3: string) => {
    return desEncrypt(desEncrypt(desEncrypt(toBuffer(plain), k1), k2), k3).toString('hex').toUpperCase();
}
