# -*- coding: utf-8 -*-

{
    'name': 'Odoo Shell',
    'version': '0.1',
    'sequence': 1,
    'summary': 'Shell helper for developers',
    'description': "",
    'depends': ['base'],
    'data': [
        'views/assets.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': True,
    'application': True,
}
