
/**
 * 一个误差函数及其导数。
 */
export interface ErrorFunction {
  error: (output: number, target: number) => number // 计算误差值
  der: (output: number, target: number) => number // 计算误差导数
}

/** 内置的误差函数 */
export class Errors {
  public static SQUARE: ErrorFunction = {
    error: (output: number, target: number) =>
      0.5 * Math.pow(output - target, 2), // 平方误差
    der: (output: number, target: number) => output - target // 平方误差导数
  }
}

/** 节点的激活函数及其导数。 */
export interface ActivationFunction {
  output: (input: number) => number // 计算输出值
  der: (input: number) => number // 计算导数
}


/** 内置的激活函数 */
export class Activations {
  public static TANH: ActivationFunction = {
    output: x => (Math as any).tanh(x), // 双曲正切函数
    der: x => {
      let output = Activations.TANH.output(x)
      return 1 - output * output // 双曲正切函数导数
    }
  }
  public static RELU: ActivationFunction = {
    output: x => Math.max(0, x), // ReLU函数
    der: x => x <= 0 ? 0 : 1 // ReLU函数导数
  }
  public static SIGMOID: ActivationFunction = {
    output: x => 1 / (1 + Math.exp(-x)), // Sigmoid函数
    der: x => {
      let output = Activations.SIGMOID.output(x)
      return output * (1 - output) // Sigmoid函数导数
    }
  }
  public static LINEAR: ActivationFunction = {
    output: x => x, // 线性函数
    der: () => 1 // 线性函数导数
  }
}

/** 计算网络中给定权重的惩罚成本的函数。 */
export interface RegularizationFunction {
  output: (weight: number) => number // 计算惩罚成本
  der: (weight: number) => number // 计算惩罚导数
}

/** 内置的正则化函数 */
export class RegularizationFunctions {
  public static L1: RegularizationFunction = {
    output: w => Math.abs(w), // L1正则化
    der: w => w < 0 ? -1 : (w > 0 ? 1 : 0) // L1正则化导数
  }
  public static L2: RegularizationFunction = {
    output: w => 0.5 * w * w, // L2正则化
    der: w => w // L2正则化导数
  }
}

/**
 * 神经网络中的节点。每个节点都有一个状态
 * （总输入、输出及其导数），在每次前向传播和反向传播后都会发生变化。
 */
export class Node {
  id: string
  /** 输入链接列表。 */
  inputLinks: Link[] = []
  /** 输出链接列表。 */
  outputLinks: Link[] = []

  bias = 0.1
  input = 0
  /** 相对于该节点输出的误差导数。 */
  outputDer = 0
  output = 0
  /** 相对于该节点总输入的误差导数。 */
  inputDer = 0

  /**
   * 从上次更新以来，相对于该节点总输入的累积误差导数。
   * 该导数等于dE/db，其中b是节点的偏置项。
   */
  accInputDer = 0
  /**
   * 从上次更新以来，相对于总输入的累积误差导数的数量。
   */
  numAccumulatedDers = 0

  /** 激活函数，接受总输入并返回节点的输出 */
  activation: ActivationFunction

  /**
   * 创建具有提供的 ID 和激活函数的新节点。
   */
  constructor(id: string, activation: ActivationFunction, initZero?: boolean) {
    this.id = id
    this.activation = activation
    if (initZero) {
      this.bias = 0
    }
  }

  /** 重新计算节点的输出并返回它。 */
  updateOutput(): number {
    // 将总输入存储到节点中。
    this.input = this.bias
    for (let j = 0; j < this.inputLinks.length; j++) {
      let link = this.inputLinks[j]
      this.input += link.weight * link.source.output
    }
    this.output = this.activation.output(this.input)
    return this.output
  }
}

/**
 * 神经网络中的连接。每个连接具有权重、源节点和目标节点。还具有内部状态（相对于特定输入的误差导数），
 * 在反向传播运行后会更新该状态。
 */
