import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-toast/paper-toast.js';
import './shared/app-loader.js';



class LoginPage extends PolymerElement {
    static get template() {
        return html`

            <style>
            .container{
                display:grid;
                grid-template-rows:80px auto;
                grid-template-columns:1fr;
                grid-template-areas:"header" "main" "footer";
                grid-gap:2px;
            }
            header{
                grid-area:header;
                background-color:rgba(0,0,0,0.6);
                color:white;
                display:grid;
                grid-template-rows:1fr;
                grid-template-columns:1fr 1fr 1fr;
                grid-template-areas:"empty logo";
                padding:5px;
            }
            #logo{
                grid-area: logo;
            }
            main{
                grid-area:main;
                display:grid;
                grid-template-rows:1fr;
                grid-template-columns:1fr 1fr 1fr;
                grid-template-areas:"empty1 form";
            }
            #toast0{
                background-color:red;
            }
            #loginForm{
                margin-top:120px;
                grid-area:form;
                background-color: rgba(255,255,255,0.9);
                border-radius:5px;
                padding: 20px;
            }
            h1{
                text-align: center;
                margin:0px;
            }
            #loginButton{
                background-color: rgba(0,50,255,0.6);
                color: white;
                margin-top: 20px;
            }
            #loginFields{
                display: flex;
                flex-direction: column;
            }
            #toast2{
                background-color:green;
                color:white;
            }
            </style>
            <app-location route="{{route}}"></app-location>
            <div id="container">
                <header>
                    <div id="logo"><h2>WideBroadcast<iron-icon icon="settings-input-antenna"></iron-icon></h2></div>
                </header>
                <main>
                    <iron-form id='loginForm'>
                        <form>
                            <div id='loginFields'>
                                <h1>Login</h1>
                                <paper-input id='username' name='username' label='Enter Phone No' allowed-pattern="[0-9]" maxlength="10" minlength="10" required><iron-icon icon='perm-identity' slot='suffix'></iron-icon></paper-input>
                                <paper-input id='password' name='password' label='Enter Password' type='password' required ><iron-icon icon='lock' slot='suffix'></iron-icon></paper-input>
                                <paper-button name='loginButton' id='loginButton' on-click='_handleLogin' raised>Login</paper-button>                
                            </div>
                        </form>
                    </iron-form>
                </main>
            </div>
            <app-loader loading={{loading}}></app-loader>   
            <paper-toast id='toast0' text='Invalid Credentials'></paper-toast>
            <paper-toast id='toast1' text='Connection Error'></paper-toast>
            <paper-toast id='toast2' text='Logged In successfully!!!'></paper-toast>

            <iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>
        `;
    }
    /**
     * Properties used here are defined here with some respective default value.
     */
    static get properties() {
        return {
            loggedInUser: {
                type: Array,
                value: []
            },
            action: {
                type: String,
                value: 'list'
            },
            loading:{
                type:Boolean,
                value:false
            }
        };
    }



    /**
     *  Log In validations are implemented here
     *  validates if the user exist and logs in to the user portal
     */
    _handleLogin() {
        if (this.$.loginForm.validate()) {
            let loginPostObj = { phoneNumber: parseInt(this.$.username.value), password: this.$.password.value };
            this.action = 'list';
            this.loading=true;
            this._makeAjax(`${gBaseUrl}/widebroadcast/login`, 'post', loginPostObj);
        }
    }



    /**
     * @param {*} event 
     * handling the response for the ajax request made
     */
    _handleResponse(event) {
        this.loading=false;
        switch (this.action) {
            case 'list':
                this.loggedInUser = event.detail.response;
                /**
                 * if the successful response is returned
                 */
                if (this.loggedInUser.statusCode === 200) {
                    let userId = this.loggedInUser.userId;
                    sessionStorage.setItem('userId', userId);
                    if (this.loggedInUser.role === "ADMIN") {
                        console.log(this.loggedInUser.role);
                        this.dispatchEvent(new CustomEvent('refresh-admin', { detail: { item: userId }, bubbles: true, composed: true }));
                        window.history.pushState({}, null, '#/admin');
                        window.dispatchEvent(new CustomEvent('location-changed'));
                    }
                    if (this.loggedInUser.role === "SALESMANAGER") {
                        console.log(this.loggedInUser.role);
                        this.dispatchEvent(new CustomEvent('refresh-sales', { detail: { item: userId }, bubbles: true, composed: true }));
                        window.history.pushState({}, null, '#/manager');
                        window.dispatchEvent(new CustomEvent('location-changed'));
                    }
                }

                /**
                 * handling the exception
                 */
                else {

                    this.$.toast0.open();
                }
                break;
            default: break;
        }
    }

    /**
     * handling error
     */
    
     Error() {
        this.$.toast1.open();
        this.loading=false;
    }

    /**
     * 
     * @param {String} url to make the API call to the server
     * @param {String} method specifies either to 'Get' or 'Post'
     * @param {Object} postObj Object we are posting to the server
     */
    _makeAjax(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}
window.customElements.define('login-page', LoginPage);