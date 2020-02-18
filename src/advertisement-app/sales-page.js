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

class SalesPage extends PolymerElement {
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
        background-color:gray;
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
        grid-template-rows:1fr 3fr;
        grid-template-columns:1fr 1fr;
        grid-template-areas:"slotHead slotHead" "one two";
        padding:10px;
        border-radius:5px;
        position:relative;
        bottom:220px;
        width:600px;
    }
    #slotHead{
        grid-area:slotHead;
        border-bottom:2px solid rgba(0,0,0,0.2)
    }
    #one{
        grid-area:one;
        padding:10px;
    }
    #two{
        grid-area:two;
        background-color:rgba(0,0,0,0.2);
        border-radius:5px;
        padding:10px;
    }
    h3{
        margin:0px;
    }
    #toastBook{
        background-color:green;
        color:white;
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
        <div id="slotHead">
            <h2>Book Slot</h3>
        </div>
        <div id="one">
            <h3>Programme Name:{{selectedSlot.programName}}</h3>
            <h4>Plan type:{{selectedSlot.plantype}}</h4>
            <h4>Price:Rs. {{selectedSlot.price}}/sec</h4>
            <h4>Date:{{selectedSlot.slotDate}}</h4>
            <h3>Time Slots:</h3>
            <template is="dom-repeat" items="{{allSlots}}">
                <h4>{{item.availableTime}}</h4>
            </template>
        </div>
        <div id="two">
            <h4>Select From Date Time</h4>
            <datetime-picker value={{}}  id="fromDateTime" auto-confirm datetime="{{min}}" max="{{max}}" date="{{fromDate}}" time="{{fromTime}}" ></datetime-picker>
            <br>
            <h4>Select To Date Time</h4>
            <datetime-picker value={{}} id="toDateTime" auto-confirm datetime="{{max}}" min="{{min}}" date="{{toDate}}" time="{{toTime}}" ></datetime-picker>
            <br>
            <hr>
            <paper-button id="bookSlotBtn" name="bookSlotBtn" on-click="_handleBookSlot" raised>Book</paper-button>
        </div>
    </paper-dialog>
</div>
<app-loader loading={{loading}}></app-loader>
<paper-toast id="errToast" text="Slot not available!!"></paper-toast>
<iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>
`;
    }

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
            salesManagerId: Number,
            allSlots:{
                type:Array,
                value:[]
            },
            loading:{
                type:Boolean,
                value:false
            }
        }
    }

    _handleOpenSlotDialog(event) {
        console.log(event.model.item);
        this.selectedSlot = event.model.item;
        this.allSlots=this.selectedSlot.timeShots;
        console.log(this.allSlots,"123")
        this.$.bookSlotDialog.open();
    }

    _handleBookSlot() {
        let fromNewTime = this.fromTime.slice(0, 8);
        let toNewTime = this.toTime.slice(0, 8);
        let fromDateTime = this.fromDate + "T" + fromNewTime;
        let toDateTime = this.toDate + "T" + toNewTime;
        let bookObj = { fromDateTime: fromDateTime, toDateTime: toDateTime };
        console.log(bookObj,"345");
        this.action = 'bookSlot';
        console.log(this.salesManagerId,"two");
        this.loading=true;
        this._makeAjax(`${rBaseUrl}/widebroadcast/users/${this.salesManagerId}/slots`,'post',bookObj);
    }

    connectedCallback(){
        super.connectedCallback();
        this.action = 'getSlots'
        this.loading=true;
        this._makeAjax(`${aBaseUrl}/widebroadcast/slots/available`, 'get', null);
    }


    _userIdChanged(newVal) {
        this.salesManagerId = newVal;
        console.log(this.salesManagerId,"one")
        this.loading=true;
        this.action = 'getSlots'
        this._makeAjax(`${aBaseUrl}/widebroadcast/slots/available`, 'get', null);
    }

    _handleResponse(event) {
        this.loading=false;
        switch (this.action) {
            case 'getSlots':
                console.log(event.detail.response.slots, "yash");
                this.availableSlots = event.detail.response.slots;
                break;
            case 'bookSlot':
                console.log(event.detail.response);
                if(event.detail.response.statusCode===200){
                    this.$.toastBook.open();
                    this.connectedCallback();
                    this.$.bookSlotDialog.close();
                }
                break;
            default: break;
        }
    }

    _handleError(event){
        this.loading=false;
        if(event.detail.request.status===409){
            this.$.errToast.open();
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


window.customElements.define('sales-page', SalesPage);