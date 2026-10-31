from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/downloads/Hrudhi-Character-Kit-v0.1.0.zip'
with ZipFile(OUT,'w',ZIP_DEFLATED,compresslevel=6) as z:
 for folder in ['public/assets/hrudhi','public/docs/hrudhi']:
  for p in sorted((ROOT/folder).rglob('*')):
   if p.is_file() and not any(x.startswith('.') for x in p.relative_to(ROOT/folder).parts):z.write(p,p.relative_to(ROOT/'public'))
 for name in ['SourceSans3.woff2','Lora.woff2','OFL.txt']:
  p=ROOT/'public/assets/fonts'/name
  if p.exists():z.write(p,p.relative_to(ROOT/'public'))
 for folder in ['SourceSans3','Lora']:
  for p in (ROOT/'public/assets/fonts'/folder).glob('*'):
   if p.is_file() and ('OFL' in p.name or 'LICENSE' in p.name):z.write(p,p.relative_to(ROOT/'public'))
 z.write(ROOT/'LICENSE','LICENSE.txt');z.write(ROOT/'docs/hrudhi/CONTRACT.md','docs/hrudhi/CONTRACT.md')
 z.write(ROOT/'docs/hrudhi/INTEGRATION.md','README.md');z.write(ROOT/'docs/hrudhi/example.html','example.html')
with ZipFile(OUT) as z:
 assert z.testzip() is None
print('Verified kit ZIP:',OUT.stat().st_size,'bytes')
# The complete ZIP is generated for Hosting; individual editable assets are versioned in Git.
