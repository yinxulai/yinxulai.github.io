let i: number, j: number, k: number
let u: number, v: number, w: number

let A = [0, 0, 0]
let T = [0x15, 0x38, 0x32, 0x2c, 0x0d, 0x13, 0x07, 0x2a]

export class Simplex {
    private _seedValue: number
    constructor(seed = 3000) {
        this._seedValue = Simplex.xorshift(seed)

        this.setSeed = this.setSeed.bind(this)
        this.noise = this.noise.bind(this)
    }

    static xorshift(value: number) {
        let x = value ^ (value >> 12)
        x = x ^ (x << 25)
        x = x ^ (x >> 27)
        return x * 2
    }

    static b2func(N: number, B: number) {
        return N >> B & 1
    }

    static b4func(i: number, j: number, k: number, B: number) {
        return T[Simplex.b2func(i, B) << 2 | Simplex.b2func(j, B) << 1 | Simplex.b2func(k, B)]
    }

    static K(a: number) {
        var s = (A[0] + A[1] + A[2]) / 6.
        var x = u - A[0] + s,
            y = v - A[1] + s,
            z = w - A[2] + s
        var t = .6 - x * x - y * y - z * z
        var h = Simplex.shuffle(i + A[0], j + A[1], k + A[2])

        A[a]++

        if (t < 0) return 0

        var b5 = h >> 5 & 1,
            b4 = h >> 4 & 1,
            b3 = h >> 3 & 1,
            b2 = h >> 2 & 1,
            b = h & 3
        var p = b === 1 ? x : b === 2 ? y : z,
            q = b === 1 ? y : b === 2 ? z : x,
            r = b === 1 ? z : b === 2 ? x : y
        p = (b5 === b3 ? -p : p)
        q = (b5 === b4 ? -q : q)
        r = (b5 !== (b4 ^ b3) ? -r : r)
        t *= t

        return 8 * t * t * (p + (b === 0 ? q + r : b2 === 0 ? q : r))
    }

    static shuffle(i: number, j: number, k: number) {
        return Simplex.b4func(i, j, k, 0) + Simplex.b4func(j, k, i, 1) +
            Simplex.b4func(k, i, j, 2) + Simplex.b4func(i, j, k, 3) +
            Simplex.b4func(j, k, i, 4) + Simplex.b4func(k, i, j, 5) +
            Simplex.b4func(i, j, k, 6) + Simplex.b4func(j, k, i, 7)
    }

    setSeed(seed = 3000) {
        this._seedValue = Simplex.xorshift(seed)
    }

    noise(a: number, b: number, c: number) {
        let x = a + this._seedValue
        let y = b + this._seedValue
        let z = c + this._seedValue
        let s = (x + y + z) / 3

        i = Math.floor(x + s)
        j = Math.floor(y + s)
        k = Math.floor(z + s)
        s = (i + j + k) / 6.
        u = x - i + s
        v = y - j + s
        w = z - k + s
        A[0] = A[1] = A[2] = 0

        const hi = u >= w ? u >= v ? 0 : 1 : v >= w ? 1 : 2
        const lo = u < w ? u < v ? 0 : 1 : v < w ? 1 : 2

        return Simplex.K(hi) + Simplex.K(3 - hi - lo) + Simplex.K(lo) + Simplex.K(0)
    }
}
