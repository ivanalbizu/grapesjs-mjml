// @ts-nocheck TODO remove this comment with the next grapesjs release
import type grapesjs from 'grapesjs';
import { cmdGetMjmlToHtml } from '.';
import { RequiredPluginOptions } from '..';

export default (
  editor: grapesjs.Editor,
  opts: RequiredPluginOptions,
  cmdId: string
) => {
  const config = editor.getConfig();
  const pfx = config.stylePrefix || '';

  const getI18nLabel = (label: string) =>
    editor.I18n.t(`grapesjs-mjml.panels.email.${label}`);

  editor.Commands.add(cmdId, {
    onSend() {
      const data = {};
      const formData = document.querySelectorAll('#form-data [name]');
      formData.forEach((el, index) => {
        data[formData[index].name] = el.value;
      });
      console.log('data build: ', data);

      if (typeof sendEmail === 'function') {
        sendEmail(data);
      }

      editor.Modal.close();
    },

    elFactory(type, attributes, ...children) {
      const el = document.createElement(type);

      for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
      }

      children.forEach((child) => {
        if (typeof child === 'string')
          el.appendChild(document.createTextNode(child));
        else el.appendChild(child);
      });

      return el;
    },

    createForm() {
      const el = document.createElement('div');
      el.id = 'form-data';

      const btnEl = document.createElement('button');
      btnEl.innerHTML = getI18nLabel('button');
      btnEl.className = `${pfx}btn-prim ${pfx}btn-import`;
      btnEl.onclick = () => this.onSend();

      const markupEmail = this.elFactory(
        'div',
        { class: 'input-group' },
        this.elFactory(
          'label',
          {
            for: 'email',
          },
          getI18nLabel('inputEmail.label')
        ),
        this.elFactory('input', {
          id: 'email',
          name: 'email',
          placeholder: getI18nLabel('inputEmail.placeholder'),
        })
      );
      const markupSubject = this.elFactory(
        'div',
        { class: 'input-group' },
        this.elFactory(
          'label',
          {
            for: 'subject',
          },
          getI18nLabel('inputSubject.label')
        ),
        this.elFactory('input', {
          id: 'subject',
          name: 'subject',
          placeholder: getI18nLabel('inputSubject.placeholder'),
        })
      );
      const markupHtml = this.elFactory(
        'div',
        { class: 'input-group' },
        this.elFactory(
          'label',
          {
            for: 'inputHtml',
          },
          getI18nLabel('inputHtml.label')
        ),
        this.elFactory(
          'textarea',
          {
            id: 'inputHtml',
            name: 'inputHtml',
            rows: 5,
            disabled: true,
          },
          editor.Commands.run(cmdGetMjmlToHtml).html.trim()
        )
      );

      el.appendChild(markupEmail);
      el.appendChild(markupSubject);
      el.appendChild(markupHtml);
      el.appendChild(btnEl);

      return el;
    },

    run(editor, sender = {}) {
      const container = this.createForm();

      editor.Modal.open({
        title: getI18nLabel('title'),
        content: container,
      }).onceClose(() => {
        sender.set && sender.set('active', false);
        editor.stopCommand(cmdId);
      });
    },

    stop(editor) {
      editor.Modal.close();
    },
  });
};
