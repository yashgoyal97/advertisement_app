import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/iron-icons/iron-icons.js';
import 'highcharts-chart/highcharts-chart.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@fooloomanzoo/datetime-picker/datetime-picker.js';
import '@polymer/paper-toast/paper-toast.js';
import './shared/app-loader.js';


class ManagerPage extends PolymerElement {
    static get template() {
        return html`
<style>
    .container{
        display:grid;
        grid-template-rows:80px auto;
        grid-template-columns:1fr;
        grid-template-areas:"header" "main" "footer";
        grid-gap:2px;
        background-color:rgba(255,255,255,0.9);
        background-size:cover;
    }
    header{
        grid-area:header;
        background-color:rgba(0,0,0,0.8);
        color:white;
        display:grid;
        grid-template-rows:1fr;
        grid-template-columns:1fr 1fr 1fr;
        grid-template-areas:"empty logo homepage";
        padding:5px;
    }
    #logo{
        grid-area: logo;
    }
    main{
        grid-area:main;
        display:flex;
        flex-direction:column;
    }
    #goToHomeBtn{
        grid-area:homepage;
    }
    td{
        padding:15px;
    }
    tr:nth-child(even){
        background-color:rgba(0,0,0,0.4);
        color:white;
    }

    #openBookSlotBtn{
        background-color:black;
        color:white;
    }
    #bookSlotBtn{
        background-color:black;
        color:white;
    }
    #bookSlotDialog{
        display:grid;
        grid-template-rows:80px auto;
        grid-template-columns:100%;
        grid-template-areas:"dialogHeader" "dialogContent";
        padding:10px;
        border-radius:5px;
        position:relative;
        bottom:220px;
    }
    #dialogHeader{
        grid-area:dialogHeader;
        border-bottom:2px solid rgba(0,0,0,0.3);
    }
    #dialogContent{
        grid-area:dialogContent;
        display:grid;
        grid-template-rows:1fr;
        grid-template-columns:4fr 6fr;
        grid-template-areas:"contentHeader contentBody";
        grid-gap:5px;
        padding:10px;
        border-radius:5px;
    }
    #toastBook{
        background-color:green;
        color:white;
    }
    #contentHeader{
        grid-area:contentHeader;
        display: grid;
        grid-template-rows: 100px 1fr 1fr;
        grid-template-columns: 1fr 1f;
        grid-template-areas: "first first" "second third" "second third";
        padding:10px;
        border-radius:5px;
    }
    #contentBody{
        grid-area:contentBody;
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
    #addRow{
        background-color:whitesmoke;
        color:black;
    }
    #book{
        margin-top:10px;
        background-color:black;
        color:white;
        width:100px;
    }
    #add{
        background-color:blue;
        color:white;
    }
    #timeSlotPosition{
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        width:180px;
    }
    #slotTime{
        margin:2px 20px 2px 0px;
    }
    #errToast{
        height:60px;
        width:300px;
        font-size: x-large;
        background-color:rgba(255,50,50,0.9);
    }
    thead>tr{
        background-color:whitesmoke;
        color:black;
    }
</style>
<div class="container">
    <header>
    <div id="logo"><h2>WideBroadcast<iron-icon icon="settings-input-antenna"></iron-icon></h2></div>
        <paper-button id="goToHomeBtn" on-click="_handleLogout">LOGOUT<iron-icon icon='settings-power'></iron-icon></paper-button>
    </header>
    <main>
        <table>
            <thead>
                <tr>
                    <td>Programme Name</td>
                    <td>Plan Type</td>
                    <td>Price</td>
                    <td>Date</td>
                    <td>Book<td>
                </tr>
            </thead>
            <tbody>
                <template is="dom-repeat" items="{{availableSlots}}">
                    <tr>
                        <td>{{item.programName}}</td>
                        <td>{{item.plantype}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.slotDate}}</td>    
                        <td><paper-button id="openBookSlotBtn" name="openBookSlotBtn" on-click="_handleOpenSlotDialog" raised>Book Slot</paper-button></td>
                    </tr>
                </template>
            </tbody>
        </table> 
        <paper-toast id="toastBook" text="Slot booked successfully!!"></paper-toast>      
    </main>
    <paper-dialog id="bookSlotDialog" name="bookSlotDialog">
        <div id="dialogHeader">
            <h2 style="color:blue;">Book Slots</h2>
        </div>
        <div id="dialogContent">
            <div id="contentHeader">
                <div id="first">
                    <h2>Pragramme Name: <span id="blue">{{selectedSlot.programName}}</span></h2>
                </div>
                <div id="second">
                    <h3>Slot Date: <span id="blue">{{selectedSlot.slotDate}}</span></h3>
                    <br>
                    <h3>Time Slots:</h3>
                    <div id="timeSlotPosition">
                        <template is="dom-repeat" items="{{allSlots}}">
                                <h4 id="slotTime">{{item.availableTime}}</h4>
                        </template>
                    </div>
                </div>
                <div id="third">
                    <h3>Plan Type: <span id="blue">{{selectedSlot.plantype}}</span></h3>
                    <h3>Price: <span id="blue"> Rs.{{selectedSlot.price}}/sec</span></h3>
                </div>
            </div>
            <div id="contentBody">
                <table>
                    <thead>
                        <tr>
                            <td>Customer Name</td>
                            <td>From Time</td>
                            <td>To Time</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        <template is="dom-repeat" items="{{bookedSlots}}">
                            <tr>
                                <td>{{item.customerName}}</td>
                                <td>{{item.fromTime}}</td>
                                <td>{{item.toTime}}</td>   
                                <td><paper-button id="deleteBtn" name="deleteBtn" on-click="_handleDeleteThisSlot" data-set$="{{index}}"><iron-icon icon="delete"></icon-icon></paper-button></td>
                            </tr>
                        </template>
                        <tr id="addRow">
                            <td>
                                <paper-input id='customerName' name='customerName' label='Customer Name' allowed-pattern="[a-zA-Z]" required></paper-input>
                            </td>
                            <td>
                                <datetime-picker value={{}}  id="fromDateTime" auto-confirm datetime="{{min}}" max="{{max}}" date="{{fromDate}}" time="{{fromTime}}" required></datetime-picker>
                            </td>
                            <td>
                                <datetime-picker value={{}} id="toDateTime" auto-confirm datetime="{{max}}" min="{{min}}" date="{{toDate}}" time="{{toTime}}" required></datetime-picker>
                            </td>
                            <td>
                                <paper-button id="add" name="add" raised on-click="_handleAddSlot"><iron-icon icon="add"></iron-icon></paper-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <paper-button id="book" name="book" raised on-click="_handleBookSlot">Book</paper-button>
            </div>
        </div>
    </paper-dialog>
</div>
<app-loader loading={{loading}}></app-loader>
<paper-toast id="errToast" text="Slot selection invalid!!"></paper-toast>
<iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>
`;
    }

