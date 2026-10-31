from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import json,re,subprocess,cairosvg
ROOT=Path(__file__).resolve().parents[1]/'public/assets/hrudhi'
OUT=ROOT/'videos';OUT.mkdir(exist_ok=True)
def raster(job):
 p=Path(job);s=p.read_text();s=re.sub(r'transform-origin:[^;]+;transform:[^;]+;','',s)
 cairosvg.svg2png(bytestring=s.encode(),write_to=str(p.with_suffix('.png')))
 return 1
if __name__=='__main__':
 jobs=json.loads((ROOT/'.video-jobs.json').read_text());paths=list((ROOT/'.video-frames').rglob('*.svg'))
 with ProcessPoolExecutor(max_workers=6) as ex:
  for i,_ in enumerate(ex.map(raster,paths)):
   if (i+1)%500==0:print('Video PNG frames:',i+1,flush=True)
 for video in jobs['videos']:
  source=ROOT/'.video-frames'/video['id'];output=OUT/video['id'];fps=jobs['fps']
  subprocess.run(['ffmpeg','-loglevel','error','-y','-framerate',str(fps),'-i',str(source/'%04d.png'),'-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(output.with_suffix('.mp4'))],check=True)
  subprocess.run(['ffmpeg','-loglevel','error','-y','-framerate',str(fps),'-i',str(source/'%04d-alpha.png'),'-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-crf','30','-b:v','0',str(output.parent/(output.name+'-alpha.webm'))],check=True)
  from shutil import copyfile
  copyfile(source/f'{int(video["duration"]*fps*.37):04}.png',output.parent/(output.name+'-poster.png'))
  end=f'00:00:{video["duration"]:02}.000'
  output.with_suffix('.vtt').write_text('WEBVTT\n\n00:00:00.000 --> '+end+'\n'+video['description']+'\n')
  print('Encoded',video['id'],flush=True)
