/** @odoo-module **/
import '@mail/components/activity_menu_view/activity_menu_view';
import {useService} from "@web/core/utils/hooks";

import {Component, useState} from "@odoo/owl";

const wizardTemplate = () => $(`
            <div class="bg-white p-4" id="odoo-shell">
                <div id="black-screen"></div>
                <div id="shell-container">
                    <div id="shell-header" class="d-flex justify-content-between">
                        <h4>Odoo Shell (v16 Beta)</h4>
                        <button class="close-shell">x</button>
                    </div>
                    <div id="shell-body">
                        <div id="shell-controls" class="d-flex justify-content-between">
                            <input type="text" id="shell-command"/>
                            <select name="type" id="shell-type" class="w-25 mx-2">
                                <option value="py">Python</option>
                                <option value="sql">Sql</option>
                            </select>
                            <button class="evaluation-button">Evaluate</button>
                        </div>
                        <div id="shell-screen">
                        </div>
                    </div>
                    <div id="shell-footer"></div>
                </div>
            </div>
        `);

export class ShellMenuContainer extends Component {
    setup() {
        super.setup();
        this.rpc = useService("rpc");
        this.orm = useService("orm");
        this.user = useService("user");
        this.state = useState({});
        this.modalTemplate = wizardTemplate();

    }

    _openShellWizard(e) {
        e.preventDefault();
        this.modalTemplate.find('.close-shell').on('click', this._handleCloseShell.bind(this));
        this.modalTemplate.find('.evaluation-button').on('click', () => this._evaluateCommand());
        this.modalTemplate.find('#shell-command').on('keypress', e => {
            if (e.which === 13)
                this._evaluateCommand();
        });
        $('body').append(this.modalTemplate);
    }

    _handleCloseShell() {
        $('#odoo-shell').remove();
    }

    async _evaluateCommand() {
        let command = $('#shell-command').val();
        let type = $('#shell-type').val();
        let params = this._getCurrentLocationParams();
        const result = await this.rpc(
            '/odoo_shell/evaluate_command',
            {
                model: params.model,
                res_id: parseInt(params.id),
                command: command,
                type: type,
            }
        );
        let shellScreen = this.modalTemplate.find('#shell-screen');
        shellScreen.empty();
        if (typeof result === 'object') {
            result.map((val, key) => {
                let itemElement = $(`<li>${val}</li>`);
                shellScreen.append(itemElement);
            });
        } else if (['string', 'number', 'boolean'].includes(typeof result)) {
            let itemElement = $(`<p>${result}</p>`);
            shellScreen.append(itemElement);
        }


    }

    _getCurrentLocationParams() {
        let paramsList = document.location.href.split('#')[1].split('&');
        var paramsDict = {};
        for (let item of paramsList) {
            let splitedItem = item.split('=');
            paramsDict = {...paramsDict, [splitedItem[0]]: splitedItem[1]}
        }
        return paramsDict
    }

}

Object.assign(ShellMenuContainer, {
    template: 'odoo_shell.ShellMenuContainer',
});
