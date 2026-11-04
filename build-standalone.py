from pathlib import Path
import re

root=Path(__file__).parent
s=(root/'dist/index.html').read_text()
def css(m):
    body=(root/'dist'/m[1]).read_text()
    body=re.sub(r'^\s*@import[^\n]*\n','',body,flags=re.M)
    return '<style>\n'+body+'\n</style>'
s=re.sub(r'<link rel="stylesheet" href="([^"]+)">',css,s)
s=re.sub(r'<script defer src="([^"]+)"></script>',lambda m:'<script>\n'+(root/'dist'/m[1]).read_text()+'\n</script>',s)
assert not re.search(r'<(?:script|link)[^>]+(?:src|href)="(?!https:|data:|#)',s)
assert '@import' not in s
assert 'klein-german-v1' in s
(root/'Klein_German.html').write_text(s)
print('Standalone app:',len(s.encode()),'bytes')
