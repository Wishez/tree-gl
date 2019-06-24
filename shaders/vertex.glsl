attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_transition;
uniform vec4 u_color;

varying vec4 v_fragColor;

float translatedXPosition;
float zeroToTwoX;
float clipSpaceX;

float clipSpaceY;
float middleCanvasY;
float translatedYPosition;

void main() {
  v_fragColor = u_color;

  translatedXPosition = a_position.x + u_transition.x;
  zeroToTwoX = (translatedXPosition / u_resolution.x) * 2.0;
  clipSpaceX = zeroToTwoX - 1.0;
 
  middleCanvasY = u_resolution.y / 2.0;
  translatedYPosition = a_position.y + u_transition.y;
  clipSpaceY = (middleCanvasY - translatedYPosition) / middleCanvasY;

  gl_Position = vec4(clipSpaceX, clipSpaceY, 0, 1);
}