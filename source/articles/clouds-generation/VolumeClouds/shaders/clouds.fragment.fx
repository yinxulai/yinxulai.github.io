// 参考：https://www.shadertoy.com/view/ltlSWB
// 参考：https://www.shadertoy.com/view/4dsXWn
// 参考：https://www.shadertoy.com/view/XlXGzB
// 参考：https://www.shadertoy.com/view/Md2SR3
// ======================================================================

precision highp float;
uniform mat4 worldView;
varying vec4 vPosition;
precision mediump float;

const float M_PI = 3.1415926535;
const float DEGRAD = M_PI / 180.0;

varying vec3 vNormal;
varying vec2 vUV;
uniform sampler2D iChannel0;
uniform float sunx;
uniform float suny;
uniform float time;

float moonx = 1.0;
float moony = 9.6;
float cloudy = 0.6;
float height = 500.0;

// 渲染质量
const int steps = 16; // 16为快速，128或256为极高
const int stepss = 16; // 16为快速，16或32为高

float camroty = 0. * DEGRAD; // 相机旋转角度（弧度） 20.
float haze = 0.2; // 雾化程度 0.2

float cloudnear = 1.0; // 云层近处距离 9e3 12e3  // 切勿在天顶渲染过于接近的云层
float cloudfar = 1e3; // 云层远处距离 15e3 17e3

float startreshold = 0.99; // 星空密度阈值 0.99 0.98

const float I = 10.; // 太阳光强度，10.0为正常
const float g = 0.45; // 光散射参数 .76 //.45 //.6  .45为正常
const float g2 = g * g;

// Rayleigh 散射（天空颜色，大气高度高达 8km）
vec3 bR = vec3(5.8e-6, 13.5e-6, 33.1e-6); // 标准地球

// Mie 散射（水颗粒，高度高达1km）
vec3 bM = vec3(21e-6); // 标准Mie

// 位置
const float Hr = 8000.0; // Rayleigh散射顶部高度
const float Hm = 1000.0; // Mie散射顶部高度

const float R0 = 6360e3; // 行星半径
const float Ra = 6380e3; // 大气层半径
vec3 C = vec3(0., -R0, 0.); // 行星中心
vec3 Ds = normalize(vec3(0., .09, -1.)); // 太阳方向？

// 星空
// 返回范围在[0.0, 1.0]之间的随机噪声，根据x计算。
float Noise2d(in vec2 x)
{
    float xhash = cos(x.x * 37.0);
    float yhash = cos(x.y * 57.0);
    return fract(415.92653 * (xhash + yhash));
}

// 将Noise2d()转换为“星空场景”，将低于fThreshhold的值设为零。
float NoisyStarField(in vec2 vSamplePos, float fThreshhold)
{
    float StarVal = Noise2d(vSamplePos);
    if (StarVal >= fThreshhold)
        StarVal = pow((StarVal - fThreshhold) / (1.0 - fThreshhold), 6.0);
    else
        StarVal = 0.0;
    return StarVal;
}

// 通过仅在整数值处取样来稳定 NoisyStarField()
float StableStarField(in vec2 vSamplePos, float fThreshhold)
{
    // 线性插值四个样本值。
    // 注意：这种方法会产生一些视觉伪影。
    // 该星空场景应该有更好的“抗锯齿”方式。
    float fractX = fract(vSamplePos.x);
    float fractY = fract(vSamplePos.y);
    vec2 floorSample = floor(vSamplePos);
    float v1 = NoisyStarField(floorSample, fThreshhold);
    float v2 = NoisyStarField(floorSample + vec2(0.0, 1.0), fThreshhold);
    float v3 = NoisyStarField(floorSample + vec2(1.0, 0.0), fThreshhold);
    float v4 = NoisyStarField(floorSample + vec2(1.0, 1.0), fThreshhold);

    float StarVal = v1 * (1.0 - fractX) * (1.0 - fractY) +
                    v2 * (1.0 - fractX) * fractY +
                    v3 * fractX * (1.0 - fractY) +
                    v4 * fractX * fractY;
    return StarVal;
}

// 云层噪声
float Noise(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = texture(iChannel0, (uv + 0.5) / 256.0, -100.0).yx;
    return mix(rg.x, rg.y, f.z);
}

float fnoise(vec3 p, in float t)
{
    p *= .25;
    float f;

    f = 0.5000 * Noise(p);
    p = p * 3.02;
    p.y -= t * .2;
    f += 0.2500 * Noise(p);
    p = p * 3.03;
    p.y += t * .06;
    f += 0.1250 * Noise(p);
    p = p * 3.01;
    f += 0.0625 * Noise(p);
    p = p * 3.03;
    f += 0.03125 * Noise(p);
    p = p * 3.02;
    f += 0.015625 * Noise(p);
    return f;
}

