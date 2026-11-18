"""Embed the supplied scans for offline use in the personal course."""
import base64
import io
import json
from pathlib import Path
import fitz
from PIL import Image

root = Path(__file__).resolve().parent
source = root.parents[1] / 'five-week-sources' / 'Netzwerk_neu_A1.pdf'
pages = []
with fitz.open(source) as book:
    if len(book) != 176:
        raise ValueError('The course page map expects the supplied 176-page scan.')
    for page in book:
        pixels = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
        image = Image.frombytes('RGB', (pixels.width, pixels.height), pixels.samples)
        buf = io.BytesIO()
        image.save(buf, format='WEBP', quality=73, method=3)
        pages.append(base64.b64encode(buf.getvalue()).decode('ascii'))
(root / 'dist' / 'book-scans.js').write_text('window.GERMAN_BOOK_SCANS=' + json.dumps(pages, separators=(',', ':')) + ';\n')
print('Embedded', len(pages), 'pages.')
