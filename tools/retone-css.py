#!/usr/bin/env python3
"""One-off palette migration: moves the old cream/teal palette in an overlay stylesheet onto the
Infinite Horizons design-system hues (navy neutrals, blue accent, marker yellow kept). Usage: retone-css.py file.css..."""
import re, sys, colorsys

def remap(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    deg = h*360
    nh = None
    if s < .3 and 40 <= deg <= 215 or s < .35 and (deg < 70 or deg > 330) and l > .35:
        nh, ns = 225, min(s, .22) if l > .5 else min(s*1.1, .5)      # warm / green-grey neutrals -> navy neutrals
    elif 140 <= deg <= 215 and s >= .3:
        nh, ns = 225, s                                                # teal -> blue
    elif 10 <= deg <= 40 and s >= .3:
        nh, ns = 226, s                                                # copper -> brand blue
    if nh is None:
        return r, g, b
    nr, ng, nb = colorsys.hls_to_rgb(nh/360, l, ns)
    return round(nr*255), round(ng*255), round(nb*255)

def hexsub(m):
    t = m.group(1)
    if len(t) == 3: t = ''.join(c*2 for c in t)
    r, g, b = int(t[0:2], 16), int(t[2:4], 16), int(t[4:6], 16)
    return '#%02x%02x%02x' % remap(r, g, b)

def rgbasub(m):
    r, g, b = int(m.group(2)), int(m.group(3)), int(m.group(4))
    nr, ng, nb = remap(r, g, b)
    return '%s(%d,%d,%d%s' % (m.group(1), nr, ng, nb, m.group(5))

FONTS = [
    (r'"Source Serif 4",\s*Georgia,\s*serif', 'var(--va-display)'),
    (r'Georgia,\s*"Times New Roman",\s*serif', 'var(--va-display)'),
    (r'Inter,\s*"Segoe UI",[^;}]*', 'var(--va-text)'),
    (r'"Segoe UI",\s*(?:Roboto|sans-serif)[^;}]*', 'var(--va-text)'),
]
for path in sys.argv[1:]:
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', hexsub, s)
    s = re.sub(r'(rgba?)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*[,)])', rgbasub, s)
    for pat, rep in FONTS: s = re.sub(pat, rep, s)
    open(path, 'w', encoding='utf-8').write(s)
    print('retoned', path)
