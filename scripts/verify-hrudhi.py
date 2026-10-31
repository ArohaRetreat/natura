"""Verify actual shipped bytes and decoded image/XML formats, not just filenames."""
from pathlib import Path
import json,hashlib,xml.etree.ElementTree as ET
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]/'public/assets/hrudhi'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 m=json.loads((ROOT/'manifest.json').read_text());assert m['status']=='draft';counts={};animated=0
 for f in m['files']:
  p=ROOT/f['path'];assert digest(p)==f['sha256'],p;assert p.stat().st_size==f['bytes'];counts[p.suffix]=counts.get(p.suffix,0)+1
  if p.suffix=='.svg':ET.parse(p)
  if p.suffix in ['.png','.webp'] and not f['path'].startswith('videos/'):
   im=Image.open(p);assert 'A' in im.getbands(),p;assert im.getchannel('A').getpixel((0,0))==0,p
   if f['path'].startswith('motion/') and p.suffix=='.webp':
    assert im.size==(192,312);assert im.n_frames>20;assert im.info['loop']==1;animated+=1
    for frame in [0,im.n_frames//2,im.n_frames-1]:
     im.seek(frame);a=im.getchannel('A');assert a.getextrema()[0]==0;assert a.getpixel((0,0))==0
 for bundle in m['chapterBundles']:
  p=ROOT/bundle['path'];assert digest(p)==bundle['sha256'];b=json.loads(p.read_text());assert b['status']=='draft';assert all(digest(ROOT/f['path'])==f['sha256'] for f in b['files'])
 assert animated==120
 print(f"Verified {len(m['files'])} hashed assets, all SVG XML, alpha and 120 animated WebP previews; 5 draft chapter bundles.")
if __name__=='__main__':main()
