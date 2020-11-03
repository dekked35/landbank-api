const Util = require("../util/util");
const Finance = require('financejs');
const util = new Util();
const finance = new Finance();

const centerCost = {
    swimming : 15000,
    fitnessZone : 15000,
    officeZone : 25000
}

const level = [
    2,3,4
]

class Townhouse{
    constructor(){}

    area(property){
        const areaInput = property.area_input;

        const fenceLength = (3.14 * ((Math.sqrt(areaInput.availableArea * 4/(22/7)))) * 2);
        const ratio_area = JSON.parse(JSON.stringify({
            sellArea : ((areaInput.standardArea.percent.sellArea/100) * areaInput.availableArea) - (areaInput.standardArea.area.coverArea ? 0 : areaInput.coverArea),
            roadSize : (areaInput.standardArea.percent.roadSize/100) * areaInput.availableArea,
            greenArea : (areaInput.standardArea.percent.greenArea/100) * areaInput.availableArea,
            centerArea : (areaInput.standardArea.percent.centerArea/100) * areaInput.availableArea,
            coverArea : areaInput.coverArea
        }));

        const total_land_price = areaInput.land_price * areaInput.totalArea;

        const area = {
            farValue : areaInput.farValue,
            osrValue : areaInput.osrValue,
            totalArea : areaInput.totalArea,
            land_price: areaInput.land_price,
            total_land_price: total_land_price,
            availableArea : areaInput.availableArea,
            fenceLength : fenceLength,
            percent : areaInput.percent,
            ratio_area : ratio_area
        };

        return area;
    }

    product(property){
        const areaInput = property.area_input;
        const competitorProduct = this.competitorProduct(property);
        const userProduct = this.userProduct(property);
        const centerArea = areaInput.standardArea.centerArea

        const product = {
            competitor : competitorProduct.competitor,
            user : userProduct.user,
            centerArea : Object.keys(centerArea).map( item => centerArea[item] * 1.25 * centerCost[item]),
            isCompetitor : property.product_input.isCompetitor
        }
        return product;
    }

