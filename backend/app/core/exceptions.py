class ModelNotReadyError(Exception):
    pass

class PredictionError(Exception):
    pass

class InvalidFrameDimensionError(ValueError):
    pass

class InvalidFeatureError(ValueError):
    pass
