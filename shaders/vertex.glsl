#version 300 es;

in vec3 a_position;

uniform float uPointSize;

void main(void) {
  gl_PoinSize = uPointSize;
  gl_Position = vec4(a_position_, 1.0);
};