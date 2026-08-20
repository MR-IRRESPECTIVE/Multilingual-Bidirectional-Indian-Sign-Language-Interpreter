class ISLAPIError(Exception):
    pass

class ModelNotReadyError(ISLAPIError):
    pass

class PredictionError(ISLAPIError):
    pass

class InvalidFrameDimensionError(ValueError):
    pass

class InvalidFeatureError(ValueError):
    pass

class EmptyInputError(ValueError):
    pass

class ModelMetadataMismatchError(ISLAPIError):
    pass

class LowConfidenceError(ISLAPIError):
    pass

class SignNotFoundError(ISLAPIError):
    pass