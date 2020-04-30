# DailyReport
Submit your health status to your fucking department everyday

## Usage

1. install the only dependency `node-fetch`
2. prepare `config.json` as described in the script
3. use crontab or something else to run it every day
    * Tips: `0 12 * * * sleep $(( RANDOM \% 21600 )); node /path/to/fuck.js` will run randomly from 12:00 to 18:00 everyday
        * `$RANDOM` should be supported in your shell, or you can get a 32 bits random number by running `od -vAn -N4 -tu4 < /dev/urandom`

## Q&A

Q: Why no `package.json`?  
A: Because I am lazyyyyyyyyyy :(

## Bonus

Well, `HUST One` uses a rediculous DES algorithm written by someone a trillion years ago to encrypt username, password and a nonce.  
This algorithm, which receives 3 keys but differs a lot from Triple-DES, is not suprisingly incorrect.  
The original script is extremely disgusting so I reimplemented it in a not so disgusting way.  

*Warning*: It's not recommended to use the following script to encrypt large size of data due to
1. low performance (**10x slower**) caused by my abuse of inline tricks
2. no decrypt function is provided
3. **non-ascii characters** will produce **different** cipher from the original script

```js
const des = (data, k1, k2, k3) => {
    const getBytes = str => str.split('').map(i => i.charCodeAt(0).toString(2).padStart(16, '0')).join('').padEnd(64, '0').split('').map(Number);
    const xor = (x, y) => x.map((i, j) => i ^ y[j]);
    const pPermute = sBoxByte => [15, 6, 19, 20, 28, 11, 27, 16, 0, 14, 22, 25, 4, 17, 30, 9, 1, 7, 23, 13, 31, 26, 2, 8, 18, 12, 29, 5, 21, 10, 3, 24].map(i => sBoxByte[i]);
    const expandPermute = rightData => [...new Array(8)].flatMap((i, j) => [rightData[31], ...rightData, rightData[0]].slice(j * 4, j * 4 + 6));
    const sBoxPermute = b => [...new Array(8)].flatMap((_, m) => [[[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7], [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8], [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0], [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]], [[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10], [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5], [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15], [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]], [[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8], [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1], [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7], [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]], [[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15], [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9], [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4], [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]], [[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9], [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6], [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14], [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]], [[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11], [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8], [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6], [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]], [[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1], [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6], [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2], [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]], [[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7], [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2], [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8], [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]]][m][b[m * 6] * 2 + b[m * 6 + 5]][b[m * 6 + 1] * 8 + b[m * 6 + 2] * 4 + b[m * 6 + 3] * 2 + b[m * 6 + 4]].toString(2).padStart(4, '0').split('').map(Number));
    const finallyPermute = endByte => [39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25, 32, 0, 40, 8, 48, 16, 56, 24].map(i => endByte[i]);
    return data.match(/.{1,4}/g).map(getBytes).map(t => {
        [k1, k2, k3].flatMap(i => i.match(/.{1,4}/g).map(getBytes)).forEach(k => {
            let key = [], l = [], r = [];
            for (let i = 0; i < 7; i++) for (let j = 0; j < 8; j++) key[i * 8 + j] = k[8 * (7 - j) + i];
            for (let i = 0; i < 4; i++) for (let j = 7; j >= 0; j--) [r[i * 8 + 7 - j], l[i * 8 + 7 - j]] = t.slice(j * 8 + i * 2, j * 8 + i * 2 + 2);
            [...new Array(16)].forEach((_, i) => {
                for (let j = 0; j < [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1][i]; j++) key = [...key.slice(1, 28), key[0], ...key.slice(29), key[28]];
                [l, r] = [r, xor(pPermute(sBoxPermute(xor(expandPermute(r), [13, 16, 10, 23, 0, 4, 2, 27, 14, 5, 20, 9, 22, 18, 11, 3, 25, 7, 15, 6, 26, 19, 12, 1, 40, 51, 30, 36, 46, 54, 29, 39, 50, 44, 32, 47, 43, 48, 38, 55, 33, 52, 45, 41, 49, 35, 28, 31].map(i => key[i])))), l)];
            });
            t = finallyPermute([...r, ...l]);
        });
        return BigInt('0b' + t.join('')).toString(16).padStart(16, '0');
    }).join('').toUpperCase();
};
```
