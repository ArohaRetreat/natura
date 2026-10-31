from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
from io import BytesIO
import json,cairosvg
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'public/assets/farm-atlas'
def icon(p):
 for size in [128,256]:
  out=ROOT/'png'/p.parent.name/str(size)/(p.stem+'.png');out.parent.mkdir(parents=True,exist_ok=True);cairosvg.svg2png(url=str(p),write_to=str(out),output_width=size,output_height=size)
 return 1
def animal(d):
 name=d['id'];cairosvg.svg2png(url=str(ROOT/'animals'/f'{name}.svg'),write_to=str(ROOT/'animals'/f'{name}.png'),scale=2)
 frames=[Image.open(BytesIO(cairosvg.svg2png(url=str(ROOT/'.frames'/name/f'{i:02}.svg')))).convert('RGBA') for i in range(36)]
 frames[0].save(ROOT/'animals'/f'{name}-motion.webp',save_all=True,append_images=frames[1:],loop=1,duration=round(d['duration']/36),quality=88,method=4)
 return 1
if __name__=='__main__':
 with ProcessPoolExecutor(max_workers=6) as ex:
  print('Icon sources rendered:',sum(ex.map(icon,(ROOT/'icons').rglob('*.svg'))),flush=True)
  animals=json.loads((ROOT/'catalogue.json').read_text())['animals'];print('Animated animal exports:',sum(ex.map(animal,animals)),flush=True)
