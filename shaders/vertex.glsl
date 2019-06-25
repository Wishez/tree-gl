attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_transition;
uniform vec2 u_rotation;
uniform vec2 u_scale;
uniform vec4 u_color;

varying vec4 v_fragColor;
void main() {
  v_fragColor = u_color;

  vec2 scaledPosition = a_position * u_scale;

  vec2 rotationedPosition = vec2(
    scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
  );

  vec2 translatedPosition = rotationedPosition + u_transition;
  vec2 zeroToTwo = (translatedPosition / u_resolution) * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}