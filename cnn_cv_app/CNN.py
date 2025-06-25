from google.colab import drive
drive.mount('/content/drive')


import os
os.listdir("/content/drive/MyDrive/Colab Notebooks/Processed data")

import os

# Check folder structure
os.listdir("/content/final_processed_data")


from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(rescale=1./255)

train_gen = datagen.flow_from_directory(
    '/content/final_processed_data/train',
    target_size=(128, 128),
    batch_size=16,
    class_mode='categorical'
)

val_gen = datagen.flow_from_directory(
    '/content/final_processed_data/val',
    target_size=(128, 128),
    batch_size=16,
    class_mode='categorical'
)

test_gen = datagen.flow_from_directory(
    '/content/final_processed_data/test',
    target_size=(128, 128),
    batch_size=16,
    class_mode='categorical',
    shuffle=False
)


from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.optimizers import Adam

# Create the CNN model
cnn_model = Sequential()

# Convolution + Pooling Layer 1
cnn_model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)))
cnn_model.add(MaxPooling2D(pool_size=(2, 2)))

# Convolution + Pooling Layer 2
cnn_model.add(Conv2D(64, (3, 3), activation='relu'))
cnn_model.add(MaxPooling2D(pool_size=(2, 2)))

# Convolution + Pooling Layer 3
cnn_model.add(Conv2D(128, (3, 3), activation='relu'))
cnn_model.add(MaxPooling2D(pool_size=(2, 2)))

# Flatten and Dense Layers
cnn_model.add(Flatten())
cnn_model.add(Dense(128, activation='relu'))
cnn_model.add(Dropout(0.5))
cnn_model.add(Dense(5, activation='softmax'))  # 5 classes

# Compile the model
cnn_model.compile(optimizer=Adam(learning_rate=0.0001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])


# Train the CNN model
history = cnn_model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=5
)


import numpy as np
from sklearn.metrics import confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

# Get predictions
Y_pred_probs = cnn_model.predict(test_gen)
Y_pred = np.argmax(Y_pred_probs, axis=1)
Y_true = test_gen.classes

# Confusion Matrix
cm = confusion_matrix(Y_true, Y_pred)
plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("True")
plt.show()

# Classification Report
print(classification_report(Y_true, Y_pred, target_names=test_gen.class_indices.keys()))

from sklearn.metrics import roc_curve, auc
from itertools import cycle
import matplotlib.pyplot as plt
import numpy as np

n_classes = 5
Y_true_bin = label_binarize(Y_true, classes=[0, 1, 2, 3, 4])

# Compute ROC curve and AUC for each class
fpr = dict()
tpr = dict()
roc_auc = dict()
for i in range(n_classes):
    fpr[i], tpr[i], _ = roc_curve(Y_true_bin[:, i], Y_pred_probs[:, i])
    roc_auc[i] = auc(fpr[i], tpr[i])

# Plot
plt.figure(figsize=(7, 5))
colors = cycle(['blue', 'red', 'green', 'orange', 'purple'])
class_names = list(test_gen.class_indices.keys())

for i, color in zip(range(n_classes), colors):
    plt.plot(fpr[i], tpr[i], color=color, lw=2,
             label=f'Class {class_names[i]} (AUC = {roc_auc[i]:.2f})')

plt.plot([0, 1], [0, 1], 'k--', lw=2)
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Multiclass ROC-AUC Curve')
plt.legend(loc="lower right")
plt.grid(True)
plt.show()


loss, acc = cnn_model.evaluate(test_gen)
print(f"Test Accuracy: {acc:.4f}")

