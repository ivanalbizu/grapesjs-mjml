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
  let markupEmail = null;
  let markupSubject = null;
  let markupHtml = null;
  let formData = null;

  const getI18nLabel = (label: string) =>
    editor.I18n.t(`grapesjs-mjml.panels.email.${label}`);

  editor.Commands.add(cmdId, {
    onSend() {
      const data = {};

      // esta data es de ejmplo, construir según interese
      const response = {
        email: {
          status: 'ko',
          message: 'Campo email incorrecto'
        },
        subject: {
          status: 'ko',
          message: 'Campo subject incorrecto'
        }
      }
      formData = document.querySelectorAll('#form-data [name]');
      formData.forEach((el, index) => {
        data[formData[index].name] = el.value;
      });
      console.log(data);
      
      if (typeof sendEmail === 'function') {
        sendEmail(data);
      }

      // se obtienen datos del servidor
      let statusEmail = response?.email?.status === 'ko';
      let statusSubject = response?.subject?.status === 'ko';

      // si algo fue mal, mostramos los errores y el input en rojo
      if (statusEmail || statusSubject) {
        if (statusEmail) {
          markupEmail.classList.add('has-error');
          const emailMessage = markupEmail.querySelector('#emailMessage');
          emailMessage.innerHTML = response?.email?.message
        }
        if (statusSubject) {
          markupSubject.classList.add('has-error');
          const emailSubject = markupSubject.querySelector('#emailSubject');
          emailSubject.innerHTML = response?.subject?.message
        }
      // si todo fue bien, cerramos modal
      } else {
        let toast = document.querySelector("#toast");
        toast?.classList.add('show');
        toast?.innerHTML = 'Texto metido desde JavaScript';

        setTimeout(function() {
          toast?.classList.remove('show');
          toast.className = toast.className.replace("show", "");
        }, 5000);

        formData.forEach((el) => {
          el.value = '';
        });
        editor.Modal.close();
      }
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
      if (document.getElementById("form-data") !== null){
        const el = document.getElementById("form-data");
      } else {
        const el = document.createElement('div');
        el.id = 'form-data';

        const btnEl = document.createElement('button');
        btnEl.innerHTML = getI18nLabel('button');
        btnEl.className = `${pfx}btn-prim ${pfx}btn-import`;
        btnEl.onclick = () => this.onSend();

        markupEmail = this.elFactory(
          'div',
          { class: 'input-group' },
          this.elFactory(
            'label',
            {
              for: 'email'
            },
            getI18nLabel('inputEmail.label')
          ),
          this.elFactory('input', {
            id: 'email',
            name: 'email',
            placeholder: getI18nLabel('inputEmail.placeholder')
          }),
          this.elFactory('div', {
            id: 'emailMessage',
            class: 'ko'
          })
        );

        markupSubject = this.elFactory(
          'div',
          { class: 'input-group' },
          this.elFactory(
            'label',
            {
              for: 'subject'
            },
            getI18nLabel('inputSubject.label')
          ),
          this.elFactory('input', {
            id: 'subject',
            name: 'subject',
            placeholder: getI18nLabel('inputSubject.placeholder')
          }),
          this.elFactory('div', {
            id: 'emailSubject',
            class: 'ko'
          })
        );

        markupHtml = this.elFactory(
          'div',
          {
            class: 'input-group',
            style: 'display:none;'
          },
          this.elFactory(
            'label',
            {
              for: 'inputHtml'
            },
            getI18nLabel('inputHtml.label')
          ),
          this.elFactory(
            'textarea',
            {
              id: 'inputHtml',
              name: 'inputHtml',
              rows: 5,
              disabled: true
            },
            editor.Commands.run(cmdGetMjmlToHtml).html.trim()
          )
        );
  
        el.appendChild(markupEmail);
        el.appendChild(markupSubject);
        el.appendChild(markupHtml);
        el.appendChild(btnEl);
      }

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
