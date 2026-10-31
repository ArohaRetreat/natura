from pathlib import Path
from PIL import Image as PILImage
import html,re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,Image,KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import subprocess
ROOT=Path(__file__).resolve().parents[1];PREVIEW=ROOT/'tmp/pdfs/art';PREVIEW.mkdir(parents=True,exist_ok=True)
for src in (ROOT/'public/assets/hrudhi/references').glob('*.png'):
 im=PILImage.open(src);im.thumbnail((360,540));im.save(PREVIEW/src.name)
OUT=ROOT/'public/docs/hrudhi';OUT.mkdir(parents=True,exist_ok=True)
# Preserve the design system's Source Sans 3 font in the PDF.
pdfmetrics.registerFont(TTFont('Source',str(ROOT/'public/assets/fonts/SourceSans3/SourceSans3-400.ttf')))
pdfmetrics.registerFont(TTFont('Heading',str(ROOT/'public/assets/fonts/Lora/Lora-500.ttf')))
styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='BodyN',fontName='Source',fontSize=10,leading=14,textColor=colors.HexColor('#294F38'),spaceAfter=9));styles.add(ParagraphStyle(name='TitleN',fontName='Heading',fontSize=32,leading=37,textColor=colors.HexColor('#294F38'),spaceAfter=18));styles.add(ParagraphStyle(name='HeadN',fontName='Heading',fontSize=19,leading=24,textColor=colors.HexColor('#294F38'),spaceBefore=14,spaceAfter=10));styles.add(ParagraphStyle(name='SmallN',fontName='Source',fontSize=8.4,leading=11,textColor=colors.HexColor('#536052'),spaceAfter=7))
source=(ROOT/'docs/hrudhi/CONTRACT.md').read_text();sections=re.split(r'^## ',source,flags=re.M)
story=[]
def para(t,style='BodyN'):
 t=html.escape(t);t=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',t);t=re.sub(r'`([^`]+)`',r'<font color="#86613B">\1</font>',t);return Paragraph(t,styles[style])
def table(rows):
 n=len(rows[0]);data=[[para(c.strip(),'SmallN') for c in row] for row in rows];widths=[(475/n)]*n
 if n==3:widths=[122,106,247]
 if n==4:widths=[90,55,95,235]
 t=Table(data,colWidths=widths,hAlign='LEFT',repeatRows=1);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#EEF3E8')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.5,colors.HexColor('#819B62')),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#E1E8DA')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),5)]));return t
story+=[para('NATURA / CHARACTER SYSTEM / v0.2.2','SmallN'),para('Hrudhi\nGrowing with Aroha'.replace('\n',' '),'TitleN'),para('Draft character bible and integration contract. Ages 5-17. Family review pending.')]
chapters=['explorer','naturalist','storyteller','pathfinder','steward'];row=[Image(str(PREVIEW/f'{c}-warm.png'),width=87,height=130.5,mask='auto') for c in chapters];story.append(Table([row,[[para(x,'SmallN')] for x in ['5-7 / Explorer','8-10 / Naturalist','11-13 / Storyteller','14-16 / Pathfinder','17 / Steward']]],colWidths=[95]*5));story+=[Spacer(1,20),para('One recognisable character, five proposed chapters','HeadN'),para('The super admin will define retreat milestones. AI may select an eligible approved chapter. Growth is not tied to a visitor\'s clock, weather, or elapsed calendar years. No permanent mascot is activated by this draft kit.'),para('Read this with the editable SVG rig and the illustrated references. They use different visual treatments: detailed concept art and a functional simplified vector interpretation.'),para('Aroha Retreat website use only. See LICENSE in the kit.','SmallN'),PageBreak()]
for section in sections[1:]:
 heading,_,body=section.partition('\n');
 if heading=='Web library and video studies':story.append(PageBreak())
 story.append(para(heading,'HeadN'));blocks=body.strip().split('\n\n')
 for block in blocks:
  if block.startswith('|'):
   rows=[line.strip('|').split('|') for line in block.splitlines() if line.startswith('|') and not re.match(r'^\|\s*[-: ]+\|',line)];story.append(table(rows));story.append(Spacer(1,12))
  else:story.append(para(block.replace('\n',' ')))
 if heading=='Wardrobes and props':
  story.append(Table([[Image(str(PREVIEW/f'explorer-{season}.png'),width=95,height=142.5,mask='auto') for season in ['warm','monsoon','cool']],[ [para(x,'SmallN')] for x in ['Warm / breathable layers','Monsoon / rain gear','Cool / cream knit layers']]],colWidths=[158]*3))
 if heading=='Motion direction':
  story.append(Table([[Image(str(ROOT/f'public/assets/hrudhi/poses/explorer-warm-{state}.png'),width=78,height=126.75,mask='auto') for state in ['walking','storytelling','gardening']]],colWidths=[158]*3))
 if heading in ['Design boundaries','Wardrobes and props','Motion direction','Growth policy and AI contract','Planned backend: /api/v1/hrudhi']:story.append(PageBreak())
def page(canvas,doc):
 canvas.setStrokeColor(colors.HexColor('#DDE5D7'));canvas.line(60,805,535,805);canvas.setFont('Source',8);canvas.setFillColor(colors.HexColor('#536052'));canvas.drawString(60,818,'NATURA / HRUDHI / DRAFT - FAMILY REVIEW PENDING');canvas.drawString(60,29,'Official Aroha Retreat character standards | Restricted Aroha website use');canvas.drawRightString(535,29,str(doc.page))
SimpleDocTemplate(str(OUT/'Character-Bible.pdf'),pagesize=(595.28,841.89),rightMargin=60,leftMargin=60,topMargin=55,bottomMargin=53,title='Hrudhi - Character Bible v0.2.2',author='Aroha Retreat').build(story,onFirstPage=page,onLaterPages=page)
# Accessible standalone companion contains the same full contract.
parts=[]
for section in sections[1:]:
 heading,_,body=section.partition('\n');parts.append('<section><h2>'+html.escape(heading)+'</h2>')
 for block in body.strip().split('\n\n'):
  if block.startswith('|'):
   rows=[line.strip('|').split('|') for line in block.splitlines() if line.startswith('|') and not re.match(r'^\|\s*[-: ]+\|',line)];parts.append('<div class="table-wrap"><table>'+''.join('<tr>'+''.join(('<th>' if i==0 else '<td>')+html.escape(c.strip())+('</th>' if i==0 else '</td>') for c in row)+'</tr>' for i,row in enumerate(rows))+'</table></div>')
  else:parts.append('<p>'+html.escape(block).replace('\n',' ')+'</p>')
 parts.append('</section>')
lineage=''.join(f'<figure><img src="../../assets/hrudhi/references/{c}-warm.webp" alt="Draft Hrudhi {c} chapter" width="180" height="270"><figcaption>{c.title()}</figcaption></figure>' for c in chapters)
(OUT/'Character-Bible.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hrudhi - Character Bible v0.2.2</title><style>@font-face{font-family:Source;src:url('../../assets/fonts/SourceSans3.woff2')}@font-face{font-family:Heading;src:url('../../assets/fonts/Lora.woff2')}*{box-sizing:border-box}body{margin:0;color:#294f38;background:white;font:17px/1.7 Source,sans-serif}main{max-width:1080px;margin:auto;padding:50px 24px}h1,h2{font-family:Heading,serif;line-height:1.25}h1{font-size:clamp(32px,6vw,58px)}h2{font-size:27px}section{margin:48px 0;padding-top:20px;border-top:1px solid #dde5d7}p{max-width:85ch}a{color:inherit}table{border-collapse:collapse;font-size:15px;min-width:630px}td,th{padding:14px;text-align:left;border-bottom:1px solid #dde5d7;vertical-align:top}th{background:#eef3e8}.table-wrap{overflow:auto}.lineage{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}figure{margin:0;text-align:center}img{max-width:100%;height:auto}.draft{padding:18px;background:#f5f8f0;border-left:3px solid #819b62}@media(max-width:650px){.lineage{grid-template-columns:repeat(2,1fr)}}@media print{main{padding:10px}section{break-inside:auto}h2{break-after:avoid}}</style><main><a href="../../#hrudhi">Back to the character lab</a><p>NATURA / CHARACTER KIT v0.2.2</p><h1>Hrudhi. Growing with Aroha.</h1><p class="draft"><strong>Draft - family review pending.</strong> A fictional illustrated guide, ages 5-17. This kit does not activate a permanent website mascot.</p><div class="lineage">'''+lineage+'</div>'+''.join(parts)+'<p><a href="Character-Bible.pdf">Download this contract as a PDF</a></p></main></html>')
print('Created character bible PDF and matching HTML.')
