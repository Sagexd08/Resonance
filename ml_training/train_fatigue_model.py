"""
Train fatigue detection model using ResNet transfer learning.
Dataset: Driver drowsiness dataset
"""
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms, models
from PIL import Image
import os
from pathlib import Path
from tqdm import tqdm
import config
from sklearn.metrics import f1_score, confusion_matrix, classification_report
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

class DrowsinessDataset(Dataset):
    """Dataset loader for driver drowsiness images."""
    
    def __init__(self, data_dir, transform=None):
        self.data_dir = Path(data_dir)
        self.transform = transform
        self.samples = []
        
                                              
                                                 
        alert_dir = self.data_dir / "alert"
        drowsy_dir = self.data_dir / "drowsy"
        
        if alert_dir.exists() and drowsy_dir.exists():
                                            
            for img_path in alert_dir.glob("*.jpg"):
                self.samples.append((str(img_path), 0))             
            for img_path in alert_dir.glob("*.png"):
                self.samples.append((str(img_path), 0))
            for img_path in drowsy_dir.glob("*.jpg"):
                self.samples.append((str(img_path), 1))              
            for img_path in drowsy_dir.glob("*.png"):
                self.samples.append((str(img_path), 1))
        else:
                                                  
            for subdir in self.data_dir.iterdir():
                if subdir.is_dir():
                    label = 1 if "drowsy" in subdir.name.lower() or "sleep" in subdir.name.lower() else 0
                    for img_path in subdir.glob("*.jpg"):
                        self.samples.append((str(img_path), label))
                    for img_path in subdir.glob("*.png"):
                        self.samples.append((str(img_path), label))
        
        if len(self.samples) == 0:
            raise ValueError(f"No images found in {data_dir}")
        
        print(f"Found {len(self.samples)} images")
        print(f"  Alert: {sum(1 for _, label in self.samples if label == 0)}")
        print(f"  Drowsy: {sum(1 for _, label in self.samples if label == 1)}")
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = Image.open(img_path).convert("RGB")
        
        if self.transform:
            image = self.transform(image)
        
        return image, label

def create_model(num_classes=2):
    """Create ResNet model with transfer learning."""
                               
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    
                         
    for param in list(model.parameters())[:-10]:                                 
        param.requires_grad = False
    
                         
    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(config.FATIGUE_CONFIG["dropout"]),
        nn.Linear(num_features, num_classes)
    )
    
    return model

def train_epoch(model, dataloader, criterion, optimizer, device):
    """Train for one epoch."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    for images, labels in tqdm(dataloader, desc="Training"):
        images = images.to(device)
        labels = labels.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
    
    epoch_loss = running_loss / len(dataloader)
    epoch_acc = 100 * correct / total
    return epoch_loss, epoch_acc

def validate(model, dataloader, criterion, device, return_predictions=False):
    """Validate model."""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_labels = []
    
    with torch.no_grad():
        for images, labels in tqdm(dataloader, desc="Validating"):
            images = images.to(device)
            labels = labels.to(device)
            
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    epoch_loss = running_loss / len(dataloader)
    epoch_acc = 100 * correct / total
    
    if return_predictions:
        return epoch_loss, epoch_acc, all_preds, all_labels
    return epoch_loss, epoch_acc

def main():
    """Main training function."""
    print("="*60)
    print("Training Fatigue Detection Model (ResNet)")
    print("="*60)
    
           
    device = torch.device(config.DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
                     
    train_transform = transforms.Compose([
        transforms.Resize(config.FATIGUE_CONFIG["input_size"]),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize(config.FATIGUE_CONFIG["input_size"]),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
                  
    print(f"\nLoading dataset from {config.DROWSINESS_DATA_DIR}")
    full_dataset = DrowsinessDataset(config.DROWSINESS_DATA_DIR, transform=train_transform)
    
                   
    train_size = int(config.FATIGUE_CONFIG["train_split"] * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
                                 
    val_dataset.dataset.transform = val_transform
    
    train_loader = DataLoader(train_dataset, batch_size=config.FATIGUE_CONFIG["batch_size"], shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=config.FATIGUE_CONFIG["batch_size"], shuffle=False, num_workers=2)
    
                  
    print("\nCreating ResNet model...")
    model = create_model(num_classes=config.FATIGUE_CONFIG["num_classes"])
    model = model.to(device)
    
                        
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=config.FATIGUE_CONFIG["learning_rate"],
        weight_decay=config.FATIGUE_CONFIG["weight_decay"]
    )
    
                   
    best_val_loss = float('inf')
    patience_counter = 0
    
    print("\nStarting training...")
    for epoch in range(config.FATIGUE_CONFIG["num_epochs"]):
        print(f"\nEpoch {epoch+1}/{config.FATIGUE_CONFIG['num_epochs']}")
        
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = validate(model, val_loader, criterion, device)
        
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
                        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
                             
            config.MODELS_DIR.mkdir(parents=True, exist_ok=True)
            torch.save(model.state_dict(), config.FATIGUE_MODEL_PATH)
            print(f"✓ Saved best model (val_loss: {val_loss:.4f})")
        else:
            patience_counter += 1
            if patience_counter >= config.FATIGUE_CONFIG["early_stopping_patience"]:
                print(f"Early stopping triggered after {epoch+1} epochs")
                break
    
                                   
    print(f"\n{'='*60}")
    print("Final Evaluation on Validation Set")
    print(f"{'='*60}")
    
    val_loss, val_acc, val_preds, val_labels = validate(model, val_loader, criterion, device, return_predictions=True)
    
                        
    f1 = f1_score(val_labels, val_preds, average='weighted')
    f1_macro = f1_score(val_labels, val_preds, average='macro')
    f1_per_class = f1_score(val_labels, val_preds, average=None)
    
                      
    cm = confusion_matrix(val_labels, val_preds)
    
    print(f"\nValidation Accuracy: {val_acc:.2f}%")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Macro F1 Score: {f1_macro:.4f}")
    print(f"\nPer-class F1 Scores:")
    for i, score in enumerate(f1_per_class):
        class_name = "Alert" if i == 0 else "Drowsy"
        print(f"  {class_name}: {score:.4f}")
    
    print(f"\nConfusion Matrix:")
    print(cm)
    
                                
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Alert', 'Drowsy'],
                yticklabels=['Alert', 'Drowsy'])
    plt.title('Fatigue Detection Model - Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    cm_path = config.MODELS_DIR / "fatigue_confusion_matrix.png"
    plt.savefig(cm_path)
    print(f"\nConfusion matrix saved to: {cm_path}")
    
                           
    print(f"\nClassification Report:")
    print(classification_report(val_labels, val_preds, target_names=['Alert', 'Drowsy']))
    
    print(f"\n{'='*60}")
    print("Training complete!")
    print(f"Best validation loss: {best_val_loss:.4f}")
    print(f"Final Validation Accuracy: {val_acc:.2f}%")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Model saved to: {config.FATIGUE_MODEL_PATH}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
