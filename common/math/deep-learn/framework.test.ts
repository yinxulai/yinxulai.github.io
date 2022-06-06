describe('Neuron', () => {
  test('default', () => {
    const neuron = new Neuron()
    expect(neuron).toBe(neuron)
  })
})

describe('NeuronLayer', () => {
  test('default', () => {
    const neuron = new NeuronLayer()
    expect(neuron).toBe(neuron)
  })
})

describe('NeuronLink', () => {
  test('default', () => {
    const neuron = new NeuronLink()
    expect(neuron).toBe(neuron)
  })
})

describe('NeuronNetwork', () => {
  test('default', () => {
    const neuron = new NeuronNetwork((v) => v)
    expect(neuron).toBe(neuron)
  })
})