export class Link {
  id: string // 连接的唯一标识符
  source: Node // 源节点
  dest: Node // 目标节点
  weight = Math.random() - 0.5 // 权重，初始化为随机值
  isDead = false // 指示连接是否已经失效
  /** 相对于此权重的误差导数。 */
  errorDer = 0 // 误差导数的初始值为0
  /** 上次更新后累积的误差导数。 */
  accErrorDer = 0 // 累积误差导数的初始值为0
  /** 上次更新后累积的导数数量。 */
  numAccumulatedDers = 0 // 累积导数的数量的初始值为0
  regularization: RegularizationFunction // 正则化函数

  /**
   * 构造神经网络中的连接，初始化权重为随机值。
   *
   * @param source 源节点。
   * @param dest 目标节点。
   * @param regularization 计算此权重的正则化函数。如果为null，则不应用正则化。
   * @param initZero 是否将权重初始化为0。
   */
  constructor(source: Node, dest: Node,
    regularization: RegularizationFunction, initZero?: boolean) {
    this.id = source.id + "-" + dest.id
    this.source = source
    this.dest = dest
    this.regularization = regularization
    if (initZero) {
      this.weight = 0
    }
  }
}

/**
 * 构建神经网络。
 *
 * @param networkShape 网络的形状。例如，[1, 2, 3, 1] 表示网络将具有一个输入节点，第一个隐藏层有2个节点，第二个隐藏层有3个节点，输出层有1个节点。
 * @param activation 每个隐藏节点的激活函数。
 * @param outputActivation 输出节点的激活函数。
 * @param regularization 计算网络中给定权重（参数）的正则化函数。如果为 null，则不进行正则化。
 * @param inputIds 输入节点的 id 列表。
 * @param initZero 是否将节点的初始值设置为零。默认为 false。
 */
export function buildNetwork(
  networkShape: number[],
  activation: ActivationFunction,
  outputActivation: ActivationFunction,
  regularization: RegularizationFunction,
  inputIds: string[],
  initZero = false
): Node[][] {
  let numLayers = networkShape.length
  let id = 1
  /** 层级列表，每个层级又是一个节点列表。 */
  let network: Node[][] = []
  for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
    let isOutputLayer = layerIdx === numLayers - 1
    let isInputLayer = layerIdx === 0
    let currentLayer: Node[] = []
    network.push(currentLayer)
    let numNodes = networkShape[layerIdx]
    for (let i = 0; i < numNodes; i++) {
      let nodeId = id.toString()
      if (isInputLayer) {
        nodeId = inputIds[i]
      } else {
        id++
      }
      let node = new Node(nodeId,
        isOutputLayer ? outputActivation : activation, initZero)
      currentLayer.push(node)
      if (layerIdx >= 1) {
        // 从上一层的节点到当前节点添加连接。
        for (let j = 0; j < network[layerIdx - 1].length; j++) {
          let prevNode = network[layerIdx - 1][j]
          let link = new Link(prevNode, node, regularization, initZero)
          prevNode.outputLinks.push(link)
          node.inputLinks.push(link)
        }
      }
    }
  }
  return network
}

/**
 * 通过提供的输入数组对神经网络进行正向传播。该方法修改网络的内部状态，
 * 即网络中每个节点的总输入和输出。
 *
 * @param network 神经网络。
 * @param inputs 输入数组。其长度应与输入层中的节点数匹配。
 * @return 网络的最终输出。
 */
export function forwardProp(network: Node[][], inputs: number[]): number {
  let inputLayer = network[0]
  if (inputs.length !== inputLayer.length) {
    throw new Error("输入数量必须与输入层中节点数量匹配")
  }
  // 更新输入层节点的输出。
  for (let i = 0; i < inputLayer.length; i++) {
    let node = inputLayer[i]
    node.output = inputs[i]
  }
  for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
    let currentLayer = network[layerIdx]
    // 更新该层中的所有节点。
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i]
      node.updateOutput()
    }
  }
  return network[network.length - 1][0].output
}