    userProduct(property){
        const area = property.area_input;
        const productInput = property.product_input.user.products;
        const input = property.product_input.user;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const stair1 = input.width * input.depth / 12
        
        const centralArea = input.depth * input.width;
        const frontArea = input.width * input.frontDepth;
        const behindArea = input.width * input.behindDepth;
        const totalAreaMeter = centralArea + frontArea + behindArea;
        const totalAreaSquare = totalAreaMeter/4;
        
        const newProducts = productInput.map((product,index) => JSON.parse(JSON.stringify({
            type : product.type,
            area : (level[index] * (input.width * input.depth - stair1)) + frontArea + behindArea,
            stairArea : stair1 * level[index],
            cost : product.cost,
            ratio : product.ratio,
            size : totalAreaMeter,
            quantity : parseInt(((product.ratio/100) * area.ratio_area.sellArea * 4)/totalAreaMeter)
        })));
        
        const newProductsQty = newProducts.map(product => product.quantity).reduce(reducer);
        const totalNewProductPrice = newProducts.map(product => product.quantity * product.cost).reduce(reducer);

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
        const area = property.area_input;
        const productInput = property.product_input.competitor.products;
        const input = property.product_input.user;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const stair1 = input.width * input.depth / 12;
        
        const centralArea = input.depth * input.width;
        const frontArea = input.width * input.frontDepth;
        const behindArea = input.width * input.behindDepth;
        const totalAreaMeter = centralArea + frontArea + behindArea;
        const totalAreaSquare = totalAreaMeter/4;
        
        const newProducts = productInput.map((product,index) => JSON.parse(JSON.stringify({
            type : product.type,
            // area : product.area,
            area : (level[index] * (input.width * input.depth - stair1)) + frontArea + behindArea,
            // stairArea : 2.2 * (input.depth * 0.5),
            stairArea : stair1 * level[index],
            cost : product.cost,
            ratio : product.ratio,
            size : totalAreaMeter,
            quantity : parseInt(((product.ratio/100) * area.ratio_area.sellArea * 4)/totalAreaMeter)
        })));
        
        const newProductsQty = newProducts.map(product => product.quantity).reduce(reducer);
        const totalNewProductPrice = newProducts.map(product => product.quantity * product.cost).reduce(reducer);

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
        const area = property.area_input;
        const product = this.userProduct(property);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const input = property.spendings_input;
        const areaInput = property.area_input
        const userProduct = product.user.products;
        const allProductSize = product.user.totalAreaSquare;
        const centerAreaInput = areaInput.standardArea.centerArea;

        const roadDevelopmentCost = area.ratio_area.roadSize * 1250 *4;
        const roadCoverCost = (area.totalArea/400) * 200000;
        const waterPipelineCost = area.totalArea * 76;
        const waterTreatmentCost = area.totalArea * 250;
        const electricityCost = area.totalArea * 250;
        const guardHouseAndFenceCost = area.fenceLength * 3000;
        const greenAreaDevelopment = (area.ratio_area.greenArea) * 3000 * 4;
        const centerArea = Object.keys(centerAreaInput).map(item => centerAreaInput[item] * centerCost[item] * 1.25);
        const centerPrice = centerArea.reduce(reducer);
        const duration = util.duration(input.periodSellStart, input.periodSellEnd);
        const salaryEmployee = duration * input.salaryEmployee;
        const costAdvtOnePer = product.user.totalCost * input.percentCostAdvt / 100;
        const costPerOneMonth = (input.costCommission * (userProduct[0].quantity + userProduct[1].quantity + userProduct[2].quantity)) + input.costAdvt + (salaryEmployee * input.noEmployee) + costAdvtOnePer
        const landDevelopmentCost = roadDevelopmentCost + roadCoverCost + waterPipelineCost + waterTreatmentCost + electricityCost + guardHouseAndFenceCost + greenAreaDevelopment + centerPrice + costPerOneMonth + input.costPlan;
        const totalLandCost = landDevelopmentCost + input.priceLandBought;
        const developedLand = totalLandCost/(area.ratio_area.sellArea);
        const constructionItems = product.user.products.map((item,index) => {
            return JSON.parse(JSON.stringify({
                type : item.type,
                costPerItem : ((item.stairArea + item.area) * input.costConstructionLivingSpace) + (allProductSize * developedLand) + input.costOther,
                quantity : item.quantity,
                total : (((item.stairArea + item.area) * input.costConstructionLivingSpace) + (allProductSize * developedLand) + input.costOther) * item.quantity
            }))});

        const employeesSalary = input.totalSalary * duration;
        const spendings = {
            priceLandBought : input.priceLandBought,
            costConstructionLivingSpace : input.costConstructionLivingSpace,
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
            costInProject : totalLandCost,
            costDevelopDone : developedLand,
            periodSellStart : input.periodSellStart,
            periodSellEnd : input.periodSellEnd,
            sellPeriod : duration,
            noEmployee : input.noEmployee,
            totalSalary : input.totalSalary,
            salaryEmployee : employeesSalary,
            costAdvt : input.costAdvt,
            costAdvtOnePer : costAdvtOnePer,
            costCommission : input.costCommission,
            costPerOneMonth : costPerOneMonth,
            percentCostAdvt : input.percentCostAdvt,
            centerCost : centerPrice
        };

        return spendings;
    }

    implicitCosts(property){
        // const product = this.userProduct(property);
        // const spendings = this.spendings(property);

        // const reducer = (accumulator, currentValue) => accumulator + currentValue;

        // const sellArea = (product.user.products.map(product => product.area).reduce(reducer)) * 4;
        // const landCost = property.spendings_input.priceLandBought;
        // const totalCost = spendings.costDevelopLand + landCost;
        // const costAdvtAndEmployee = (spendings.salaryEmployee + spendings.costAdvtOnePer) * spendings.sellPeriod;
        // const projectCost = product.user.totalCost;
        const area = property.area_input;
        const product = this.userProduct(property);
        const spendings = this.spendings(property);
        // const productInput = property.product_input.user.products

        const costLand = spendings.costInProject / area.ratio_area.sellArea;
        const costAdvtAndEmployee = spendings.costAdvtOnePer + spendings.salaryEmployee;


        const implicitCost = {
            // sellAreaSize : sellArea,
            // costLand : landCost,
            // costAdvtAndEmployee : costAdvtAndEmployee,
            // costAll : totalCost,
            // costProject : projectCost
            sellAreaSize : area.ratio_area.sellArea,
            costLand : costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : spendings.costInProject,
            costProject : product.user.totalCost
        }

        return implicitCost;
    }

