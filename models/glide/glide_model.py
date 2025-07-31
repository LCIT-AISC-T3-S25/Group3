from PIL import Image
import torch as th
import os

from glide_text2im.download import load_checkpoint
from glide_text2im.model_creation import (
    create_model_and_diffusion,
    model_and_diffusion_defaults,
    model_and_diffusion_defaults_upsampler
)

has_cuda = th.cuda.is_available()
device = th.device("cuda" if has_cuda else "cpu")

def load_base_model():
    options = model_and_diffusion_defaults()
    options["use_fp16"] = has_cuda
    options["timestep_respacing"] = "100"
    model, diffusion = create_model_and_diffusion(**options)
    model.eval()
    if has_cuda:
        model.convert_to_fp16()
    model.to(device)
    model.load_state_dict(load_checkpoint("base", device))
    return model, diffusion, options

def save_images(batch, path):
    scaled = ((batch + 1) * 127.5).round().clamp(0, 255).to(th.uint8).cpu()
    reshaped = scaled.permute(2, 0, 3, 1).reshape([batch.shape[2], -1, 3])
    img = Image.fromarray(reshaped.numpy())
    img.save(path)

def generate_image(caption: str, output_path: str = "generated_image.png"):
    model, diffusion, options = load_base_model()

    # Tokenize prompt
    tokens = model.tokenizer.encode(caption)
    tokens, mask = model.tokenizer.padded_tokens_and_mask(tokens, options["text_ctx"])
    uncond_tokens, uncond_mask = model.tokenizer.padded_tokens_and_mask([], options["text_ctx"])

    batch_size = 1
    guidance_scale = 3.0
    full_batch_size = batch_size * 2

    model_kwargs = dict(
        tokens=th.tensor([tokens] * batch_size + [uncond_tokens] * batch_size, device=device),
        mask=th.tensor([mask] * batch_size + [uncond_mask] * batch_size, dtype=th.bool, device=device),
    )

    def model_fn(x_t, ts, **kwargs):
        half = x_t[: len(x_t) // 2]
        combined = th.cat([half, half], dim=0)
        model_out = model(combined, ts, **kwargs)
        eps, rest = model_out[:, :3], model_out[:, 3:]
        cond_eps, uncond_eps = th.split(eps, len(eps) // 2, dim=0)
        half_eps = uncond_eps + guidance_scale * (cond_eps - uncond_eps)
        eps = th.cat([half_eps, half_eps], dim=0)
        return th.cat([eps, rest], dim=1)

    model.del_cache()
    samples = diffusion.p_sample_loop(
        model_fn,
        (full_batch_size, 3, options["image_size"], options["image_size"]),
        device=device,
        clip_denoised=True,
        progress=True,
        model_kwargs=model_kwargs,
        cond_fn=None,
    )[:batch_size]
    model.del_cache()

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    save_images(samples, output_path)
    return output_path
