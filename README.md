# Multilingual Bidirectional Indian Sign Language Interpreter (ISL)

This repository contains the frontend application and data collection tool for the Multilingual Bidirectional ISL Interpreter.

## 🛠️ Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MR-IRRESPECTIVE/Multilingual-Bidirectional-Indian-Sign-Language-Interpreter.git
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd "Multilingual-Bidirectional-Indian-Sign-Language-Interpreter/frontend"
   # Or simply `cd frontend` if you are already in the project root
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:** 
   Go to [http://localhost:3000/collection](http://localhost:3000/collection) in your web browser.

---

## 🗄️ Where is the Database Stored?

To ensure maximum privacy, **no video or facial data is ever saved or transmitted to a central server**. The tool operates entirely locally.

1. **Local Storage (IndexedDB):** 
   All recorded frames (hand landmark features) are saved directly in your browser's local **IndexedDB**. 
   - This means the data is completely private to the computer you are currently using.
   
2. **Exporting the Data:**
   To share or save your dataset permanently, you must manually export it:
   - Click the **"Export Dataset (JSON)"** button at the bottom of the collection page.
   - This will download a `.json` file containing your recorded samples.
   - You can then store this `.json` file wherever you like (e.g., share it with teammates for merging).

For more detailed information on how the dataset collection works, including signer identities and two-handed signs, please see our [Collection Guide](docs/COLLECTION_GUIDE.md).
