attribute vec2 a_position;

uniform mat3 u_matrix;
uniform vec4 u_color;

varying vec4 v_fragColor;
void main() {
  v_fragColor = u_color;

  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
}
