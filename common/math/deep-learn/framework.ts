// 激活函数
interface Activation {
  // 激活函数的处理逻辑
  process: (input: number) => number
  // 该激活函数的导数
  derivative: (input: number) => number
}

class Tanh implements Activation {
  process(input: number) { return Math.tanh(input) }
  derivative(input: number) { return 1 - Math.pow(this.process(input), 2) }
}

class Relu implements Activation {
  process(input: number) { return Math.max(0, input) }
  derivative(input: number) { return input <= 0 ? 0 : 1 }
}

class Sigmoid implements Activation {
  process(input: number) { return 1 / (1 + Math.exp(-input)) }
  derivative(input: number) { return this.process(input) * (1 - this.process(input)) }
}

class Linear implements Activation {
  process(input: number) { return input }
  derivative(_input: number) { return 1 }
}

// 神经元
// 每个神经元计算之后将结果通过 outputLinks 传递给后面的神经元
export class Neuron {
  static id: number = 0
  private id: number = 0 // 神经元 ID

  constructor(
    private bias: number = 0, // 偏置
    public inputLinks: NeuronLink[] = [], // 神经元输入连接
    public outputLinks: NeuronLink[] = [], // 神经元的输出连接
    private activation: Activation = new Linear() // 神经元激活函数
  ) { this.id = Neuron.id++ }

  process() {
    // 将 inputLink 里的来自上一层神经元的 output 相加再上 bias
    const cumulative = this.inputLinks.reduce((acc, current) => {
      acc += current.output()
      return acc
    }, this.bias)

    // 对上一步的数据调用激活函数
    const result = this.activation.process(cumulative)

    // 将结果通过 outputLink 向下一层的神经元传递
    for (const outputLink of this.outputLinks) {
      outputLink.input(result)
    }
  }

  toString() {
    return `Neuron:${this.id}`
  }
}

// 神经元连接
export class NeuronLink {
  private value: number = 0
  constructor(private weight: number = 0) { }

  input(data: number) {
    this.value = data
  }

  output() {
    return this.value * this.weight
  }
}

// 神经元层
export class NeuronLayer {
  private neurons: Neuron[] = []
  get neuronSize() { return this.neurons.length }

  pushNeuron(neuron: Neuron) {
    this.neurons.push(neuron)
    return this
  }

  forEach(callback: (neuron: Neuron) => void) {
    for (const neuron of this.neurons) {
      callback(neuron)
    }
  }

  toString() {
    return `Neuron:${this.neurons.toString()}`
  }
}

// 神经网络
// 针对可视化优化了结构设计
export class NeuronNetwork {
  private layers: NeuronLayer[] = []
  private inputLinks: NeuronLink[] = []
  private outputLinks: NeuronLink[] = []

  constructor(private loss: (output: number[]) => number[]) {

  }

  /**
   * @description 向神经网络输入数据
   */
  input(values: number[]) {
    if (values.length !== values.length) {
      console.error('输入与第一层神经元数量不一致')
      return
    }

    for (let index = 0; index < this.inputLinks.length; index++) {
      const link = this.inputLinks[index]
      link.input(values[index])
    }
  }

  /**
 * @description 从神经网络输出数据
 */
  output(): number[] {
    return this.outputLinks.map(link => link.output())
  }

  pushLayer(layer: NeuronLayer) {
    // 第一层网络需要与 inputLinks 连接
    if (this.layers.length === 0) {
      // 根据第一层的神经元个数创建 inputLinks
      this.inputLinks = new Array(layer.neuronSize).fill(0)

      // 将 inputLinks 与每个神经元相连
      layer.forEach(neuron => (neuron.inputLinks = this.inputLinks))

      this.layers.push(layer)
      return this
    }

    // 将当前的神经网络与前一层连接
    const previousLayerIndex = this.layers.length - 2
    const previousLayer = this.layers[previousLayerIndex]
    previousLayer.forEach(neuron => {
      const link = new NeuronLink()
      neuron.outputLinks.push(link)
      layer.forEach(newNeuron => (
        newNeuron.inputLinks.push(link)
      ))
    })

    // 将最后一层与 outputLinks 连接

    return this
  }
}

// 正向传播过程
// output = activation(向量乘(input,weight) + bias)
// 反向传播过程
