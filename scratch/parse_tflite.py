import sys
import tflite

def builtin_code_to_name(code):
    for key, val in tflite.BuiltinOperator.__dict__.items():
        if val == code and not key.startswith('__'):
            return key
    return str(code)

def main():
    model_path = 'c:/Rohan/Multilingual Bidirectional Indian Sign Language Interprete/research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier.tflite'
    with open(model_path, 'rb') as f:
        buf = f.read()
    
    model = tflite.Model.GetRootAsModel(buf, 0)
    print("Model Version:", model.Version())
    
    opcodes_len = model.OperatorCodesLength()
    print("Operator Codes Count:", opcodes_len)
    for i in range(opcodes_len):
        opcode = model.OperatorCodes(i)
        code = opcode.BuiltinCode()
        version = opcode.Version()
        name = builtin_code_to_name(code)
        if code == tflite.BuiltinOperator.CUSTOM:
            name = opcode.CustomCode().decode('utf-8')
        print(f"  Op {i}: {name} (Version {version})")
        
    subgraphs_len = model.SubgraphsLength()
    print("Subgraphs Count:", subgraphs_len)
    for i in range(subgraphs_len):
        subgraph = model.Subgraphs(i)
        print(f"\n--- Subgraph {i} ---")
        
        inputs = subgraph.InputsAsNumpy()
        outputs = subgraph.OutputsAsNumpy()
        print("Inputs Tensors:", inputs)
        print("Outputs Tensors:", outputs)
        
        for idx in inputs:
            tensor = subgraph.Tensors(idx)
            shape = tensor.ShapeAsNumpy()
            print(f"  Input Tensor {idx}: Shape {shape}, Type {tensor.Type()}")
            
        for idx in outputs:
            tensor = subgraph.Tensors(idx)
            shape = tensor.ShapeAsNumpy()
            print(f"  Output Tensor {idx}: Shape {shape}, Type {tensor.Type()}")

if __name__ == '__main__':
    main()
