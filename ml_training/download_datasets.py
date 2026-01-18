"""
Download Kaggle datasets for ML model training.
Requires Kaggle API credentials in ~/.kaggle/kaggle.json
"""
import os
import zipfile
import kaggle
from pathlib import Path

                        
DATASETS = [
    {
        "name": "redwankarimsony/hackerearth-employee-burnout-challenge",
        "target_dir": "data/burnout",
        "description": "Employee burnout challenge dataset"
    },
    {
        "name": "uwrfkaggler/ravdess-emotional-speech-audio",
        "target_dir": "data/ravdess",
        "description": "RAVDESS emotional speech audio dataset"
    },
    {
        "name": "ismailnasri20/driver-drowsiness-dataset-ddd",
        "target_dir": "data/drowsiness",
        "description": "Driver drowsiness dataset"
    }
]

def download_and_extract(dataset_name: str, target_dir: str):
    """Download and extract a Kaggle dataset."""
    print(f"\n{'='*60}")
    print(f"Downloading: {dataset_name}")
    print(f"Target directory: {target_dir}")
    print(f"{'='*60}")
    
                             
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)
    
                      
    try:
        kaggle.api.dataset_download_files(
            dataset_name,
            path=str(target_path),
            unzip=True
        )
        print(f"[OK] Successfully downloaded and extracted to {target_dir}")
        return True
    except Exception as e:
        print(f"[ERROR] Error downloading {dataset_name}: {e}")
        return False

def main():
    """Main function to download all datasets."""
    print("Starting dataset download process...")
    print(f"Working directory: {os.getcwd()}")
    
                               
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_json = kaggle_dir / "kaggle.json"
    
    if not kaggle_json.exists():
        print("[ERROR] Kaggle credentials not found at ~/.kaggle/kaggle.json")
        print("Please set up Kaggle API credentials first.")
        return
    
    print(f"[OK] Found Kaggle credentials at {kaggle_json}")
    
                           
    success_count = 0
    for dataset in DATASETS:
        if download_and_extract(dataset["name"], dataset["target_dir"]):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"Download complete: {success_count}/{len(DATASETS)} datasets downloaded successfully")
    print(f"{'='*60}")
    
    if success_count == len(DATASETS):
        print("\n[OK] All datasets downloaded successfully!")
        print("\nNext steps:")
        print("1. Run train_fatigue_model.py")
        print("2. Run train_voice_model.py")
        print("3. Run train_burnout_model.py")
    else:
        print("\n⚠ Some datasets failed to download. Please check errors above.")

if __name__ == "__main__":
    main()
