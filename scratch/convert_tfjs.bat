@echo off
set "VENV_DIR=c:\Rohan\Multilingual Bidirectional Indian Sign Language Interprete\scratch\venv312"
call "%VENV_DIR%\Scripts\activate.bat"
tensorflowjs_converter --input_format keras "c:\Rohan\Multilingual Bidirectional Indian Sign Language Interprete\research\repository-audit\Bidirectional-Indian-Sign-Language-Translator\Indian-Sign-Language-to-Text\model\keypoint_classifier\keypoint_classifier_0.hdf5" "c:\Rohan\Multilingual Bidirectional Indian Sign Language Interprete\poc\models\research-baseline\tfjs"
