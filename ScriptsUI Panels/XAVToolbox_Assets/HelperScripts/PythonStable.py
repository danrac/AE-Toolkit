#!/usr/bin/env python3

import os
from PIL import ImageTk
from authtoken import auth_token

import torch
from torch import autocast
from diffusers import StableDiffusionPipeline

scriptpath = str(os.path.realpath(os.path.dirname(__file__)))
promptpath = "/temp/tempPrompt.txt";

configpath = '/stableDiffusion/configs/stable-diffusion/v2-midas-inference.yaml'
modelPath = "/stableDiffusion/models/512-base-ema.ckpt"
txt2imagepath = "/stableDiffusion/scripts/txt2img.py"
saveimagesName = "/testImage.jpg"
imagepath = scriptpath + saveimagesName;
confpath = scriptpath + configpath;
t2ipath = scriptpath + txt2imagepath;
mdpath = scriptpath + modelPath;
fullpath = scriptpath + promptpath;


# print(fullpath)

with open(fullpath) as f:
    contents = f.read()
    print(contents)

device = 'cuda'

# mdpath --prompt 'horse in space' --init-img imagepath --strength 0.8 --ckpt modelPath --config confpath --H 512 --W 512 --plms --n_samples 1

pipe = StableDiffusionPipeline.from_pretrained(mdpath, revision='fp16', torch_dtype=torch.float16, use_auth_token=auth_token)
pipe.to(device);

def generate():
	with autocast(device):
			image = pipe(contents.get(), guidance_scale=8.5)['sample'][0]
			image.save('tempImage.png')
			img = ImageTk.PhotoImage(image)
			
generate()