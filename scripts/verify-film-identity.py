"""Decode actual MP4 character pixels and compare them to the immutable illustration."""
from pathlib import Path
from io import BytesIO
import base64,hashlib,json,subprocess
import cairosvg
from PIL import Image,ImageChops,ImageStat
ROOT=Path(__file__).resolve().parents[1]/'public/assets/hrudhi'
def main():
 lock=json.loads((ROOT/'identity-lock.json').read_text());manifest=json.loads((ROOT/'videos/source-manifest.json').read_text());assert manifest['identity']==lock['id'];results=[]
 for film in manifest['films']:
  assert film['representation']=='unchanged-original-illustration' and film['characterMotion']=='none'
  file=Path(film['reference']);assert file.parts[0]=='references' and len(file.parts)==2
  data=(ROOT/file).read_bytes();sha=hashlib.sha256(data).hexdigest();assert sha==film['referenceSha256']==lock['referenceSha256'][file.name]
  box=film['renderBox'];uri='data:image/png;base64,'+base64.b64encode(data).decode();svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#FFFFFF"/><image href="{uri}" x="{box["x"]}" y="{box["y"]}" width="{box["width"]}" height="{box["height"]}" preserveAspectRatio="xMidYMid meet"/></svg>'
  roi=tuple(film['identityCheckRect']);expected=Image.open(BytesIO(cairosvg.svg2png(bytestring=svg.encode()))).convert('RGB').crop(roi);assert expected.convert('L').getextrema()[0]<100
  mask=expected.convert('L').point(lambda value:255 if value<235 else 0)
  errors=[]
  for seconds in [0,1]:
   decoded=subprocess.check_output(['ffmpeg','-v','error','-ss',str(seconds),'-i',str(ROOT/'videos'/(film['id']+'.mp4')),'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1']);actual=Image.open(BytesIO(decoded)).convert('RGB').crop(roi);difference=ImageChops.difference(expected,actual);error=max(ImageStat.Stat(difference,mask).mean);assert error<4,(film['id'],error);errors.append(round(error,3))
  results.append({'id':film['id'],'decodedColourErrors':errors,'sourceSha256':sha})
 assert len(results)==5
 print(json.dumps({'verifiedOriginalArtworkFilms':5,'checks':results},indent=2))
if __name__=='__main__':main()
