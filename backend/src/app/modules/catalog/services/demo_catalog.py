"""Demo products loaded on an empty catalog."""

from decimal import Decimal
from typing import NamedTuple

from app.modules.catalog.services.cupcake_illustration import Palette


class DemoProduct(NamedTuple):
    """Product inserted by the demo seed."""

    name: str
    category: str
    flavor: str
    price: Decimal
    featured: bool
    available: bool
    description: str
    palette: Palette


DEMO_PRODUCTS: tuple[DemoProduct, ...] = (
    DemoProduct(
        'Chocolate Belga Supremo',
        'Gourmet',
        'Chocolate Belga',
        Decimal('18.90'),
        True,
        True,
        'Massa úmida de cacau 70% com recheio cremoso de ganache e '
        'cobertura aerada de chocolate belga, finalizada com pérola dourada.',
        Palette(
            '#f3e6dc',
            '#e2cbb9',
            '#5a3528',
            '#7d4c3a',
            '#3a241b',
            '#24150f',
            '#d9b56a',
        ),
    ),
    DemoProduct(
        'Red Velvet Imperial',
        'Clássicos',
        'Red Velvet',
        Decimal('16.90'),
        True,
        True,
        'O clássico aveludado de massa rubra, com frosting de cream cheese '
        'levemente adocicado e toque de baunilha.',
        Palette(
            '#f7e3e3',
            '#ebc9c9',
            '#efe4d6',
            '#fbf6ef',
            '#9b2335',
            '#6e1524',
            '#b0213a',
        ),
    ),
    DemoProduct(
        'Pistache e Rosas',
        'Gourmet',
        'Pistache',
        Decimal('21.90'),
        True,
        True,
        'Massa amanteigada de pistache siciliano com creme de pistache e '
        'pétalas de rosa cristalizadas.',
        Palette(
            '#eef1e3',
            '#d9e0c6',
            '#a9bd7f',
            '#c7d6a5',
            '#6e7f4b',
            '#4f5d33',
            '#d98c9a',
        ),
    ),
    DemoProduct(
        'Baunilha de Madagascar',
        'Clássicos',
        'Baunilha',
        Decimal('14.90'),
        False,
        True,
        'Delicada massa de baunilha bourbon com favas de Madagascar e '
        'buttercream suíço sedoso.',
        Palette(
            '#fbf5ea',
            '#efe2cc',
            '#efe1c3',
            '#fbf4e4',
            '#c5a46d',
            '#9c7c45',
            '#d9b56a',
        ),
    ),
    DemoProduct(
        'Frutas Vermelhas Royale',
        'Gourmet',
        'Frutas Vermelhas',
        Decimal('19.90'),
        False,
        True,
        'Massa de baunilha com coração de geleia artesanal de frutas '
        'vermelhas e mousse de framboesa.',
        Palette(
            '#f6e1e7',
            '#e8c3cf',
            '#d27f95',
            '#e6a3b4',
            '#5e1f33',
            '#3f1121',
            '#7a1430',
        ),
    ),
    DemoProduct(
        'Limão Siciliano',
        'Clássicos',
        'Limão Siciliano',
        Decimal('15.90'),
        False,
        True,
        'Massa cítrica e leve com curd de limão siciliano e merengue '
        'italiano maçaricado.',
        Palette(
            '#fbf7e3',
            '#efe6bf',
            '#f1e08e',
            '#fbf3c9',
            '#d8bb55',
            '#a88c2f',
            '#f5d742',
        ),
    ),
    DemoProduct(
        'Caramelo Salgado Flor de Sal',
        'Gourmet',
        'Caramelo Salgado',
        Decimal('20.90'),
        True,
        True,
        'Massa de açúcar mascavo, recheio de caramelo salgado e cobertura '
        'de doce de leite com cristais de flor de sal.',
        Palette(
            '#f5e8d6',
            '#e6cfb0',
            '#c98f4f',
            '#e2b77e',
            '#3a2418',
            '#22140d',
            '#f6efe6',
        ),
    ),
    DemoProduct(
        'Café Espresso Noir',
        'Edição Especial',
        'Café',
        Decimal('22.90'),
        False,
        True,
        'Massa de chocolate com espresso, ganache de café e cobertura de '
        'mascarpone com grãos caramelizados.',
        Palette(
            '#ece2d9',
            '#d6c4b4',
            '#7d5a40',
            '#a07a5c',
            '#1f1512',
            '#0f0a08',
            '#3b2418',
        ),
    ),
    DemoProduct(
        'Coco Vegano',
        'Veganos',
        'Coco',
        Decimal('17.90'),
        False,
        True,
        'Receita 100% vegetal com leite de coco, recheio de cocada cremosa '
        'e flocos de coco tostado.',
        Palette(
            '#f1f3ee',
            '#dde3d6',
            '#f1ede6',
            '#ffffff',
            '#8fa38a',
            '#66795f',
            '#f8f4ec',
        ),
    ),
    DemoProduct(
        'Morango Silvestre Vegano',
        'Veganos',
        'Morango',
        Decimal('17.90'),
        False,
        False,
        'Massa vegana de baunilha com compota de morangos silvestres e '
        'cobertura de creme de castanhas.',
        Palette(
            '#fae6ea',
            '#f0cbd3',
            '#e8909f',
            '#f4b8c1',
            '#c45a6b',
            '#963c4b',
            '#d1263f',
        ),
    ),
    DemoProduct(
        'Trufa de Ouro',
        'Edição Especial',
        'Chocolate Belga',
        Decimal('24.90'),
        True,
        True,
        'Nossa assinatura: chocolate belga intenso, coração de trufa e '
        'folha de ouro comestível 23 quilates.',
        Palette(
            '#3a2d27',
            '#140e0c',
            '#2b1a14',
            '#4a3026',
            '#c5a46d',
            '#8f7240',
            '#e9c97e',
        ),
    ),
)
