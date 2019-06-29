attribute vec4 a_position;
attribute vec3 a_color;

uniform mat4 u_matrix;

varying vec4 v_fragColor;
void main() {
  v_fragColor = vec4(a_color, 1);

  gl_Position = u_matrix * a_position;
}
