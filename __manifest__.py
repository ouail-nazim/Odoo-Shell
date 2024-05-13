{
    'name': 'Odoo Shell',
    'version': '16',
    'sequence': 1,
    'summary': 'Shell helper for developers',
    'description': "",
    'depends': ['base'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'odoo_shell/static/src/scss/odoo_shell.scss',
            'odoo_shell/static/src/components/*/*.xml',
            'odoo_shell/static/src/components/*/*.js',
            'odoo_shell/static/src/js/*/*.js',
            'odoo_shell/static/src/js/*.js',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': True,
    'application': True,
}
