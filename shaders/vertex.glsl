attribute vec2 a_position;
attribute vec3 a_vertexColor;

uniform vec2 u_resolution;
varying vec3 v_fragColor;

float zeroToTwoX;
float clipSpaceX;

float clipSpaceY;
float middleCanvasY;

void main() {
  v_fragColor = a_vertexColor;

  zeroToTwoX = (a_position.x / u_resolution.x) * 2.0;
  clipSpaceX = zeroToTwoX - 1.0;

  middleCanvasY = u_resolution.y / 2.0;
  clipSpaceY = (middleCanvasY - a_position.y) / middleCanvasY;

  gl_Position = vec4(clipSpaceX, clipSpaceY, 0, 1);
}