    profit(property){
        const product = this.userProduct(property);
        const spendings = this.spendings(property);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const implicitCosts = this.implicitCosts(property);
        const inputUser = property.product_input.user.products;
        const inputCom = property.product_input.competitor.products;
        const inputSpendings = property.spendings_input;
        // const centerAreaInput = areaInput.standardArea.centerArea;
        // const areaInput = property.area_input
        const allProductSize = product.user.totalAreaSquare;
        const area = this.area(property);

        const roadDevelopmentCost = area.ratio_area.roadSize * 1250 *4;
        const roadCoverCost = (area.totalArea/400) * 200000;
        const waterPipelineCost = area.totalArea * 76;
        const waterTreatmentCost = area.totalArea * 250;
        const electricityCost = area.totalArea * 250;
        const guardHouseAndFenceCost = area.fenceLength * 3000;
        const greenAreaDevelopment = (area.ratio_area.greenArea) * 3000 * 4;
        // const centerPrice = centerArea.reduce(reducer)
        // const centerArea = Object.keys(centerAreaInput).map(item => centerAreaInput[item] * centerCost[item] * 1.25);
        const landDevelopmentCost = roadDevelopmentCost + roadCoverCost + waterPipelineCost + waterTreatmentCost + electricityCost + guardHouseAndFenceCost + greenAreaDevelopment /*+ centerPrice*/ + spendings.costPlan;
        const totalLandCost = landDevelopmentCost + spendings.priceLandBought;
        const developedLand = totalLandCost/(area.ratio_area.sellArea);

        const profitPerItems = inputUser.map((item,index) =>   {
            return JSON.parse(JSON.stringify({
            type : item.type,
            profitPerItem : item.cost - (((item.stairArea + item.area) * inputSpendings.costConstructionLivingSpace) + (allProductSize * developedLand) + inputSpendings.costOther),
            noItem : item.quantity,
            totalProfit: (item.cost - (((item.stairArea + item.area) * inputSpendings.costConstructionLivingSpace) + (allProductSize * developedLand) + inputSpendings.costOther)) * item.quantity
        }))});
        const profitPerItemsCom = inputCom.map((item,index) =>   {
            return JSON.parse(JSON.stringify({
            type : item.type,
            profitPerItem : item.cost - (((item.stairArea + item.area) * inputSpendings.costConstructionLivingSpace) + (allProductSize * developedLand) + inputSpendings.costOther),
            noItem : item.quantity,
            totalProfit: (item.cost - (((item.stairArea + item.area) * inputSpendings.costConstructionLivingSpace) + (allProductSize * developedLand) + inputSpendings.costOther)) * item.quantity
        }))});
        const projectProfit = profitPerItems.map(item => item.totalProfit).reduce(reducer);
        const projectProfitCom = profitPerItemsCom.map(item => item.totalProfit).reduce(reducer);
        const netProfit = projectProfit - implicitCosts.costAdvtAndEmployee;
        const averageProfit = netProfit/product.user.totalQuantity;
        
        const profit = {
            profitPerItems : profitPerItems,
            totalProfit : projectProfit,
            totalProfitCompetitor : projectProfitCom,
            netProfit : netProfit,
            isCompetitor : property.product_input.isCompetitor,
            averageProfit : averageProfit
        };

        return profit;
    }

    ipr(property){
        const input = property.ipr_input;
        const spendings = this.spendings(property);
        const profit = this.profit(property);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const totalHouseQty = spendings.costConstructionPerItem.map( item => item.quantity ).reduce(reducer);

        const investmentBudget = spendings.costConstructionPerItem.map( item => item.total ).reduce(reducer);
        const incomePerMonth = totalHouseQty/4/12 * profit.totalProfit;
        const expensePerMonth = totalHouseQty/4/12 * investmentBudget;

        const breakEvenPointMonthlyWithCash = investmentBudget/incomePerMonth;
        const breakEvenPointYearWithCash = breakEvenPointMonthlyWithCash/12;
        const breakEvenPointMonthlyWithBank = investmentBudget/incomePerMonth;
        const breakEvenPointYearWithBank = breakEvenPointMonthlyWithBank/12;

        const overBorrowFund = spendings.priceLandBought * totalHouseQty;
        const loanInterest = (input.bankInterest/12) * overBorrowFund;

        const firstMonthCashflow = overBorrowFund + loanInterest;
        const monthlyCashflow = incomePerMonth + expensePerMonth + loanInterest;

        const cashflowYear = (breakEvenPointMonthlyWithCash + 12)/12;
        const cashflow = Array(cashflowYear).fill(monthlyCashflow).splice(0, 1, firstMonthCashflow);

        const bankInvestmentFund = input.bankInvestmentFundRatio * investmentBudget;
        const privateInvestmentFund = input.privateInvestmentFundRation * investmentBudget;
        const wacc = (privateInvestmentFund * 0.126) + (bankInvestmentFund * 0.064);
        const npv = finance.NPV(wacc,-investmentBudget,...cashflow);
        const irr = finance.IRR(-investmentBudget,...cashflow);

        const IPR = {
            ipr: {
                
            }
        }
        return IPR;
    }
}

module.exports = Townhouse;