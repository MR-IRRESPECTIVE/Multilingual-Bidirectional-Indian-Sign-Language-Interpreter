"""
backend/app/services/atharv_service.py
"""
import os
import csv
import numpy as np
import tensorflow as tf
from typing import Optional, List
from app.services.model_service import ModelStatus, PredictionResult

class AtharvStaticService:
    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.status = ModelStatus.WAITING
        self.label_map: dict = {}
        self.num_classes: int = 42
        self.model_version: str = "atharv_legacy"
        self._load_model()

    def _load_model(self):
        try:
            model_path = os.path.join(self.model_dir, "keypoint_classifier.tflite")
            label_path = os.path.join(self.model_dir, "keypoint_classifier_label.csv")

            if not os.path.exists(model_path) or not os.path.exists(label_path):
                self.status = ModelStatus.WAITING
                return

            self.status = ModelStatus.LOADING

            # Load labels
            with open(label_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                labels = [row[0] for row in reader if len(row) > 0]
            
            self.label_map = {str(i): label for i, label in enumerate(labels)}
            self.num_classes = len(labels)

            # Load TFLite
            from tensorflow.lite.python.interpreter import Interpreter
            self.interpreter = Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()

            self.status = ModelStatus.READY
        except Exception as e:
            print(f"Failed to load Atharv model: {e}")
            self.status = ModelStatus.ERROR

    def is_loaded(self) -> bool:
        return self.status == ModelStatus.READY

    def predict(self, features: List[float]) -> PredictionResult:
        from app.core.exceptions import ModelNotReadyError, PredictionError
        
        if not self.is_loaded():
            raise ModelNotReadyError("Atharv model not loaded.")
        if len(features) != 42:
            raise PredictionError(f"Expected 42 features, got {len(features)}")
            
        try:
            input_data = np.array([features], dtype=np.float32)
            self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
            self.interpreter.invoke()
            output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
            predictions = np.squeeze(output_data)

            best_idx = int(np.argmax(predictions))
            confidence = float(predictions[best_idx])
            label = self.label_map.get(str(best_idx), f"class_{best_idx}")
            sign_id = label.lower().replace(" ", "_").replace("/", "_")

            return PredictionResult(
                class_index=best_idx,
                sign_id=sign_id,
                label=label,
                confidence=confidence,
                probabilities=predictions.tolist()
            )
        except Exception as e:
            raise PredictionError(f"Atharv inference failed: {e}")
