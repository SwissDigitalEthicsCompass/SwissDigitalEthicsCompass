Requirements for GenAI

Installation
Docker
https://www.docker.com/products/docker-desktop/

tesseract
https://tesseract-ocr.github.io/tessdoc/Installation.html

poppler
https://pdf2image.readthedocs.io/en/latest/installation.html

Install Ollama
https://ollama.com/download

And pull available models in Ollama:
For example
ollama pull aiden_lu/minicpm-v2.6:Q4_K_M


put in the folder "data_RAG" pdf files

in frontend .env add following line
VITE_API_URL="http://127.0.0.1:8008"

start django with 8008
python manage.py runserver 8008