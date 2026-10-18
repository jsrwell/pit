"""SVG illustration of a cupcake, used as image of the demo products."""

from typing import NamedTuple

SVG_CONTENT_TYPE = 'image/svg+xml'


class Palette(NamedTuple):
    """Colors of one cupcake illustration."""

    background: str
    background_edge: str
    frosting: str
    frosting_light: str
    wrapper: str
    wrapper_dark: str
    topping: str


SVG_TEMPLATE = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">'
    '<defs>'
    '<radialGradient id="bg" cx="50%" cy="38%" r="78%">'
    '<stop offset="0" stop-color="{p.background}"/>'
    '<stop offset="1" stop-color="{p.background_edge}"/></radialGradient>'
    '<linearGradient id="wr" x1="0" x2="1">'
    '<stop offset="0" stop-color="{p.wrapper_dark}"/>'
    '<stop offset=".5" stop-color="{p.wrapper}"/>'
    '<stop offset="1" stop-color="{p.wrapper_dark}"/></linearGradient>'
    '<linearGradient id="fr" x1="0" y1="0" x2="0" y2="1">'
    '<stop offset="0" stop-color="{p.frosting_light}"/>'
    '<stop offset="1" stop-color="{p.frosting}"/></linearGradient>'
    '<linearGradient id="gd" x1="0" x2="1">'
    '<stop offset="0" stop-color="#a67c35"/>'
    '<stop offset=".5" stop-color="#f3d58a"/>'
    '<stop offset="1" stop-color="#a67c35"/></linearGradient>'
    '</defs>'
    '<rect width="400" height="400" fill="url(#bg)"/>'
    '<ellipse cx="200" cy="340" rx="112" ry="13" fill="#000" '
    'opacity=".16"/>'
    '<path d="M120 236 L280 236 L261 334 Q200 345 139 334 Z" '
    'fill="url(#wr)"/>'
    '<g stroke="{p.wrapper_dark}" stroke-width="2" opacity=".6">'
    '<path d="M152 238 L160 337"/><path d="M184 238 L187 341"/>'
    '<path d="M216 238 L213 341"/><path d="M248 238 L240 337"/></g>'
    '<path d="M112 238 Q98 198 140 190 Q128 150 172 146 Q176 110 210 114 '
    'Q248 110 248 146 Q288 150 272 190 Q308 198 290 238 Q200 256 112 238 Z" '
    'fill="url(#fr)"/>'
    '<path d="M140 190 Q204 208 270 190" fill="none" '
    'stroke="{p.frosting_light}" stroke-width="6" stroke-linecap="round" '
    'opacity=".75"/>'
    '<path d="M172 146 Q210 162 248 146" fill="none" '
    'stroke="{p.frosting_light}" stroke-width="5" stroke-linecap="round" '
    'opacity=".75"/>'
    '<rect x="116" y="231" width="170" height="9" rx="4.5" '
    'fill="url(#gd)"/>'
    '<circle cx="210" cy="100" r="17" fill="{p.topping}"/>'
    '<circle cx="204" cy="94" r="5" fill="#fff" opacity=".55"/>'
    '<g fill="url(#gd)">'
    '<rect x="150" y="170" width="10" height="3" rx="1.5" '
    'transform="rotate(-25 155 171)"/>'
    '<rect x="236" y="168" width="10" height="3" rx="1.5" '
    'transform="rotate(30 241 169)"/>'
    '<rect x="196" y="212" width="10" height="3" rx="1.5" '
    'transform="rotate(-10 201 213)"/>'
    '<rect x="176" y="128" width="9" height="3" rx="1.5" '
    'transform="rotate(40 180 129)"/>'
    '<rect x="252" y="214" width="9" height="3" rx="1.5" '
    'transform="rotate(-35 256 215)"/>'
    '</g></svg>'
)


def render_cupcake(palette: Palette) -> bytes:
    """Render the SVG illustration of a cupcake painted with ``palette``."""
    return SVG_TEMPLATE.format(p=palette).encode()
