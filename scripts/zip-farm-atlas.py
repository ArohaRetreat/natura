from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT/'public/assets/farm-atlas';version=json.loads((BASE/'manifest.json').read_text())['version'];OUT=ROOT/f'public/downloads/Natura-Farm-Atlas-v{version}.zip'
with ZipFile(OUT,'w',ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(BASE.rglob('*')):
  if p.is_file() and not any(x.startswith('.') for x in p.relative_to(BASE).parts):z.write(p,p.relative_to(BASE))
 z.write(ROOT/'LICENSE','LICENSE.txt')
with ZipFile(OUT) as z:assert z.testzip() is None
print('Verified farm atlas ZIP:',OUT.stat().st_size,'bytes')
