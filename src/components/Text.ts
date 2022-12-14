// Specs: https://documentation.mjml.io/#mjml-text
import type grapesjs from 'grapesjs';
import { componentsToQuery, getName, isComponentType } from './utils';
import { type as typeColumn } from './Column';
import { type as typeHero } from './Hero';

export const type = 'mj-text';

export default (
  editor: grapesjs.Editor,
  { coreMjmlModel, coreMjmlView }: any
) => {
  editor.Components.addType(type, {
    extend: 'text',
    extendFnView: ['onActive'],
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: getName(editor, 'text'),
        draggable: componentsToQuery([typeColumn, typeHero]),
        highlightable: false,
        stylable: [
          'height',
          'font-style',
          'font-size',
          'font-weight',
          'font-family',
          'color',
          'line-height',
          'letter-spacing',
          'text-decoration',
          'align',
          'text-transform',
          'padding',
          'padding-top',
          'padding-left',
          'padding-right',
          'padding-bottom',
          'container-background-color',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '0',
          'padding-left': '0',
          'font-family': 'Helvetica,Arial,sans-serif',
          'font-size': '16px',
          'line-height': '18px',
          align: 'left',
        },
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%',
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
        return 'td > div';
      },

      /**
       * Prevent content repeating
       */
      rerender() {
        this.render();
      },

      /**
       * Need to make text selectable.
       */
      onActive() {
        this.getChildrenContainer().style.pointerEvents = 'all';
      },
    },
  });
};
