// Specs: https://documentation.mjml.io/#mj-button
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';

export const type = 'mj-button';

export default (
  editor: grapesjs.Editor,
  { coreMjmlModel, coreMjmlView }: any
) => {
  editor.Components.addType(type, {
    isComponent: isComponentType(type),
    extend: 'link',
    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'button'),
        draggable: componentsToQuery([typeColumn, typeHero]),
        highlightable: false,
        stylable: [
          'background-color',
          'font-style',
          'font-size',
          'font-weight',
          'font-family',
          'color',
          'text-decoration',
          'align',
          'text-transform',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
        ],
        'style-default': {
          'background-color': '#FF7900',
          'font-family': 'Helvetica,Arial,sans-serif',
          'font-size': '16px',
          'line-height': '18px',
          'font-weight': '400',
          color: '#ffffff',
          'vertical-align': 'middle',
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '0',
          'padding-left': '0',
          align: 'center',
        },
        traits: ['href', 'title'],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'display: table; width: 100%',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl: any) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'a,p';
      },

      /**
       * Prevent content repeating
       */
      rerender() {
        this.render();
      },
    },
  });
};
