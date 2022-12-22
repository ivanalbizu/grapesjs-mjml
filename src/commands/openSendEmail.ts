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
      const response = {};

      //eliminamos los errores si los hubiera 
      document.getElementById("inputHtml").value =editor.Commands.run(cmdGetMjmlToHtml).html.trim();
      formData = document.querySelectorAll('#form-data [name]');
      formData.forEach((el, index) => {
        data[formData[index].name] = el.value;
      });

      const emailMessage = markupEmail.querySelector('#emailMessage');
      const emailSubject = markupSubject.querySelector('#emailSubject');
      if (data.email === "") {
        markupEmail.classList.add('has-error');
        emailMessage.innerHTML = 'Campo email incorrecto';
      } else {
        markupEmail.classList.remove('has-error');
        emailMessage.innerHTML = '';
      }
      if (data.subject === "") {
        markupSubject.classList.add('has-error');
        emailSubject.innerHTML = 'Campo subject incorrecto';
      } else {
        markupSubject.classList.remove('has-error');
        emailSubject.innerHTML = '';
      }
      if (typeof sendEmail === 'function' && data.email !== "" && data.subject !== "" && data.inputHtml !=="") {
        sendEmail(data).then(function(response) {
          if (response.success === true) {
            let toast = document.querySelector("#toast");
            toast?.classList.add('show');
            toast?.innerHTML = 'Newsletter enviada correctamente';
            setTimeout(function() {
              toast?.classList.remove('show');
              toast.className = toast.className.replace("show", "");
            }, 5000);
            formData.forEach((el) => {
              el.value = '';
            });
            editor.Modal.close();
          } else {
            let statusEmail = response?.payload?.errors?.email !== undefined;
            let statusSubject = response?.payload?.errors?.subject !== undefined;
            if (statusEmail) {
              markupEmail.classList.add('has-error');
              const emailMessage = markupEmail.querySelector('#emailMessage');
              emailMessage.innerHTML = 'Campo email incorrecto';
            }
            if (statusSubject) {
              markupSubject.classList.add('has-error');
              const emailSubject = markupSubject.querySelector('#emailSubject');
              emailSubject.innerHTML = 'Campo subject incorrecto';
            }
          }
        });
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
        btnEl.id = "sendMail";
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
      editor.Commands.run(cmdGetMjmlToHtml).html.trim()
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
