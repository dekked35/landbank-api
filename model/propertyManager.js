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
        return this.property.area(property);
    }

    getProduct(property){
        return this.property.product(property);
    }

    getAllSpendings(property){
        return this.property.spendings(property);
    }

    getImplicitCosts(property){
        return this.property.implicitCosts(property);
    }

    getProfit(property){
        return this.property.profit(property);
    }


}

module.exports = PropertyManager;