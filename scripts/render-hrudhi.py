"""Technical exports from the editable SVG rig; never modifies concept artwork."""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
from io import BytesIO
import json,re,os
import cairosvg
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'public/assets/hrudhi'
def raster(path,scale=1):
 s=path.read_text();s=re.sub(r'transform-origin:[^;]+;transform:[^;]+;','',s)
 return Image.open(BytesIO(cairosvg.svg2png(bytestring=s.encode(),scale=scale))).convert('RGBA')
def static(path):
 image=raster(path,2);image.save(path.with_suffix('.png'));return 1
def motion(job):
 name=job['name'];images=[raster(ROOT/'.frames'/name/f'{i:02}.svg') for i in range(job['frames'])]
 durations=[round(job['duration']*(i+1)/len(images))-round(job['duration']*i/len(images)) for i in range(len(images))]
 previews=[im.resize((192,312),Image.Resampling.LANCZOS) for im in images]
 previews[0].save(ROOT/'motion'/f'{name}.webp',save_all=True,append_images=previews[1:],duration=durations,loop=1,lossless=False,quality=88,method=4)
 images[len(images)//2].save(ROOT/'poses'/f'{name}.png')
 return name
if __name__=='__main__':
 (ROOT/'poses').mkdir(exist_ok=True)
 paths=[p for folder in ['rigs','turnarounds','expressions','mouths'] for p in (ROOT/folder).glob('*.svg')]
 with ProcessPoolExecutor(max_workers=6) as ex:
  print('Static PNG exports:',sum(ex.map(static,paths)),flush=True)
  for i,name in enumerate(ex.map(motion,json.loads((ROOT/'.animation-jobs.json').read_text()))):
   if (i+1)%15==0:print('Motion exports:',i+1,flush=True)
