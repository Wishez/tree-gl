const FIRST = 'first'
const SECOND = 'second'
const THIRD = 'third'
const FOURTH = 'fourth'

class Util {
  static domShaderSrc(url) {
    const request = new XMLHttpRequest(url)
    return new Promise((resolve, reject) => {
      request.onreadystatechange = (event) => {
        const { status, responseText } = event.target
        if (responseText && status === 200) resolve(responseText)
        if ([404, 500].some(code => code === status)) reject(`Error: HTTP status - ${status} on resource ${url}`)
      }

      request.open('GET', url)
      request.send()
    })
  }

  static m3 = (function() {
    const that = { 
      projection: (width, height) => ([
        2 / width, 0, 0,
        0, -2 / height, 0,
        -1, 1, 1,
      ]),

      identity: () => ([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ]),

      rotation: (angleInRadians) => {
        const s = Math.sin(angleInRadians)
        const c = Math.cos(angleInRadians)
        return [
          c, -s, 0,
          s, c, 0,
          0, 0, 1,
        ]
      },

      transition: (x, y) => ([
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
      ]),

      scaling: (x, y) => ([
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
      ]),

      multiply: (a, b) => {
        const [firstX, firstY, firstZ] = get2DMatrixRow(a, 0)
        const [secondX, secondY, secondZ] = get2DMatrixRow(a, 1)
        const [thirdX, thirdY, thirdZ] = get2DMatrixRow(a, 2)
        const multipliedMatrix = []
        for (let i = 0; i < 3; i++) {
          const [x, y, z] = get2DMatrixRow(b, i)
          multipliedMatrix.push(
            x * firstX + y * firstY + z * firstZ,
            x * secondX + y * secondY + z * secondZ,
            x * thirdX + y * thirdY + z * thirdZ,
          )
        }
        return multipliedMatrix
      },

      translate: (matrix, x, y) => that.multiply(matrix, that.transition(x, y)),

      rotate: (matrix, angleInRadians) => that.multiply(matrix, that.rotation(angleInRadians)),

      scale: (matrix, x, y) => that.multiply(matrix, that.scaling(x, y)),
    }
    return that
  }())

  static m4 = (function() {
    const that = { 
      projection: (width, height, depth) => ([
        2 / width, 0, 0, 1,
        0, -2 / height, 0, 1,
        0, 0, 2 / depth, 1,
        -1, 1, 1, 1,
      ]),

      identity: () => ([
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 1, 1, 1,
      ]),

      rotationX: (angleInRadians) => {
        const s = Math.sin(angleInRadians)
        const c = Math.cos(angleInRadians)
        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ]
      },

      rotationY: (angleInRadians) => {
        const s = Math.sin(angleInRadians)
        const c = Math.cos(angleInRadians)
        return [
          c, 0, -s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1,
        ]
      },

      rotationZ: (angleInRadians) => {
        const s = Math.sin(angleInRadians)
        const c = Math.cos(angleInRadians)
        return [
          c, s, 0, 0,
          -s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ]
      },

      transition: (x, y, z) => ([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
      ]),

      scaling: (x, y, z) => ([
        x, 0, 0, 0,
        0, y, 0, 0, 
        0, 0, z, 0,
        0, 0, 0, 1,
      ]),

      multiply: (a, b) => {
        const [firstX, firstY, firstZ, firstW] = get3DMatrixRow(a, 0)
        const [secondX, secondY, secondZ, secondW] = get3DMatrixRow(a, 1)
        const [thirdX, thirdY, thirdZ, thirdW] = get3DMatrixRow(a, 2)
        const [fourthX, fourthY, fourthZ, fourthW] = get3DMatrixRow(a, 3)
        const multipliedMatrix = []
        for (let i = 0; i < 4; i++) {
          const [x, y, z, w] = get3DMatrixRow(b, i)
          multipliedMatrix.push(
            x * firstX + y * firstY + z * firstZ + w * firstW,
            x * secondX + y * secondY + z * secondZ + w * secondW,
            x * thirdX + y * thirdY + z * thirdZ + w * thirdW,
            x * fourthX + y * fourthY + z * fourthZ + w * fourthW,
          )
        }
        return multipliedMatrix
      },

      translate: (matrix, x, y, z) => that.multiply(matrix, that.transition(x, y, z)),

      scale: (matrix, x, y, z) => that.multiply(matrix, that.scaling(x, y, z)),

      rotateX: (matrix, angleInRadians) => that.multiply(matrix, that.rotationX(angleInRadians)),

      rotateY: (matrix, angleInRadians) => that.multiply(matrix, that.rotationY(angleInRadians)),

      rotateZ: (matrix, angleInRadians) => that.multiply(matrix, that.rotationZ(angleInRadians)),
    }
  }())
}

function get2DMatrixRow(matrix, row) {
  return [matrix[row * 3 + 0], matrix[row * 3 + 1], matrix[row * 3 + 2]]
}

function get3DMatrixRow(matrix, row) {
  return [matrix[row * 4 + 0], matrix[row * 4 + 1], matrix[row * 4 + 2], matrix[row * 4 + 3]]
}