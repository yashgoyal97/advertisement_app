import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './admin-page.js';

setPassiveTouchGestures(true);
setRootPath(MyAppGlobals.rootPath);
/**
 * @customElement
 * @polymer
 */
class AdvertisementApp extends PolymerElement {
  static get template() {
    return html`
    <app-location route="{{route}}" url-space-regex="^[[rootPath]]" use-hash-as-path></app-location>
    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>     
    <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
      <view404-page name='view404'></view404-page>
      <sales-page name='sales' user-id={{userId}}></sales-page>
      <manager-page name='manager' user-id={{userId}}></manager-page>
      <admin-page name='admin' user-id={{userId}}></admin-page>
      <login-page name='login'></login-page>
    </iron-pages>
    `;
  }
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,
      userId: {
        type: Number,
        value: ""
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  /**
  * 
  * @param {String} page 
  */
  _routePageChanged(page) {
    if (!page) {
      this.page = 'login';
    } else if (['login', 'admin', 'sales', 'manager'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }
  }

  ready() {
    super.ready();
    this.addEventListener('refresh-admin', function (event) {
      this.userId = event.detail.item;
      console.log(this.userId);
    })
    this.addEventListener('refresh-sales', function (event) {
      this.userId = event.detail.item;
    })
  }

  /**
   * 
   * @param {String} page 
   */
  _pageChanged(page) {
    switch (page) {
      case 'login':
        import('./login-page.js');
        break;
      case 'admin':
        import('./admin-page.js');
        break;
      case 'sales':
        import('./sales-page.js');
        break;
      case 'manager':
        import('./manager-page.js');
        break;
      case 'view404':
        import('./view404-page.js');
        break;
    }
  }
}

window.customElements.define('advertisement-app', AdvertisementApp);
