import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/paper-progress/paper-progress.js';
class AppLoader extends PolymerElement {
    static get template() {
        return html`
        <style>
      
        paper-progress.slow {
            --paper-progress-active-color: var(--paper-red-500);
            --paper-progress-secondary-color: var(--paper-blue-100);
            --paper-progress-indeterminate-cycle-duration: 50s;
            margin:0px;
            padding:0px;
            width:100%;
          }
        </style>
        <template is="dom-if" if="{{loading}}">
        <paper-progress  indeterminate class="slow"></paper-progress>
    </template>
        `;
    }
}
window.customElements.define('app-loader', AppLoader);