from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import json,subprocess,cairosvg
from PIL import Image,ImageChops,ImageStat
ROOT=Path(__file__).resolve().parents[1]/'public/assets/hrudhi';OUT=ROOT/'videos';OUT.mkdir(exist_ok=True)
def raster(p):
 cairosvg.svg2png(url=str(p),write_to=str(p.with_suffix('.png')),unsafe=True)
 return 1
if __name__=='__main__':
 jobs=json.loads((ROOT/'.video-jobs.json').read_text());source_manifest=json.loads((OUT/'source-manifest.json').read_text());paths=[p for video in jobs['videos'] for p in (ROOT/'.video-frames'/video['id']).glob('*.svg') if p.stem=='original-alpha' or not p.stem.endswith('-alpha')]
 with ProcessPoolExecutor(max_workers=6) as ex:
  for i,_ in enumerate(ex.map(raster,paths)):
   if (i+1)%400==0:print('Original-art film frames:',i+1,flush=True)
 for video in jobs['videos']:
  source=ROOT/'.video-frames'/video['id'];output=OUT/video['id'];fps=jobs['fps'];record=next(f for f in source_manifest['films'] if f['id']==video['id']);box=tuple(record['identityCheckRect']);expected=Image.open(source/'identity-reference.png').convert('RGB').crop(box);assert expected.convert('L').getextrema()[0]<100,'Original image was not loaded'
  for frame in [0,int(video['duration']*fps*.5),video['duration']*fps-1]:assert ImageChops.difference(expected,Image.open(source/f'{frame:04}.png').convert('RGB').crop(box)).getbbox() is None,'Character pixels changed in scene'
  subprocess.run(['ffmpeg','-loglevel','error','-y','-framerate',str(fps),'-i',str(source/'%04d.png'),'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(output.with_suffix('.mp4'))],check=True)
  subprocess.run(['ffmpeg','-loglevel','error','-y','-loop','1','-framerate',str(fps),'-i',str(source/'original-alpha.png'),'-t',str(video['duration']),'-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','25','-b:v','0',str(output.parent/(output.name+'-alpha.webm'))],check=True)
  from shutil import copyfile
  copyfile(source/f'{int(video["duration"]*fps*.37):04}.png',output.parent/(output.name+'-poster.png'))
  output.with_suffix('.vtt').write_text('WEBVTT\n\n00:00:00.000 --> 00:00:'+f'{video["duration"]:02}.000\n'+video['description']+'\n')
  print('Encoded and identity-checked',video['id'],flush=True)
