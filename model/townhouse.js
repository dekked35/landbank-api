const Util = require("../util/util");
const util = new Util();

class Townhouse{
    constructor(){}

    area(property){
        const areaInput = property.area_input;

        const fenceLength = 3.14 * ((Math.sqrt(areaInput.totalArea * 4)/(22/7))) * 2;
        const sellArea = areaInput.totalArea * 0.65;
        const roadSize = areaInput.totalArea * 0.3;
        const greenArea = areaInput.totalArea * 0.05;
        const area = {
            farValue : areaInput.farValue,
            osrValue : areaInput.osrValue,
            totalArea : areaInput.totalArea,
            fenceLength : fenceLength,
            sellArea : sellArea,
            roadSize : roadSize,
            greenArea : greenArea 
        };

        return area;
    }

    product(property){
        const competitorProduct = this.competitorProduct(property);
        const userProduct = this.userProduct(property);
        const product = {
            competitor : competitorProduct.competitor,
            user : userProduct.user
        }
        return product;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user.products;
        const input = property.product_input.user;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const newProducts = productInput.map(product => JSON.parse(JSON.stringify({
            type : product.type,
            area : product.area,
            stairArea : 2.2 * (input.depth * 0.5),
            cost : product.cost,
            ratio : product.ratio,
            quantity : ((product.ratio/100) * area.totalArea)/(product.area * 4)
        })));

        const newProductsQty = newProducts.map(product => product.quantity).reduce(reducer);
        const totalNewProductPrice = newProducts.map(product => product.quantity * product.cost).reduce(reducer);

        const centralArea = input.depth * input.width;
        const frontArea = input.width * input.frontDepth;
        const behindArea = input.width * input.behindDepth;
        const totalAreaMeter = centralArea + frontArea + behindArea;
        const totalAreaSquare = totalAreaMeter/4;

        const userProduct = {
            user : {
                products: newProducts,
                depth : input.depth,
                width : input.width,
                frontDepth : input.frontDepth,
                behindDepth : input.behindDepth,
                centralArea : centralArea,
                frontArea : frontArea,
                behindArea : behindArea,
                totalAreaMeter : totalAreaMeter,
                totalAreaSquare : totalAreaSquare,
                totalQuantity : newProductsQty,
                totalCost : totalNewProductPrice
            }
        }

        return userProduct;
    }

    competitorProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.competitor.products;
        const input = property.product_input.competitor;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const newProducts = productInput.map(product => JSON.parse(JSON.stringify({
            type : product.type,
            area : product.area,
            stairArea : 2.2 * (input.depth * 0.5),
            cost : product.cost,
            ratio : product.ratio,
            quantity : ((product.ratio/100) * area.totalArea)/(product.area * 4)
        })));

        const newProductsQty = newProducts.map(product => product.quantity).reduce(reducer);
        const totalNewProductPrice = newProducts.map(product => product.quantity * product.cost).reduce(reducer);

        const centralArea = input.depth * input.width;
        const frontArea = input.width * input.frontDepth;
        const behindArea = input.width * input.behindDepth;
        const totalAreaMeter = centralArea + frontArea + behindArea;
        const totalAreaSquare = totalAreaMeter/4;

        const competitorProduct = {
            competitor : {
                products: newProducts,
                depth : input.depth,
                width : input.width,
                frontDepth : input.frontDepth,
                behindDepth : input.behindDepth,
                centralArea : centralArea,
                frontArea : frontArea,
                behindArea : behindArea,
                totalAreaMeter : totalAreaMeter,
                totalAreaSquare : totalAreaSquare,
                totalQuantity : newProductsQty,
                totalCost : totalNewProductPrice
            }
        }

        return competitorProduct;
    }

    spendings(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        const input = property.spendings_input;

        const constructionItems = product.user.products.map(item => JSON.parse(JSON.stringify({
            type : item.type,
            costPerItem : item.area * 9000,
            quantity : item.quantity,
            total : (item.area * 9000) * item.quantity
        })));

        const roadDevelopmentCost = area.totalArea * 76;
        const roadCoverCost = (area.totalArea/4000) * 200000;
        const waterPipelineCost = area.totalArea * 76;
        const waterTreatmentCost = area.totalArea * 250;
        const electricityCost = area.totalArea * 250;
        const guardHouseAndFenceCost = area.fenceLength * 3000;
        const greenAreaDevelopment = (area.totalArea * 0.5) * 3000 * 4;
        const landDevelopmentCost = roadDevelopmentCost + roadCoverCost + waterPipelineCost + waterTreatmentCost + electricityCost + guardHouseAndFenceCost + greenAreaDevelopment + 500000;
        const totalLandCost = landDevelopmentCost + input.priceLandBought;
        const developedLand = totalLandCost/(area.totalArea * 0.65);

        const duration = util.duration(input.periodSellStart, input.periodSellEnd);
        const employeesSalary = input.totalSalary * duration;
        const adCost = product.user.totalCost * 0.1;

        const spendings = {
            priceLandBought : input.priceLandBought,
            costConstructionAndLivingSpace : input.costConstructionAndLivingSpace,
            costOther : input.costOther,
            costPlan : input.costPlan,
            costConstructionPerItem : constructionItems,
            costDevelopRoad : roadDevelopmentCost,
            costRoadCover : roadCoverCost,
            costTapWater : waterPipelineCost,
            costWaterTreatment : waterTreatmentCost,
            costElectricity : electricityCost,
            costFenceAndGuardHouse : guardHouseAndFenceCost,
            costDevelopGreenArea : greenAreaDevelopment,
            costDevelopLand : landDevelopmentCost,
            totalLandCost : totalLandCost,
            costDevelopDone : developedLand,
            periodSellStart : input.periodSellStart,
            periodSellEnd : input.periodSellEnd,
            duration : duration,
            noEmployee : input.noEmployee,
            totalSalary : input.totalSalary,
            salaryEmployee : employeesSalary,
            costAdvt : input.costAdvt,
            costAdvtOnePer : adCost
        };

        return spendings;
    }

    implicitCosts(property){
        const product = this.userProduct(property);
        const spendings = this.spendings(property);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const sellArea = (product.user.products.map(product => product.area).reduce(reducer)) * 4;
        const landCost = property.spendings_input.priceLandBought;
        const totalCost = spendings.costDevelopLand + landCost;
        const costAdvtAndEmployee = (spendings.salaryEmployee + spendings.costAdvtOnePer) * spendings.duration;
        const projectCost = product.user.totalCost;

        const implicitCost = {
            sellAreaAndSize : sellArea,
            costLand : landCost,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : totalCost,
            costProject : projectCost
        }

        return implicitCost;
    }

    profit(property){
        const product = this.userProduct(property);
        const spendings = this.spendings(property);
        const implicitCosts = this.implicitCosts(property);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const profitPerItems = product.user.products.map(item => JSON.parse(JSON.stringify({
            type : item.type,
            profitPerItem : item.cost,
            noItem : item.quantity,
            totalProfit : item.cost - (spendings.costDevelopDone * 21) + (item.area * 9000) + 50000
        })));
        const projectProfit = profitPerItems.map(item => item.totalProfit).reduce(reducer);
        const netProfit = projectProfit - implicitCosts.costAdvtAndEmployee;
        const averageProfit = netProfit/product.user.totalQuantity;
        
        const profit = {
            profitPerItems : profitPerItems,
            totalProfit : projectProfit,
            netProfit : netProfit,
            averageProfit : averageProfit
        };

        return profit;
    }
}

module.exports = Townhouse;