# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import http
from odoo.http import request


class ShellController(http.Controller):

    @http.route('/odoo_shell/evaluate_command', type='json', auth='user')
    def odoo_shell_evaluate_command(self, model, res_id, command, type="py"):
        return request.env['ir.model'].evaluate_command(model, res_id, command, type)
