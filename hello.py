import tensorflow as tf

# Simple hello world using TensorFlow
hello = tf.constant("Hello, TensorFlow!")

# Print the tensor value
print(hello.numpy().decode("utf-8"))