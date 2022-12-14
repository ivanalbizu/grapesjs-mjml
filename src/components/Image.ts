// Specs: https://documentation.mjml.io/#mj-image
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeSection } from './Section';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';

export const type = 'mj-image';

export default (
  editor: grapesjs.Editor,
  { coreMjmlModel, coreMjmlView }: any
) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',
    model: {
      ...coreMjmlModel,
      defaults: {
        resizable: false,
        highlightable: false,
        name: getName(editor, 'image'),
        draggable: componentsToQuery([typeSection, typeColumn, typeHero]),
        stylable: [
          'width',
          'height',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'container-background-color',
          'align',
        ],
        'style-default': {
          'padding-top': '0',
          'padding-bottom': '0',
          'padding-right': '0',
          'padding-left': '0',
          align: 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: false,
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style:
          'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body width="auto"><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};
