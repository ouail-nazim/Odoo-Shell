from odoo import models, api
from odoo.tools.safe_eval import safe_eval
from collections import defaultdict, OrderedDict


class IrModel(models.Model):
    _inherit = 'ir.model'

    @api.model
    def evaluate_command(self, model, res_id, command, type="py"):
        if model:
            self = self.env[model]
            if res_id:
                self = self.browse(int(res_id))
        try:
            if type == "py":
                res = safe_eval(command, {'self': self})
                if isinstance(res, OrderedDict):
                    res = list(res)
                return res

            elif type == "sql":
                self.env.cr.execute(command)
                result = self.env.cr.fetchall()
                formatted_result = "<table border='1'><tr>"
                column_names = [desc[0] for desc in self.env.cr.description]
                for col_name in column_names:
                    formatted_result += f"<th>{col_name}</th>"
                formatted_result += "</tr>"
                for entry in result:
                    formatted_result += "<tr>"
                    for value in entry:
                        formatted_result += f"<td>{value}</td>"
                    formatted_result += "</tr>"
                formatted_result += "</table>"
                return formatted_result

            else:
                return "Unsupported type: {}".format(type)
        except Exception as e:
            return e