// 云层、散射
float cloud(vec3 p, in float t)
{
    float cld = fnoise(p * 2e-4, t) + cloudy * 0.1;
    cld = smoothstep(.4 + .04, .6 + .04, cld);
    cld *= 70.;
    return cld + haze;
}

void densities(in vec3 pos, out float rayleigh, out float mie, in float t)
{
    float h = length(pos - C) - R0;
    rayleigh = exp(-h / Hr);
    vec3 d = pos;
    d.y = 0.0;
    float dist = length(d);

    float cld = 0.;
    if (5e3 < h && h < 8e3)
    {
        cld = cloud(pos + vec3(23175.7, 0., -t * 3e3), t);
        cld *= sin(3.1415 * (h - 5e3) / 5e3) * cloudy;
    }

    if (dist < cloudfar)
    {
        float factor = clamp(1.0 - ((cloudfar - dist) / (cloudfar - cloudnear)), 0.0, 1.0);
        cld *= factor;
    }

    mie = exp(-h / Hm) + cld + haze;
}

float escape(in vec3 p, in vec3 d, in float R)
{

    vec3 v = p - C;
    float b = dot(v, d);
    float c = dot(v, v) - R * R;
    float det2 = b * b - c;
    if (det2 < 0.)
        return -1.;
    float det = sqrt(det2);
    float t1 = -b - det, t2 = -b + det;
    return (t1 >= 0.) ? t1 : t2;
}

// 散射
void scatter(vec3 o, vec3 d, out vec3 col, out float scat, in float t)
{
    float L = escape(o, d, Ra);
    float mu = dot(d, Ds);
    float opmu2 = 1. + mu * mu;
    float phaseR = .0596831 * opmu2;
    float phaseM = .1193662 * (1. - g2) * opmu2 / ((2. + g2) * pow(1. + g2 - 2. * g * mu, 1.5));

    float depthR = 0., depthM = 0.;
    vec3 R = vec3(0.), M = vec3(0.);

    float dl = L / float(steps);
    for (int i = 0; i < steps; ++i)
    {
        float l = float(i) * dl;
        vec3 p = o + d * l;

        float dR, dM;
        densities(p, dR, dM, t);
        dR *= dl;
        dM *= dl;
        depthR += dR;
        depthM += dM;

        float Ls = escape(p, Ds, Ra);
        if (Ls > 0.)
        {
            float dls = Ls / float(stepss);
            float depthRs = 0., depthMs = 0.;
            for (int j = 0; j < stepss; ++j)
            {
                float ls = float(j) * dls;
                vec3 ps = p + Ds * ls;
                float dRs, dMs;
                densities(ps, dRs, dMs, t);
                depthRs += dRs * dls;
                depthMs += dMs * dls;
            }

            vec3 A = exp(-(bR * (depthRs + depthR) + bM * (depthMs + depthM)));
            R += A * dR;
            M += A * dM;
        }
    }

    col = I * (R * bR * phaseR + M * bM * phaseM);
    scat = 1.0 - clamp(depthM * 1e-5, 0., 1.);
}

// 射线追踪
vec3 rotate_y(vec3 v, float angle)
{
    float ca = cos(angle);
    float sa = sin(angle);
    return v * mat3(
        +ca, +.0, -sa,
        +.0, +1.0, +.0,
        +sa, +.0, +ca);
}

vec3 rotate_x(vec3 v, float angle)
{
    float ca = cos(angle);
    float sa = sin(angle);
    return v * mat3(
        +1.0, +.0, +.0,
        +.0, +ca, -sa,
        +.0, +sa, +ca);
}

vec4 generate(in vec2 uv, in vec2 fragCoord, in vec2 sunpos, in float t)
{

    float att = 1.0;
    float staratt = 0.0;
    if (sunpos.y < -0.20)
    {
        sunpos.y = -sunpos.y;
        att = 0.25;
        staratt = 1.0;
    }

    vec3 O = vec3(0., height, 0.);

    vec3 D = normalize(rotate_y(rotate_x(vec3(0.0, 0.0, 1.0), -uv.y * M_PI / 2.0), -uv.x * M_PI + camroty));

    if (D.y <= -0.15)
    {
        D.y = -0.3 - D.y;
    }

    Ds = normalize(rotate_y(rotate_x(vec3(0.0, 0.0, 1.0), -sunpos.y * M_PI / 2.0), -sunpos.x * M_PI));
    float scat = 0.;
    vec3 color = vec3(0.);
    scatter(O, D, color, scat, t);
    color *= att;

    float starcolor = StableStarField(fragCoord, startreshold);
    color += vec3(scat * starcolor * staratt);
    float env = 1.0;
    return (vec4(env * pow(color, vec3(.7)), 1.0));
}

void main()
{
    vec2 uv = vec2(2.0 * vUV.x - 1.0, -2.0 * vUV.y + 1.0);
    vec2 sunpos = vec2(sunx, suny);
    float t = time;
    gl_FragColor = generate(uv, uv, sunpos, t);
}
