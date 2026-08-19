import sys
import tensorflow as tf

def main():
    model_path = 'c:/Rohan/Multilingual Bidirectional Indian Sign Language Interprete/research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier.tflite'
    
    try:
        with open(model_path, 'rb') as f:
            data = f.read()
        print(f"File size: {len(data)} bytes")
        
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        print("Model loaded successfully in Python TFLite interpreter.")
        
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        print("\n--- Inputs ---")
        for i in input_details:
            print(f"Name: {i['name']}, Shape: {i['shape']}, Type: {i['dtype']}")
            
        print("\n--- Outputs ---")
        for o in output_details:
            print(f"Name: {o['name']}, Shape: {o['shape']}, Type: {o['dtype']}")
            
        print("\n--- Model Details ---")
        ops = interpreter.get_tensor_details()
        print(f"Total Tensors: {len(ops)}")
        
    except Exception as e:
        print("Error loading model:", e)

if __name__ == '__main__':
    main()
