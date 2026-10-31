from pathlib import Path
import io
import pymupdf as fitz
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public/docs'
FONTS=ROOT/'public/assets/fonts'
for n,f in [('Display','Lora/Lora-500.ttf'),('Body','SourceSans3/SourceSans3-400.ttf'),('Strong','SourceSans3/SourceSans3-600.ttf')]:pdfmetrics.registerFont(TTFont(n,str(FONTS/f)))
W,H=595.28,841.89; forest=HexColor('#163E2D'); muted=HexColor('#526157'); bronze=HexColor('#86613B')
style=ParagraphStyle('body',fontName='Body',fontSize=11.5,leading=17,textColor=muted)
def start(c,kicker,title,sub,num):
 c.setFillColor(forest);c.setFont('Strong',9);c.drawString(48,H-45,'NATURA / v0.1.0 / '+kicker.upper());c.setFont('Display',27);c.drawString(48,H-97,title)
 para(c,sub,48,H-122,499)
 c.setStrokeColor(HexColor('#DDE5D7'));c.line(48,48,W-48,48);c.setFont('Body',9);c.setFillColor(muted);c.drawString(48,32,'Crafted for Aroha Retreat | 31 October 2026');c.drawRightString(W-48,32,f'{num:02}')
def para(c,text,x,top,width):
 p=Paragraph(text,style);_,h=p.wrap(width,800);assert top-h>60,(text,top,h);p.drawOn(c,x,top-h);return top-h

def block(c,title,text,y):
 c.setFillColor(forest);c.setFont('Strong',14);c.drawString(48,y,title);return para(c,text,48,y-13,499)-28

def img(c,name,x,y,w,h):c.drawImage(str(ROOT/f'public/assets/illustrations/{name}.png'),x,y,width=w,height=h,preserveAspectRatio=True,anchor='c',mask='auto')
c=canvas.Canvas(str(OUT/'Natura-Field-Guide-v0.1.0.pdf'),pagesize=(W,H));c.setTitle('Natura v0.1.0 - Field guide')
start(c,'Design direction','A living design language.','A practical system for an Aroha Retreat website: language-specific identity, quiet typography, transparent icons and nature studies.',1)
img(c,'landscape',48,365,499,280)
y=block(c,'White is the default.', 'Use #FFFFFF for primary page surfaces. Warm ivory #FAF7EF is an optional editorial accent, never baked into a logo or service icon. Dark surfaces require the white logo edition.',333)
y=block(c,'Illustration has a job.', 'The leafscape explains the retreat as an interconnected landscape. The growth study explains emergence and cultivation. Use them in an introduction or story section; keep controls and reading areas clear.',y)
block(c,'Natura and Aroha have separate roles.','Natura names this design system and application. Aroha Retreat remains the brand on all retreat logos. English-only, Kannada-only and bilingual lockups remain separate assets; approved wording is preserved.',y);c.showPage()
start(c,'Foundations','Choose by role.','Typography and colour support bilingual reading and calm, useful interactions.',2)
y=640
for title,text in [('Lora / English editorial','Use Lora 500 for page titles and narrative headings. Its serif forms provide a literary, organic tone. Keep paragraphs in the simpler body family rather than decorating every surface.'),('Source Sans 3 / English interface','Use 400 for body text and 600 for labels and controls. Its open forms and clear hierarchy suit dense documentation and service information. Body: 18/28 px; compact: 16/24 px.'),('Noto Serif Kannada / Kannada editorial','Pair with Lora by role, not by forcing identical glyph heights. Allow Kannada its own line height and test complete words. The brand wordmarks are outlined and do not depend on installed fonts.'),('Noto Sans Kannada / Kannada interface','Pair with Source Sans 3 for controls and longer Kannada text. All four families ship locally with OFL licences. Preserve these licences in website exports.')]:y=block(c,title,text,y)
for i,(label,color) in enumerate([('Forest','#163E2D'),('Leaf','#60833D'),('Bronze','#86613B'),('Mist','#DDE5D7'),('White','#FFFFFF')]):
 x=48+i*101;c.setFillColor(HexColor(color));c.setStrokeColor(HexColor('#DDE5D7'));c.rect(x,143,88,38,fill=1,stroke=1);c.setFillColor(forest);c.setFont('Strong',10);c.drawString(x,125,label);c.setFont('Body',9);c.drawString(x,111,color)
