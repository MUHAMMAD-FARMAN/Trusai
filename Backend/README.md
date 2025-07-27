# EmotiNet

**EmotiNet** is a novel deep learning architecture designed for **emotion classification** from images.  
It uses **SE blocks** (Squeeze-and-Excitation) and **Residual Blocks** to improve feature extraction and classification performance.

## Features
- **Squeeze-and-Excitation Blocks** for channel attention.
- **Residual Connections** for improved gradient flow.
- **Dropout Regularization** to prevent overfitting.
- **Adaptive Average Pooling** for better handling of variable input sizes.
- **Emotion Classification** into 7 classes.

## Model Architecture
- 3 Convolutional layers with BatchNorm and MaxPooling
- Squeeze-and-Excitation after early convolutions
- Stack of Residual Blocks (with increasing feature maps)
- Fully connected layers with Dropouts
- Final output layer with 7 classes
