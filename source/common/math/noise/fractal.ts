type FractalNoiseCallback = (x: number, y: number, z: number) => number
export class Fractal {
    static noise(x: number, y: number, z: number, octaves: number, noiseCallback: FractalNoiseCallback) {
        let t = 0, f = 1, n = 0
        for (let i = 0; i < octaves; i++) {
            n += noiseCallback(x * f, y * f, z * f) / f
            t += 1 / f
            f *= 2
        }
        return n / t
    }
}
