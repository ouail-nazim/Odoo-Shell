/** @odoo-module **/


import {systrayService} from '@odoo_shell/js/services/systray_odoo_shell';
import {registry} from '@web/core/registry';

const serviceRegistry = registry.category('services');
serviceRegistry.add('shell_systray_service', systrayService);