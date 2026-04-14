import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import numpy as np

def build_and_save_model():
    print("Initializing MobileNetV2 Base Model...")
    # We use MobileNetV2 for memory-efficient transfer learning
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze base model weights so we don't destroy pre-trained features
    base_model.trainable = False
    
    # Add custom heads for Pneumonia detection (Binary Classification)
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    # Sigmoid output: 0.0 -> Normal, 1.0 -> High Pneumonia likelihood
    predictions = Dense(1, activation='sigmoid')(x) 
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    print("Mock Training on synthetic data to initialize weights...")
    print("NOTE: In a production environment, this is where we'd feed the Kaggle Chest X-Ray dataset via tf.data.Dataset.")
    # Generate a single tiny batch of random image data just to initialize model input signatures and weights
    dummy_x = np.random.rand(2, 224, 224, 3).astype('float32')
    dummy_y = np.array([0, 1])
    
    model.fit(dummy_x, dummy_y, epochs=1, verbose=0)
    
    # Ensure models directory exists
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save the model
    model_path = os.path.join(models_dir, 'pneumonia_cnn.h5')
    print(f"Saving model to {model_path}...")
    model.save(model_path)
    
    print("Success! Pneumonia Detection Model is ready.")

if __name__ == "__main__":
    build_and_save_model()