c.showPage()
start(c,'Implementation','Build with the system.','Use the live workspace at aroha-retreat.web.app/design/ as the current handoff.',3)
img(c,'growth',48,437,499,198)
y=block(c,'A complete asset set','The complete ZIP contains outlined logo vectors and print exports, transparent raster logos, icon-only marks, favicon resources, font files and licences, 48 service icons, two illustrations, four scene SVGs and their JavaScript controller.',407)
y=block(c,'Website builder contract','Edit, reorder and preview up to 16 sections. Add either botanical illustration to a story section. Export JSON to transfer a draft or a website ZIP containing HTML, CSS, logo, selected artwork, local fonts and licences. Drafts stay in this browser; moving origins requires JSON export/import.',y)
y=block(c,'Motion and accessibility','Scenes play only after an explicit action and have pause, replay, speed and timeline controls. Reduced motion shows the final composition immediately. Routine UI feedback stays around 140-240 ms. Use visible focus and at least 48 px control targets.',y)
block(c,'Production boundaries','The builder exports a development starter. Confirm retreat copy, contact details and services before publication. Booking, payments, authentication and submission handling are separate implementation work. The Firebase design app does not initialize Analytics.',y);c.save()
scenes=[('leaf','Leaf drift',3200,[('0-640 ms','The leaf releases; the branch stays still.'),('640-1376 ms','The leaf reverses tilt in a flutter.'),('1376-2912 ms','Translation carries it down and across.'),('2912-3200 ms','The final rotation settles beside its shadow.')],'Six transform keyframes move one leaf, with a delayed shadow. The SVG stays stationary. The leaf uses cubic-bezier(.77,0,.175,1).'),('seed','Seed germination',5200,[('200-1100 ms','Two shell halves separate and rotate.'),('500-2350 ms','Primary and branching roots draw below soil.'),('1700-3500 ms','A curved shoot draws upward.'),('3500-5200 ms','Left and right cotyledons rotate open in sequence.')],'Root and shoot paths use their actual length as dash offsets. Each leaf opens around the shoot tip. Parts overlap in time to create continuous growth.'),('water','Water ripple',2600,[('0-650 ms','A droplet descends to the surface.'),('580-1180 ms','A small splash appears and recedes.'),('600-2600 ms','Three elliptical rings widen with 150 ms offsets.'),('2300-2600 ms','The last ring fades into still water.')],'The droplet translates independently. Three rings scale from the surface point and fade. The waterline stays still; the whole icon never pulses.'),('path','Trail journey',3600,[('0-900 ms','The traveller begins at the lower left.'),('900-1800 ms','The trail curves around the first bend.'),('1800-2700 ms','The route ascends toward the ridge.'),('2700-3600 ms','The traveller reaches the upper endpoint.')],'The trail stroke draws with dash offset. The traveller follows the same curved CSS offset-path with linear offset-distance, rather than sliding across the card.')]
c=canvas.Canvas(str(OUT/'Natura-Motion-Field-Notes.pdf'),pagesize=(W,H));c.setTitle('Natura v0.1.0 - Motion field notes')
for i,(kind,title,duration,rows,tech) in enumerate(scenes):
 start(c,'Motion field notes',title,f'Study {i+1:02} / {duration/1000:.1f} seconds / explicit playback / no loop',i+1)
 drawing=svg2rlg(str(ROOT/f'public/assets/scenes/{kind}.svg'));drawing.scale(1.25,1.25);renderPDF.draw(drawing,c,147,401)
 y=386
 for timing,text in rows:
  c.setFillColor(bronze);c.setFont('Strong',10);c.drawString(48,y,timing);para(c,text,170,y+9,377);c.setStrokeColor(HexColor('#DDE5D7'));c.line(48,y-17,547,y-17);y-=40
 y=block(c,'How the movement is made',tech,202)
 para(c,'Use <b>sceneSvg(kind)</b> and <b>createScenePlayer(svg, kind)</b> from nature-scenes.js. The player exposes play, pause, resume, seek, speed, reset and dispose. Respect prefers-reduced-motion: show the final composition. Dispose on route exit; reset on a hidden tab. Interface feedback stays 140-240 ms.',48,y+5,499)
 c.showPage()
c.save()
# The retained identity handbook is an unchanged reference asset.
(ROOT/'tmp/pdfs').mkdir(parents=True,exist_ok=True)
for name in ['Natura-Field-Guide-v0.1.0','Natura-Motion-Field-Notes']:
 d=fitz.open(OUT/(name+'.pdf'))
 for i,page in enumerate(d):page.get_pixmap(matrix=fitz.Matrix(0.85,0.85)).save(str(ROOT/'tmp/pdfs'/f'{name}-{i+1}.png'))
print('Created 3-page field guide, 4-page motion guide and retained 11-page identity standards.')
