odoo.define('odoo_shell.odoo_shell_widget', function (require) {
    let Widget = require('web.Widget');
    let SystrayMenu = require('web.SystrayMenu');

    const wizardTemplate = () => $(`
            <div class="bg-white p-4" id="odoo-shell">
                <div id="black-screen"></div>
                <div id="shell-container">
                    <div id="shell-header" class="d-flex justify-content-between">
                        <h4>Odoo Shell (v0.1 Beta)</h4>
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

    var OdooShell = Widget.extend({
        name: 'odoo_shell',
        template: 'odoo.shell.menu.icon',
        init: function () {
            this._super.apply(this, arguments);
            this.modalTemplate = wizardTemplate();
        },
        start: function () {
            this.$el.on('click', e => this._openShellWizard(e));
            return this._super();
        },
        _openShellWizard: function (e) {
            e.preventDefault();
            this.modalTemplate.find('.close-shell').on('click', this._handleCloseShell.bind(this));
            this.modalTemplate.find('#shell-header').mousedown(this._handleMouseDown);
            this.modalTemplate.find('.evaluation-button').on('click', () => this._evaluateCommand());
            this.modalTemplate.find('#shell-command').on('keypress', e => {
                if (e.which === 13)
                    this._evaluateCommand();
            });
            $('body').append(this.modalTemplate);
        },
        _handleMouseDown: function handle_mousedown(e) {
            window.my_dragging = {};
            my_dragging.pageX0 = e.pageX;
            my_dragging.pageY0 = e.pageY;
            my_dragging.elem = this.parentElement;
            my_dragging.offset0 = $(this.parentElement).offset();

            function handle_dragging(e) {
                var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
                $(my_dragging.elem)
                    .offset({top: top, left: left});
            }

            function handle_mouseup(e) {
                $('body')
                    .off('mousemove', handle_dragging)
                    .off('mouseup', handle_mouseup);
            }

            $('body').on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
        },
        _handleCloseShell: function () {
            $('#odoo-shell').remove();
        },
        _evaluateCommand: async function () {
            let command = $('#shell-command').val();
            let type = $('#shell-type').val();
            let params = this._getCurrentLocationParams();
            const result = await this._rpc({
                model: 'ir.model',
                method: 'evaluate_command',
                args: [params.model, parseInt(params.id), command,type],
            });
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


        },
        _getCurrentLocationParams() {
            let paramsList = document.location.href.split('#')[1].split('&');
            var paramsDict = {};
            for (let item of paramsList) {
                let splitedItem = item.split('=');
                paramsDict = {...paramsDict, [splitedItem[0]]: splitedItem[1]}
            }
            return paramsDict
        }
    })

    SystrayMenu.Items.push(OdooShell);
    return OdooShell;
});