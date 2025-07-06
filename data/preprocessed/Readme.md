## Git LFS Setup

Because our `X_train.csv` file is large (>100 MB), it’s stored in Git LFS. Before you run any model code, make sure to install and pull the LFS objects:

```bash
# 1) Install & initialize Git LFS (once per machine)
a) MacOS
brew install git-lfs
git lfs install

b) Windows (Chocolatey)
choco install git-lfs
git lfs install

c) Windows (Installer)
i. Download and run the Windows installer from https://git-lfs.github.com
ii. In your terminal (e.g. Git Bash or PowerShell): git lfs install

# 2) Clone the repo (if you haven’t already)
git clone https://github.com/LCIT-AISC-T3-S25/Group3.git
cd Group3

# 3) Fetch the large files via LFS
git lfs pull               # downloads X_train.csv into data_preprocessing/
```

You only need to run ```git lfs install``` once; after that a simple ```git pull``` will keep your large files in sync.

## Starter Code for Model usage
#### (Boiler Plate with csv imports and label encoder mapping to it with a Logistic Regression Example)

```
import pandas as pd
import pickle
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression 
from sklearn.metrics import classification_report

# 1) Load features
X_train = pd.read_csv("data_preprocessing/X_train.csv")
X_val   = pd.read_csv("data_preprocessing/X_val.csv")
X_test  = pd.read_csv("data_preprocessing/X_test.csv")

# 2) Load raw labels
y_train_raw = pd.read_csv("data_preprocessing/y_train.csv")["sentiment"]
y_val_raw   = pd.read_csv("data_preprocessing/y_val.csv")["sentiment"]
y_test_raw  = pd.read_csv("data_preprocessing/y_test.csv")["sentiment"]

# 3) Load the LabelEncoder
with open("data_preprocessing/label_encoder.pkl", "rb") as f:
    le = pickle.load(f)

# 4) Transform to numeric
y_train = le.transform(y_train_raw)
y_val   = le.transform(y_val_raw)
y_test  = le.transform(y_test_raw)

# 5) Quick sanity check
print("Classes:", le.classes_)
print("Train counts:", pd.Series(y_train).value_counts().to_dict())

# 6) Baseline pipeline: TF–IDF + weighted logistic regression (use your model)
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=500)),
    ("clf", LogisticRegression(
        class_weight="balanced", max_iter=1000, random_state=42
    ))
])

# 7) Train & evaluate
pipeline.fit(X_train["clean_tweet"], y_train)
y_pred = pipeline.predict(X_val["clean_tweet"])
print("Validation report:\n", classification_report(y_val, y_pred, target_names=le.classes_))
```
