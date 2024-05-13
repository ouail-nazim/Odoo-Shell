/** @odoo-module **/

import { ShellMenuContainer } from '@odoo_shell/components/container/container';

import { registry } from '@web/core/registry';

const systrayRegistry = registry.category('systray');

export const systrayService = {
    dependencies: ['messaging'],
    start() {
        systrayRegistry.add('odoo_shell.ShellMenu', { Component: ShellMenuContainer }, { sequence: 230 });
    },
};
