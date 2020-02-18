import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import '@vaadin/vaadin-select/vaadin-select.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-card/paper-card.js';

import './shared/app-loader.js';


/**
* @customElement
* @polymer
*/
class AdminPage extends PolymerElement {
    static get template() {
        return html`
<style>
    .container {
        display: grid;
        grid-template-rows: 80px auto;
        grid-template-columns: 1fr;
        grid-template-areas: "header" "main";
        grid-gap: 2px;
    }
    header {
        grid-area: header;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-areas: "empty empty logo add homepage";
        padding: 5px;
    }
    #addSlot {
        grid-area: add;
    }
    #logo {
        grid-area: logo;
    }
    #slot{
        padding:10px;
        display: flex;
        flex-direction: column;
        width:700px;
        border-radius:5px;
        background-color:whitesmoke;
    }
    main {
        grid-area: main;
        display: flex;
        flex-direction: column;
    }

    #goToHomeBtn {
        grid-area: homepage;
    }
    #updateSlot{
        height:50px;
        background-color:green;
        color:white;
    }
    h4{
        margin:0px;
    }
    datetime-picker{
        margin-top: 0;
        margin-bottom: 10px;
    }
    #addError{
        background-color:red;
    }
    #availableSlots{
        border:2px solid black;
    }
    #blue{
        color:blue;
    }
    #green{
        color:green;
    }
    vaadin-select{
        margin-top:0px;
    }
    #headerDialog{
        display:flex;
        flex-direction:row;
justify-content: space-between;    
align-items:baseline ;
}
    paper-card{
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1f;
        grid-template-areas: "first first" "second third" "second third";
        padding:10px;
        border-radius:5px;
        margin:10px 0px 10px 10px;
    }
    #first{
        grid-area:first;
        border-bottom:2px solid rgba(0,0,0,0.3);
    }
    #second{
        grid-area:second;
    }
    #third{
        grid-area:third;
    }
    #successAdd{
        background-color:green;
        color:white;
    }
    </style>
    <div class="container">
    <header>
    <div id="logo">
    <h2>WideBroadcast<iron-icon icon="settings-input-antenna"></iron-icon>
    </h2>
    </div>
    <paper-button id="addSlot" on-click="_addSlot">Add Slot</paper-button>
    <paper-button id="goToHomeBtn" on-click="_handleLogout">LOGOUT<iron-icon icon='settings-power'></iron-icon>
    </paper-button>
    </header>
    <app-loader loading={{loading}}></app-loader>
 <main>
    <template is="dom-repeat" items={{availableSlots}}>
        <paper-card >
                <div id="first">
                    <h2>Programme Name: <span id="blue">{{item.programmeName}}</span></h2>
                </div>
                <div id="second">
                    <h3>Slot Date: <span id="blue">{{item.slotFromDate}}</span></h3>
                    <h3>Slot From Time:<span id="green"> {{item.slotFromTime}}</span></h3>
                    <h3>Slot To Time: <span id="green">{{item.slotToTime}}</span></h3>
                </div>
                <div id="third">
                    <h3>Plan Type: <span id="blue">{{item.planType}}</span></h3>
                    <h3>Price: <span id="blue"> Rs.{{item.price}}/sec</span></h3>
                </div>
        </paper-card>
    </template>
</main>
    <paper-dialog id="slot">
        <div id="headerDialog" ><h2>Add Slot</h2>
        <paper-button id="close" on-click="_closeDialog" ><iron-icon icon="highlight-off"></iron-icon></paper-button>
        </div>
        <paper-input id="programmeName" name="programmeName" label="Programme Name"></paper-input>
        <br>
            <h4>Select From Date Time</h4>                
            <datetime-picker value={{}} id="fromDateTime" auto-confirm datetime="{{min}}" max="{{max}}" date="{{fromDate}}"
            time="{{fromTime}}" ></datetime-picker>
            <br>
            <h4>Select To Date Time</h4>
            <datetime-picker value={{}}  id="toDateTime" auto-confirm datetime="{{max}}" min="{{min}}" date="{{toDate}}" time="{{toTime}}" ></datetime-picker>
            <br>
            <h4>Choose Plan:</h4>
            <vaadin-select id="planName" placeholder="Select" on-change="_handlePrice">
            <template>
                <vaadin-list-box >
                    <template is="dom-repeat" items={{planDetails}}>
                        <vaadin-item value="{{item.planTypeId}}" >{{item.planTypeName}}</vaadin-item>
                    </template>        
                </vaadin-list-box>
            </template>
        </vaadin-select>
        <h3>Price: Rs.{{price}} /sec</h3>
        <paper-button id="updateSlot" on-click="_updateSlot" raised>Add Slot</paper-button>
    </paper-dialog>
</div>
<paper-toast id="successAdd" text="Slot successfully added"></paper-toast>
<paper-toast id="errToast" text="Slot already exist!!"></paper-toast>
<iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError'
    content-type='application/json'></iron-ajax>
`;
    }
    /**
    * Properties used are defined here with their respective default values.
    */

