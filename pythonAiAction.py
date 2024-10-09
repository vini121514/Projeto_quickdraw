
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import json
import time

# Load the pre-trained model
model = tf.keras.models.load_model('model4 copy.h5', compile = False)

def predict_image(image, model):
    """Preprocess the image and make a prediction using the model."""
    img_resized = cv2.resize(image, (150, 150))  # Resize image to match model input
    img_array = img_to_array(img_resized) / 255.0  # Convert image to array and normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    predictions = model.predict(img_array)  # Get predictions (array of probabilities)
    
    # Get the index of the class with the highest probability
    predicted_class = np.argmax(predictions[0])
    
    # Get the confidence (probability) of the predicted class
    confidence = predictions[0][predicted_class]
    
    return img_resized, predicted_class, confidence


def get_class_name(class_id):
    """Convert the class ID to the corresponding class name."""
    subjects = [
    'axe',
    'knife',

#    'helicopter',
#    'airplane',

    'apple',
    'banana',

    'cake'
]
    
    class_names = {}
    for i in range(len(subjects)):
        class_names[i] = subjects[i]
        
    return class_names.get(class_id, 'Desconhecido')

def save_results_to_json(predicted_class, predicted_class_name, confidence):
    """Save the results to a JSON file."""
    results = {
        'predicted class number': float(predicted_class),  # Save the class number
        'predicted class name': predicted_class_name,
        'confidence': float(confidence)
    }
    
    with open('answer.json', 'w') as f:
        json.dump(results, f, indent=4)

def main():
    # Load the image from the 'images' folder
    image_path = 'images/image.png'
    image = cv2.imread(image_path)

    # Check if the image was loaded successfully
    if image is None:
        print('Invalid image format or unable to read image.')
        return

    # Predict the image
    resized_image, predicted_class, confidence = predict_image(image, model)
    
    # Save the resized image
    cv2.imwrite('imagemanalisada.png', resized_image)

    # Convert the predicted class ID to name
    predicted_class_name = get_class_name(predicted_class)

    # Print the predicted class and confidence
    print(f'Predicted class: {predicted_class_name}, {predicted_class}')
    print(f'Confidence: {confidence:.4f}')

    # Save the results to a JSON file
    save_results_to_json(predicted_class, predicted_class_name, confidence)

if __name__ == '__main__':
    while True:
        time.sleep(0.5)
        main()
