// productDetails.js
// import { LightningElement, api, wire, track } from 'lwc';
// import { ProductAdapter } from 'commerce/productApi';

// export default class ProductDetails extends LightningElement {
//     @api productId;
//     @track product = {};
//     @track activeSection = {}; // Only one section stays open

//     @wire(ProductAdapter, { productId: '$productId' })
//     wiredProduct({ error, data }) {
//         if (data) {
//             console.log('API Response:', JSON.stringify(data, null, 2));
//             this.product = {
//                 name: data.fields?.Name || 'Unknown Product',
//                 features: this.formatList(data.fields?.Features__c),
//                 applications: this.formatList(data.fields?.Application__c),
//                 specifications: this.formatList(data.fields?.Specifications__c),
//                 alternativeIdentifiers: this.formatList(data.fields?.Alternative_Identifiers__c)
//             };
//         } else if (error) {
//             console.error('Error fetching product data:', error);
//         }
//     }

//     formatList(value) {
//         return value ? value.split(',').map(item => item.trim()) : [];
//     }

//     handleSectionClick(event) {
//         const clickedSection = event.currentTarget.dataset.section;
//         this.activeSection = { [clickedSection]: !this.activeSection[clickedSection] };
//     }
// }


import { LightningElement, api, wire, track } from 'lwc';
import { ProductAdapter } from 'commerce/productApi';

export default class ProductDetails extends LightningElement {
    @api productId; // We'll grab the product ID from outside

    // Product fields from custom fields, stored as arrays
    @track product = {
        features: [],
        applications: [],
        specifications: [],
        alternativeIdentifiers: []
    };

    // Only one section open at a time; activeSection is a string
    @track activeSection = '';// Keeps track of which section (features, applications, etc.) is currently open.

    // Fetch product data from Storefront API
    @wire(ProductAdapter, { productId: '$productId' })
    loadProduct({ error, data }) {
        if (data) {
            console.log('API Response:', JSON.stringify(data, null, 2));
            const fields = data.fields || {};

            // Convert comma-separated fields into arrays
            this.product.features = this.formatList(fields.Features__c);
            if (this.product.features.length == 0) {
                this.product.features = false;
            } 
            this.product.applications = this.formatList(fields.Application__c);
            if (this.product.applications.length == 0) {
                this.product.applications = false;
            }
            this.product.specifications = this.formatList(fields.Specifications__c);
            if (this.product.specifications.length == 0) {
                this.product.specifications = false;
            }
            this.product.alternativeIdentifiers = this.formatList(fields.Alternative_Identifiers__c);
            if (this.product.alternativeIdentifiers.length == 0) {
                this.product.alternativeIdentifiers = false;
            }
        } else if (error) {
            console.error('Error fetching product data:', error);
        }
    }

    // Splits a comma-separated string into an array
    formatList(value) {
        return value ? value.split(',').map(item => item.trim()) : [];//The map() function is used to transform each element in an array. In this case, we use it to remove extra spaces from each item in the array.
    }

    // Clicking a header toggles open/close. If the same section is open, close it; otherwise, open the new one.
    handleSectionClick(event) {
        const clicked = event.currentTarget.dataset.section;
        this.activeSection = (this.activeSection === clicked) ? '' : clicked;
    }

    // Getter functions for conditional rendering in HTML //determine which section is currently active.
    get isFeaturesActive() {
        return this.activeSection === 'features';
    }
    get isApplicationsActive() {
        return this.activeSection === 'applications';
    }
    get isSpecificationsActive() {
        return this.activeSection === 'specifications';
    }
    get isAlternativeIdentifiersActive() {
        return this.activeSection === 'alternativeIdentifiers';
    }

    // Dynamic classes to highlight the active section
    get features() {
        return this.isFeaturesActive ? 'accordion-header active' : 'accordion-header';
    }
    get applications() {
        return this.isApplicationsActive ? 'accordion-header active' : 'accordion-header';
    }
    get specifications() {
        return this.isSpecificationsActive ? 'accordion-header active' : 'accordion-header';
    }
    get alternativeIdentifiers() {
        return this.isAlternativeIdentifiersActive ? 'accordion-header active' : 'accordion-header';
    }
}



//Can We Remove @track?
// Yes! Modern LWC automatically tracks object properties.
