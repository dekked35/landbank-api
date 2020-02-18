var Village = require('../model/village');
var Townhouse = require('../model/townhouse');
var Condo = require('../model/condo');
var Hotel = require('../model/hotel');
var CommunityMall = require('../model/communitymall');

class PropertyManager{
    constructor(){
        this.property = "";
    }

    setProperty(propertyType){
        if(propertyType === "village"){
            this.property = new Village();
        } else if (propertyType === "townhouse"){
            this.property = new Townhouse();
        } else if (propertyType === "condo"){
            this.property = new Condo();
        } else if (propertyType === "hotel"){
            this.property = new Hotel();
        } else if (propertyType === "community mall"){
            this.property = new CommunityMall();
        } else {
            this.property = null;
        }
    }

    getArea(property){
        const area = this.property.area(property);
        return JSON.parse(JSON.stringify({ area : area }));
    }

    getProduct(property){
        const product = this.property.product(property);
        return JSON.parse(JSON.stringify({ product : product }));
    }

    getAllSpendings(property){
        const spendings = this.property.spendings(property);
        return JSON.parse(JSON.stringify({ spendings : spendings}));
    }

    getImplicitCosts(property){
        const implicitCosts = this.property.implicitCosts(property);
        return JSON.parse(JSON.stringify({ implicitCosts : implicitCosts }));
    }

    getProfit(property){
        const profit = this.property.profit(property);
        return JSON.parse(JSON.stringify({ profit : profit }));
    }


}

module.exports = PropertyManager;