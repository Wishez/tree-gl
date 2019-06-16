attribute vec2 a_position;
attribute vec3 a_color;

uniform vec2 u_resolution;
uniform vec2 u_transition;

varying vec3 v_fragColor;

float zeroToTwoX;
float clipSpaceX;

float clipSpaceY;
float middleCanvasY;

void main() {
  v_fragColor = a_color;

  zeroToTwoX = ((a_position.x + u_transition.x) / u_resolution.x) * 2.0;
  clipSpaceX = zeroToTwoX - 1.0;

  middleCanvasY = u_resolution.y / 2.0;
  clipSpaceY = (middleCanvasY - (a_position.y + u_transition.y)) / middleCanvasY;

  gl_Position = vec4(clipSpaceX, clipSpaceY, 0, 1);
}