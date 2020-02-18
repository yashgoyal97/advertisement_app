import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class Error404Page extends PolymerElement {
    static get template() {
        return html`
        <h1>Error 404: Page does not exist</h1>
        `;
    }
}
window.customElements.define('view404-page', Error404Page);