    /**
     * All the properties used in this particular page are defined here.
     * Every property is defined with their type and some default value.
     */
    static get properties() {
        return {
            userId: {
                type: Number,
                value: this.userId,
                observer: '_userIdChanged'
            },
            action: {
                type: String,
                value: 'getSlots'
            },
            availableSlots: {
                type: Array,
                value: []
            },
            selectedSlot: {
                type: Object,
                value: {}
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
            salesManagerId:{
                type:Number,
                value:0
            },
            allSlots: {
                type: Array,
                value: []
            },
            bookedSlots: {
                type: Array,
                value: []
            },
            timeSlots: {
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
     * To open dialog box for booking the slots.
     * @param {Object} event 
     */
    _handleOpenSlotDialog(event) {
        console.log(event.model.item);
        this.selectedSlot = event.model.item;
        this.allSlots = this.selectedSlot.timeShots;
        console.log(this.allSlots, "123");
        this.fromDate = this.selectedSlot.slotDate;
        this.$.fromDateTime.min = this.selectedSlot.slotDate;
        this.$.bookSlotDialog.open();
    }
    /**
     * This button is to select a particular slot.
     * we can add multiple slots here.
     */
    _handleAddSlot() {
        if (this.$.customerName.validate() && this.$.fromDateTime.validate() && this.$.toDateTime.validate()) {
            let fromNewTime = this.fromTime.slice(0, 8);
            let toNewTime = this.toTime.slice(0, 8);
            let fromDateTime = this.fromDate + "T" + fromNewTime;
            let toDateTime = this.toDate + "T" + toNewTime;
            let id = Math.floor((Math.random() * 100) + 1);
            console.log(id, "id");
            let addSlotObj = { id: id, fromTime: fromNewTime, toTime: toNewTime, fromDateTime: fromDateTime, toDateTime: toDateTime, customerName: this.$.customerName.value };
            this.push('bookedSlots', addSlotObj);
            this.$.customerName.value = "";
            this.$.fromDateTime.value = "";
            this.$.toDateTime.value = "";
        }
    }

    /**
     * This button is to delete the slots added by a sales person in order to modify their slots choosed.
     * @param {Object} event 
     */
    _handleDeleteThisSlot(event) {
        //uniId = event.model.item.id;
        //bookedSlots.filter(item, index=> item.id == uniId)
        let index = parseInt(event.model.index);
        this.splice('bookedSlots', index, 1);
    }

    /**
     * to book the slots selected by the sales manager
     */
    _handleBookSlot() {
        for (let i = 0; i < this.bookedSlots.length; i++) {
            let obj = { fromDateTime: this.bookedSlots[i].fromDateTime, toDateTime: this.bookedSlots[i].toDateTime, customerName: this.bookedSlots[i].customerName };
            this.push('timeSlots', obj);
        }
        let bookObj = { timeSlots: this.timeSlots };
        this.action = 'bookSlot';
        this.loading = true;
         this.bookedSlots=[];
        this._makeAjax(`${rBaseUrl}/widebroadcast/users/${this.salesManagerId}/slots`, 'post', bookObj);
    }

        /**
         *executes when element is connected to DOM.
         */
    connectedCallback() {
        super.connectedCallback();
        this.action = 'getSlots'
        this.loading = true;
        this._makeAjax(`${aBaseUrl}/widebroadcast/slots/available`, 'get', null);
    }

    /**
     * Executes on sales manager login
     * @param {Number} newVal 
     */
    _userIdChanged(newVal) {
        this.salesManagerId = newVal;
        console.log(this.salesManagerId, "one")
        this.action = 'getSlots';
        this.loading = true;
        this._makeAjax(`${aBaseUrl}/widebroadcast/slots/available`, 'get', null);
    }

        /**
         * handles the response of every ajax call
         * @param {Object} event 
         */
    _handleResponse(event) {
        this.loading = false;
        switch (this.action) {
            case 'getSlots':
                console.log(event.detail.response.slots, "yash");
                this.availableSlots = event.detail.response.slots;
                break;
            case 'bookSlot':
                console.log(event.detail.response);
                if (event.detail.response.statusCode === 200) {
                     this.timeSlots=[];
                    this.$.toastBook.open();
                    this.connectedCallback();
                    this.$.bookSlotDialog.close();
                }
                break;
            default: break;
        }
    }

        /**
         * handles the errors
         * @param {Object} event 
         */
    _handleError(event) {
        this.loading = false;
        if (event.detail.request.status === 409) {
            this.$.errToast.open();
        }
    }

    /**
     * to logout the current user logged in
     */
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


window.customElements.define('manager-page', ManagerPage);
