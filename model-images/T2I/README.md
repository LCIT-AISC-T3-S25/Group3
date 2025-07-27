## 🖼️ Text-to-Image Diffusion Using Stable Diffusion

This section demonstrates the use of **Stable Diffusion (v1.4)** for generating images from real-world captions using the Yelp Photos dataset.

### ✅ Highlights:
- 🔁 Implemented a complete **text-to-image generation pipeline** using `diffusers`
- 📥 Sampled **1 caption per class** from preprocessed training metadata
- 🖼️ Generated 4 synthetic images — one each for:
  - `drink`
  - `food`
  - `inside`
  - `outside`
- 💾 Saved outputs and pretrained model pipeline for reproducibility
- 🧪 Ready for **evaluation using FID and Inception Score**

### 🗂️ Artifacts:
| Artifact | Path |
|---------|------|
| ✅ Generated images (4) | [`generated_images.zip`](./generated_images.zip) |
| ✅ Saved SD model | [`t2t_diffusion_model.zip`](./t2t_diffusion_model.zip) |
| ✅ Colab notebook | [`text-to-image-model.ipynb`](./text-to-image-model.ipynb) |

---

### 🚀 Prompts Used:
| Label | Caption |
|-------|---------|
| drink | `Iced Shaken Espresso` |
| food | `It was as good as it looks.` |
| inside | `The rush hour` |
| outside | `Great new place` |

---

### 📌 Evaluation (Coming Soon):
- [ ] Frechet Inception Distance (FID)
- [ ] Inception Score (IS)
- [ ] Class-wise evaluation over 500 real vs. synthetic samples
