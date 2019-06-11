window.addEventListener('load', () => {
  const gl = new Gl('gl')

  gl.fSetSize(500, 500).fClear()
  let [vertexShaderText, fragmetShaderText] = ['', ''];
  ShaderUtil.domShaderSrc('vertex_shader')
    .then((responseText) => {
      vertexShaderText = responseText
    })
  ShaderUtil.domShaderSrc('fragment_shader')
    .then((responseText) => {
      fragmetShaderText = responseText
    })
})

class Gl {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.gl = this.canvas.getContext('webgl2')

    this.setUpGl()
  }

  setUpGl() {
    const { gl } = this 

    gl.clearColor(1.0, 1.0, 1.0, 1.0)
  }

  fSetSize(width, height) {
    const { canvas } = this
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = width
    canvas.height = height

    this.gl.viewport(0, 0, width, height)

    return this
  }

  fClear() {
    this.gl.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT)
    return this
  }
}