/**
 * 执行反向传播，使用给定的目标值和之前调用前向传播计算得到的输出。
 * 此方法会修改网络的内部状态 - 每个节点和每个权重的误差导数。
 */
export function backProp(network: Node[][], target: number,
  errorFunc: ErrorFunction): void {
  // 输出节点是一个特殊情况。我们使用用户定义的误差函数计算导数。
  let outputNode = network[network.length - 1][0]
  outputNode.outputDer = errorFunc.der(outputNode.output, target)

  // 从后向前遍历层。
  for (let layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
    let currentLayer = network[layerIdx]
    // 计算每个节点对以下内容的误差导数：
    // 1) 它的总输入
    // 2) 每个输入权重。
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i]
      node.inputDer = node.outputDer * node.activation.der(node.input)
      node.accInputDer += node.inputDer
      node.numAccumulatedDers++
    }

    // 对每个输入进入节点的权重计算误差导数。
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i]
      for (let j = 0; j < node.inputLinks.length; j++) {
        let link = node.inputLinks[j]
        if (link.isDead) {
          continue
        }
        link.errorDer = node.inputDer * link.source.output
        link.accErrorDer += link.errorDer
        link.numAccumulatedDers++
      }
    }
    if (layerIdx === 1) {
      continue
    }
    let prevLayer = network[layerIdx - 1]
    for (let i = 0; i < prevLayer.length; i++) {
      let node = prevLayer[i]
      // 计算每个节点输出的误差导数。
      node.outputDer = 0
      for (let j = 0; j < node.outputLinks.length; j++) {
        let output = node.outputLinks[j]
        node.outputDer += output.weight * output.dest.inputDer
      }
    }
  }
}

/**
 * 使用先前计算得到的误差导数更新网络的权重。
 * 
 * @param network 神经网络的节点表示数组
 * @param learningRate 学习率，控制权重更新的步长
 * @param regularizationRate 正则化率，控制正则化项在权重更新中的影响
 */
export function updateWeights(network: Node[][], learningRate: number,
  regularizationRate: number) {
  for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
    // 遍历每一层
    let currentLayer = network[layerIdx]
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i]
      // 更新节点的偏置值
      if (node.numAccumulatedDers > 0) {
        // 根据误差导数和累积导数次数更新偏置值
        node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers
        // 重置累积导数和累积导数次数
        node.accInputDer = 0
        node.numAccumulatedDers = 0
      }
      // 更新进入该节点的权重
      for (let j = 0; j < node.inputLinks.length; j++) {
        let link = node.inputLinks[j]
        if (link.isDead) {
          continue
        }
        let regulDer = link.regularization ?
          link.regularization.der(link.weight) : 0
        if (link.numAccumulatedDers > 0) {
          // 根据累积误差导数更新权重
          link.weight = link.weight -
            (learningRate / link.numAccumulatedDers) * link.accErrorDer
          // 根据正则化项进一步更新权重
          let newLinkWeight = link.weight -
            (learningRate * regularizationRate) * regulDer
          if (link.regularization === RegularizationFunctions.L1 &&
            link.weight * newLinkWeight < 0) {
            // 权重由于正则化项越过了0，设置为0并标记为无效
            link.weight = 0
            link.isDead = true
          } else {
            link.weight = newLinkWeight
          }
          // 重置累积误差导数和累积导数次数
          link.accErrorDer = 0
          link.numAccumulatedDers = 0
        }
      }
    }
  }
}

/** Iterates over every node in the network/ */
export function forEachNode(network: Node[][], ignoreInputs: boolean,
  accessor: (node: Node) => any) {
  for (let layerIdx = ignoreInputs ? 1 : 0; layerIdx < network.length; layerIdx++) {
    let currentLayer = network[layerIdx]
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i]
      accessor(node)
    }
  }
}

/** Returns the output node in the network. */
export function getOutputNode(network: Node[][]) {
  return network[network.length - 1][0]
}
