from pathlib import Path
from PIL import Image
import hashlib,json,subprocess,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'public/assets/farm-atlas'
def main():
 m=json.loads((BASE/'manifest.json').read_text());assert m['counts']['lineIcons']==96;png=0
 for f in m['files']:
  p=BASE/f['path'];assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256'],p
  if p.suffix=='.svg':
   tree=ET.parse(p)
   assert not any(el.tag.split('}')[-1] in ['script','foreignObject','image'] for el in tree.iter())
  if p.suffix in ['.png','.webp']:
   im=Image.open(p);assert 'A' in im.getbands(),p;assert im.getchannel('A').getpixel((0,0))==0,p;png+=1
   if p.name.endswith('-motion.webp'):assert im.n_frames==36 and im.info['loop']==1
 videos=ROOT/'public/assets/hrudhi/videos';count=0
 for p in videos.glob('*.mp4'):
  meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]));streams=meta['streams'];assert len(streams)==1 and streams[0]['codec_type']=='video';s=streams[0];assert (s['width'],s['height'])==(1280,720);assert s['codec_name']=='h264' and s['r_frame_rate']=='24/1';assert 5<float(meta['format']['duration'])<9
  alpha=p.with_name(p.stem+'-alpha.webm');am=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(alpha)]));assert am['streams'][0]['tags']['alpha_mode']=='1'
  mask=subprocess.check_output(['ffmpeg','-v','error','-c:v','libvpx-vp9','-i',str(alpha),'-vf','alphaextract','-frames:v','1','-f','rawvideo','-pix_fmt','gray','pipe:1']);assert len(mask)==320*520 and min(mask)==0 and max(mask)>240
  assert p.with_suffix('.vtt').read_text().startswith('WEBVTT');count+=1
 assert count==5
 print('Verified farm assets:',len(m['files']),'transparent raster files:',png,'Hrudhi films and decoded alpha clips:',count)
if __name__=='__main__':main()
