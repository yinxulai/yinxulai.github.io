precision highp float;

// Attributes
attribute vec3 position;  // 顶点位置属性
attribute vec3 normal;  // 顶点法线属性
attribute vec2 uv;  // 顶点纹理坐标属性

// Uniforms
uniform mat4 worldViewProjection;  // 世界视图投影矩阵

// Varying
varying vec4 vPosition;  // 传递给片段着色器的顶点位置
varying vec3 vNormal;  // 传递给片段着色器的顶点法线
varying vec2 vUV;  // 传递给片段着色器的顶点纹理坐标

void main() {
    vec4 p = vec4(position, 1.0);

    vPosition = p;  // 将顶点位置传递给片段着色器
    vNormal = normal;  // 将顶点法线传递给片段着色器
    
    vUV = uv;  // 将顶点纹理坐标传递给片段着色器
    // vUV.y = 1.0 - vUV.y;  // 反转纹理坐标的y轴（可选，根据需求启用）
    // 如果需要翻转纹理在屏幕上的显示，可以取消注释上一行代码，将纹理坐标的y轴进行反转
    gl_Position = worldViewProjection * p;  // 计算顶点的最终位置
}
