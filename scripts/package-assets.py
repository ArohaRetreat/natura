"""Refresh the current asset bundle without duplicating its retained vector/print masters."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json, os
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'public';DOWNLOADS=PUBLIC/'downloads'
version=json.loads((ROOT/'package.json').read_text())['version'];target=DOWNLOADS/f'Natura-Design-Assets-v{version}.zip'
sources=sorted(DOWNLOADS.glob('Natura-Design-Assets-v*.zip'))
if not sources:raise SystemExit('A retained master asset bundle is required.')
base=target if target.exists() else sources[-1];temporary=target.with_suffix('.next.zip');prefix=f'Natura-Design-Assets-v{version}/'
with ZipFile(base) as source,ZipFile(temporary,'w',ZIP_DEFLATED) as out:
 for item in source.infolist():
  rel=item.filename.split('/',1)[1]
  if rel.startswith(('docs/','data/','system/','assets/scenes/')) or rel in ['START-HERE.txt','LICENSE','THIRD-PARTY-NOTICES.md']:continue
  out.writestr(prefix+rel,source.read(item.filename))
 for directory in ['docs','data','assets/scenes']:
  for file in (PUBLIC/directory).rglob('*'):
   if file.is_file():out.write(file,prefix+str(file.relative_to(PUBLIC)))
 for name in ['nature-scenes.js','additional-scenes.js','weather-landscape.js','seasonal.js','season-studio.js','component-patterns.js','site-renderer.js','model.js','styles.css']:
  out.write(ROOT/'src'/name,prefix+'system/'+name)
 for name in ['LICENSE','THIRD-PARTY-NOTICES.md']:out.write(ROOT/name,prefix+name)
 out.write(ROOT/'config/retreat-location.json',prefix+'data/retreat-location.json')
 out.writestr(prefix+'START-HERE.txt',f'Natura {version} | Official design standards of Aroha Retreat\nhttps://aroha-retreat.web.app/design/\nCurrent complete motion reference: docs/Natura-Motion-Catalogue.html (12 studies). The existing motion PDF is the original four-study foundation. Weather landscapes and native component feedback have separate source modules under system/.\nFor a complete runnable application, clone https://github.com/ArohaRetreat/natura or use the current source ZIP. This is the design asset bundle, including editable SVG/print masters, fonts, licences, transparent icons, illustrations and motion source.\nCustom material is authorised solely for Aroha Retreat websites; see LICENSE. Third-party MIT/OFL rights remain independent. Weather previews are synthetic; production provider integration is not configured.\n')
os.replace(temporary,target)
for old in sources:
 if old!=target:old.unlink()
icons=DOWNLOADS/f'Natura-Service-Icons-v{version}.zip'
for old in DOWNLOADS.glob('Natura-Service-Icons-v*.zip'):
 if old!=icons:
  if not icons.exists():old.rename(icons)
  else:old.unlink()
with ZipFile(target) as check:
 assert check.testzip() is None
 assert sum('/assets/scenes/' in n and n.endswith('.svg') for n in check.namelist())==12
print('Packaged',target.name)