    static get properties() {
        return {
            userId: {
                type: Number,
                value: this.userId,
                observer: '_userIdChanged'
            },
            fromDate: {
                type: String,
                value: ''
            },
            toDate: {
                type: String,
                value: ''
            },
            toTime: {
                type: String,
                value: ''
            },
            fromTime: {
                type: String,
                value: ''
            },
            action: {
                value: String,
                value: 'Plan'
            },
            planDetails: {
                type: Array,
                value: []
            },
            price: {
                type: Number,
                value: 0
            },
            availableSlots: {
                type: Array,
                value: []
            },
            loading: {
                type: Boolean,
                value: false
            }

        }
    }

        /**
         * to close the add slot dialog box
         */
    _closeDialog() {
        this.$.slot.close();

    }

    /**
     * to open the dialog box to add a slot in available slot list
     */
    _addSlot() {
        this.$.slot.open();
        this.action = 'Plan';
        this.loading = true;
        var today = new Date();
        var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
        this.fromDate = date;
        this.$.fromDateTime.min = date;
        this._makeAjax(`${aBaseUrl}/widebroadcast/plans`, 'get', null);
    }

    /**
     * Add the slot to the server with the field values
     * Date and Time validations are handled 
     */
    _updateSlot() {
        let fromNewTime = this.fromTime.slice(0, 8);
        let toNewTime = this.toTime.slice(0, 8);
        var today = new Date();
        var date = today.getFullYear() + '-0' + (today.getMonth() + 1) + '-' + today.getDate();
        let fromDateTime = this.fromDate + "T" + fromNewTime;
        let toDateTime = this.toDate + "T" + toNewTime;
        console.log(fromDateTime, toDateTime);
        let planObj = { programmeName: this.$.programmeName.value, slotFromDateTime: fromDateTime, slotToDateTime: toDateTime, planTypeId: this.$.planName.value };
        this.action = 'planPost'
        this.loading = true;
        this.$.updateSlot.disabled = true;
        this.$.updateSlot.style.backgroundColor = 'gray';
        this._makeAjax(`${rBaseUrl}/widebroadcast/slots`, 'post', planObj);
    }

    /**
     * rendering the price based on plan type
     */
    _handlePrice() {
        console.log(this.$.planName.value);
        for (let i = 0; i < this.planDetails.length; i++) {
            if (this.planDetails[i].planTypeId === this.$.planName.value) {
                this.price = this.planDetails[i].price;
            }
        }
    }

    _handleError(event) {
        this.loading = false;
        if (event.detail.request.status === 409) {
            this.$.errToast.open();
            this.$.updateSlot.disabled = false;
            this.$.updateSlot.style.backgroundColor = 'green';
        }
    }

    _userIdChanged(newVal) {
        this.action = 'Slots'
        this.loading = true;
        this._makeAjax(`${gBaseUrl}/widebroadcast/slots`, 'get', null);
    }

    connectedCallback() {
        super.connectedCallback();
        this.action = 'Slots';
        this.loading = true;
        this._makeAjax(`${gBaseUrl}/widebroadcast/slots`, 'get', null);
    }


    _handleResponse(event) {
        this.loading = false;
        switch (this.action) {
            case 'Plan':
                this.planDetails = event.detail.response.plans;
                console.log(this.planDetails);
                break;
            case 'Slots':
                this.availableSlots = event.detail.response.slots;
                console.log(this.availableSlots);
                break;
            case 'planPost':
                console.log(event.detail.response);
                if (event.detail.response.statusCode === 200) {
                    this.$.successAdd.open();
                    this._userIdChanged();
                    this.$.toDateTime.value = '';
                    this.$.fromDateTime.value = '';
                    this.$.programmeName.value = '';
                    this.$.planName.value = '';
                    this.$.slot.close();
                    this.$.updateSlot.disabled = false;
                    this.$.updateSlot.style.backgroundColor = 'green';
                }
                break;
        }
    }

    _handleLogout() {
        sessionStorage.clear();
        window.history.pushState({}, null, '#/login');
        window.dispatchEvent(new CustomEvent('location-changed'));
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

window.customElements.define('admin-page', AdminPage);