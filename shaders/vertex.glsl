attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_transition;
uniform vec2 u_rotation;
uniform vec4 u_color;

varying vec4 v_fragColor;
void main() {
  v_fragColor = u_color;

  vec2 rotationedPosition = vec2(
    a_position.x * u_rotation.y + a_position.y * u_rotation.x,
    a_position.y * u_rotation.y - a_position.x * u_rotation.x
  );

  vec2 translatedPosition = rotationedPosition + u_transition;
  vec2 zeroToTwo = (translatedPosition / u_resolution) * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}