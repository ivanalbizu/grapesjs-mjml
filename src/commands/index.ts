import type grapesjs from 'grapesjs';
import { RequiredPluginOptions } from '..';
import openImportMjml from './openImportMjml';
import openExportMjml from './openExportMjml';
import openSendEmail from './openSendEmail';
import { mjmlConvert } from '../components/utils';

export const cmdDeviceDesktop = 'set-device-desktop';
export const cmdDeviceTablet = 'set-device-tablet';
export const cmdDeviceMobile = 'set-device-mobile';
export const cmdImportMjml = 'mjml-import';
export const cmdExportMjml = 'mjml-export';
export const cmdSendEmail = 'send-email';
export const cmdGetMjml = 'mjml-code';
export const cmdGetMjmlToHtml = 'mjml-code-to-html';

export default (editor: grapesjs.Editor, opts: RequiredPluginOptions) => {
  const { Commands } = editor;
  const cmdOpenExport = opts.overwriteExport ? 'export-template' : cmdExportMjml;

  Commands.add(cmdGetMjml, () => {
    return `${opts.preMjml}${editor.getHtml().replaceAll(new RegExp(/ id="([^"]+)"/g),'')}${opts.postMjml}`;
  });

  Commands.add(cmdGetMjmlToHtml, (ed, _, opt) => {
    const mjml = Commands.run(cmdGetMjml);
    return mjmlConvert(mjml, opts.fonts, opt);
  });

  openExportMjml(editor, opts, cmdOpenExport);
  openImportMjml(editor, opts, cmdImportMjml);
  openSendEmail(editor, opts, cmdSendEmail);

  // Device commands
  Commands.add(cmdDeviceDesktop, {
    run: ed => ed.setDevice('Desktop'),
    stop: () => {},
  });
  Commands.add(cmdDeviceTablet, {
    run: ed => ed.setDevice('Tablet'),
    stop: () => {},
  });
  Commands.add(cmdDeviceMobile, {
    run: ed => ed.setDevice('Mobile portrait'),
    stop: () => {},
  });

};
