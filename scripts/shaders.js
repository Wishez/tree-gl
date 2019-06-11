class ShaderUtil {
  static domShaderSrc(elementId) {
    const element = document.getElementById(elementId)
    if (!element) {
      console.log(`There is no such element in the DOM with ID: ${elementId}`)
      return null
    }

    const request = new XMLHttpRequest(element.src)
    return new Promise((resolve, reject) => {
      request.onreadystatechange = (event) => {
        const { status, responseText } = event.target
        if (responseText && status === 200) {
          resolve(responseText)
        }
      }

      request.open('GET', element.src)
      request.send()
    })
  }

  static createShader({ gl, src, type }) {
    const shader = gl.createShader(type)
    // TODO find methods of the gl object to reliese how it works
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    this.validateProgramStatus({
      gl,
      program,
      programParameter: 'COMPILE_STATUS',
      errorMessage: 'Error creating shader program.',
    })

    return shader
  }

  static createProgram({ gl, vShader, fShader, doValidate }) {
    const { validateProgramStatus } = this
    const program = gl.createProgram()
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)

    validateProgramStatus({
      gl,
      program,
      programParameter: 'LINK_STATUS',
      errorMessage: 'Error creating shader program.',
    })

    if (doValidate) {
      gl.validateProgram(program)
      validateProgramStatus({
        gl,
        program,
        programParameter: 'VALIDATE_STATUS',
        errorMessage: 'Error valdating program',
      })
    }

    return program
  }

  static validateProgramStatus({ gl, program, programParameter, errorMessage }) {
    if (!gl.getProgramParameter(program, gl[programParameter])) {
      console.error(gl.getProgramInfoLog(prog))
      gl.deleteProgram(program)

      throw new Error(errorMessage)
    }
  }
}
