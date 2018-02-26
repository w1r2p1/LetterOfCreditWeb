import { Injectable } from '@angular/core';
import { ShepherdService } from './shepherd.service';
import { IShepherdTour } from '../interfaces';

@Injectable()
export class TourService {

  sellerTour: IShepherdTour;
  buyerTour: IShepherdTour;
  issuerTour: IShepherdTour;
  advisingTour: IShepherdTour;
  invoiceGlow: false;

  constructor(private shepherdService: ShepherdService) {

    let defaultOptions = {
      classes: 'shepherd-theme-arrows',
      scrollTo: true,
      showCancelLink: true
    }

    let defaultOptionsNoScroll = {
      classes: 'shepherd-theme-arrows',
      scrollTo: true,
      showCancelLink: true
    }

    this.sellerTour = this.shepherdService.addTour("seller", {
      defaults: defaultOptions
    });
    this.buyerTour = this.shepherdService.addTour("buyer", {
      defaults: defaultOptions
    });
    this.issuerTour = this.shepherdService.addTour("issuer", {
      defaults: defaultOptions
    });
    this.advisingTour = this.shepherdService.addTour("advising", {
      defaults: defaultOptionsNoScroll
    });

    let sellerTour = this.sellerTour;
    let invoiceGlow = this.invoiceGlow;

    /*
    * Seller tour
    */
    this.sellerTour.addStep('welcome1', { text: '<b>Welcome to the Corda Letter of Credit demo</b><br><br> This demonstrates a simplified letter of credit scenario between four nodes<br> A buyer, seller, issuing bank and advising bank.<br><br><img src="assets/tf.jpg" width="800px" height="222px">' })
    this.sellerTour.addStep('welcome2', { text: "<b>The flow between nodes is as follows</b><br><br><img src='assets/flow.jpg' width='900px' height='450px'>" })
    this.sellerTour.addStep('welcome2', { text: "You can find documentation on all the features used <a href='https://docs.corda.net/' class='toura'>here</a>" })
    this.sellerTour.addStep('wallet', { text: 'This is your cash balance', attachTo: '#cash-balance right' })
    this.sellerTour.addStep('orders', { text: 'Here you will find all the sellers orders that have <br> been funded through a letter of credit.', attachTo: '#orders right' })
    this.sellerTour.addStep('invoices', { text: 'Invoices raised that are still awaiting funding appear here', attachTo: '#invoices right' })
    this.sellerTour.addStep('goods', { text: 'Finally, goods shipped are added here', attachTo: '#goods-shipped right' })
    this.sellerTour.addStep('invoice', {
      text: 'Lets begin the demo by creating an invoice to the buyer', attachTo: '#create-invoice top',
      buttons: [{
        text: 'ready', action: function () {
          sellerTour.hide();
          invoiceGlow = true;
        }
      }]
    })
    this.sellerTour.addStep('invoice-created', {
      text: "<b>So what just happened</b>?<br><br>The seller created a new invoice state on Corda and sent this to the buyer node as part of a signed transaction.<br>The buyer, happy with the terms, agrees and signs.<br>This is now stored as a shared fact across both nodes",
      buttons: [{
        text: 'next', action: function () {
          sellerTour.next();
          invoiceGlow = false;
        }
      }]
    })
    this.sellerTour.addStep('status', { text: 'The transaction id you see here is a unique hash of the transaction we just created', attachTo: '#status top' })
    this.sellerTour.addStep('switch1', { text: "Let's switch to the buyer node and see what they see" })
    this.sellerTour.addStep('addDocs1', { text: "Once the products are ready to ship, we add documentation including the electronic bill of lading which also acts as title to the goods and the eletronic packing list", attachTo: '#bol right' })
    this.sellerTour.addStep('addDocs2', { text: "These are created as new states on Corda and shared amongst all participants. The contract for these states dictate that only the named owner on the documentation can change any of the facts", attachTo: '#bol right' })
    this.sellerTour.addStep('ship', { text: "Let's add these now and then mark the products as shipped", attachTo: '#ship bottom' })
    this.sellerTour.addStep('switch1', { text: "All participants can see the documentation and shipping status.<br>Let's switch to the advising node" })

    /*
    * Buyer tour
    */
    this.buyerTour.addStep('invoices', { text: 'The unconsumed invoices in our vault appear here<br><br><img src="assets/vault.jpg" width="400px" height="190px">', attachTo: '#invoices right' })
    this.buyerTour.addStep('applications', { text: 'Applications submitted to the issuing bank but still awaiting approval appear here', attachTo: '#applications right' })
    this.buyerTour.addStep('live', { text: 'Letters of credit approved by the issuing bank appear here', attachTo: '#live right' })
    this.buyerTour.addStep('apply', {
      text: "Let's apply for a letter of credit with the issuing bank", attachTo: '.action-img right',
      buttons: [{ text: 'ready', action: this.buyerTour.hide }]
    })
    this.buyerTour.addStep('application-created', { text: "So what just happened?<br>The buyer created a new linear state on Corda representing the letter of credit application and sent this to the issuing bank node." })
    this.buyerTour.addStep('application-created', { text: "Let's switch to the issuing bank node and see what they see." })

    /*
    * Advising tour
    */
    this.advisingTour.addStep('live', { text: 'These are the live orders funded by a letter of credit that this bank is party to', attachTo: '#loc right' });
    this.advisingTour.addStep('action1', { text: 'Once the key documents have been added, the onus is on the advising bank to pay the beneficiary<br>We can check the status by clicking the relevent action', attachTo: '.action bottom' });
    this.advisingTour.addStep('inspect', { text: "Let's inspect the documents that have been added beginning with the Bill of Lading" });
    this.advisingTour.addStep('title', { text: "Here we see the seller still has title to the goods" });
    this.advisingTour.addStep('action1', { text: 'Once the key documents have been added, the onus is on the advising bank to pay the beneficiary<br>We can check the status by clicking the relevent action' });


    /*
    * Issuer tour
    */
    this.issuerTour.addStep('active', { text: 'All letters of credit approved can be found here', attachTo: '#active right' });
    this.issuerTour.addStep('awaiting', { text: 'Letters of credit that are still awaiting approval can be found here', attachTo: '#awaiting right' });
    this.issuerTour.addStep('approve', { text: "Let's go ahead and approve the letter of credit application we currently have",   buttons: [{ text: 'ready', action: this.issuerTour.hide }]});
    this.issuerTour.addStep('application-created', { text: "So what just happened?<br>The issuing bank created a new state that is a copy of the previous state but in an approved state. This is because on Corda states are immutable and the previous unapproved state is used as an input into the transaction creating the new state leaving behind an audit trail.<br>" +
    "These states are only shared between the buyer and issuing bank, no other nodes see these states. After approving the application, the issuing node creates a new state that represents a live Letter of Credit and shares this with all participants in the scenario" })
    this.issuerTour.addStep('switch', { text: "Let's switch to the issuing bank node and see what they see." })
  }
}
