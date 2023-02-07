#!/usr/bin/env python3

import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'

import PIL
from PIL import Image, ImageDraw
from authtoken import auth_token

import torch
from torch import autocast

torch.cuda.is_available()

from diffusers import StableDiffusionPipeline, EulerDiscreteScheduler

model_id = "\\stable-diffusion"

scriptpath = str(os.path.realpath(os.path.dirname(__file__)))
promptpath = "\\temp\\tempPrompt.txt";

configpath = '\\stable-diffusion\\configs\\stable-diffusion\\v1-inference.yaml'
modelPath = "\\stable-diffusion\\models\\model.ckpt"
txt2imagepath = "\\stable-diffusion\\scripts\\txt2img.py"
saveimagesName = "\\temp\\testImage.png"
imagepath = scriptpath + saveimagesName;
confpath = scriptpath + configpath;
t2ipath = scriptpath + txt2imagepath;
mdpath = scriptpath + modelPath;
fullpath = scriptpath + promptpath;

canvas = (512, 512)


# scale ration
scale = 5
thumb = canvas[0]/scale, canvas[1]/scale

# rectangles (width, height, left position, top position)
frames = [(50, 50, 5, 5), (60, 60, 100, 50), (100, 100, 205, 120)]

# init canvas
im = Image.new('RGBA', canvas, (205, 205, 205, 255))
draw = ImageDraw.Draw(im)

with open(fullpath) as f:
    contents = f.read()

# make thumbnail
im.thumbnail(thumb)
# save image
im.save(imagepath)

scheduler = EulerDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
pipe = StableDiffusionPipeline.from_pretrained(model_id, scheduler=scheduler, torch_dtype=torch.float16)
pipe = pipe.to("cuda")
im = pipe(contents).images[0]
im.save(imagepath)

# t2ipath --prompt <str(contents)> --ckpt <mdpath> --config <confpath>
