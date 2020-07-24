const Util = require("../util/util");
const Finance = require('financejs');
const util = new Util();
const finance = new Finance();

const centerCost = {
    swimming : 15000,
    fitnessZone : 15000,
    officeZone : 25000
}

class Village {
    constructor() {}

    area(property){
        const areaInput = property.area_input;

        const fenceLength = (3.14 * ((Math.sqrt(areaInput.availableArea * 4)/(22/7))) * 2);
        const ratio_area = JSON.parse(JSON.stringify({
            sellArea : (areaInput.standardArea.percent.sellArea/100) * areaInput.availableArea,
            roadSize : (areaInput.standardArea.percent.roadSize/100) * areaInput.availableArea,
            greenArea : (areaInput.standardArea.percent.greenArea/100) * areaInput.availableArea,
            centerArea : (areaInput.standardArea.percent.centerArea/100) * areaInput.availableArea
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
            centerArea : Object.keys(centerArea).map( item => centerArea[item] * centerCost[item] * 4)
        }
        return product;
    }

    competitorProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.competitor.products;
        const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.ratio_area.sellArea)/(productInput[0].size*4));
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.ratio_area.sellArea)/(productInput[1].size*4));
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.ratio_area.sellArea)/(productInput[2].size*4));
        const totalFloorQty = oneFloorQty + twoFloorQty + threeFloorQty;
        const totalCost =   (oneFloorQty * productInput[0].cost) + 
                            (twoFloorQty * productInput[1].cost) + 
                            (threeFloorQty * productInput[2].cost);

        const competitorProduct = {
            competitor : {
                products: [
                    {
                        type : "single floor house",
                        size : productInput[0].size,
                        area : productInput[0].area,
                        cost : productInput[0].cost,
                        ratio : productInput[0].ratio,
                        quantity : oneFloorQty 
                    },
                    {
                        type : "two floor house",
                        size : productInput[1].size,
                        area : productInput[1].area,
                        cost : productInput[1].cost,
                        ratio : productInput[1].ratio,
                        quantity : twoFloorQty
                    },
                    {
                        type : "three floor house",
                        size : productInput[2].size,
                        area : productInput[2].area,
                        cost : productInput[2].cost,
                        ratio : productInput[2].ratio,
                        quantity : threeFloorQty
                    }
                ],
                totalQuantity: totalFloorQty,
                totalCost: totalCost
            }
        }

        return competitorProduct;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user.products;
        const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.ratio_area.sellArea)/(productInput[0].size * 4));
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.ratio_area.sellArea)/(productInput[1].size * 4));
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.ratio_area.sellArea)/(productInput[2].size * 4));
        const totalFloorQty = oneFloorQty + twoFloorQty + threeFloorQty;
        const totalCost =   (oneFloorQty * productInput[0].cost) + 
                            (twoFloorQty * productInput[1].cost) + 
                            (threeFloorQty * productInput[2].cost);

        const userProduct = {
            user : {
                products: [
                    {
                        type : "single floor house",
                        size : productInput[0].size,
                        area : productInput[0].area,
                        cost : productInput[0].cost,
                        ratio : productInput[0].ratio,
                        quantity : oneFloorQty
                    },
                    {
                        type : "two floor house",
                        size : productInput[1].size,
                        area : productInput[1].area,
                        cost : productInput[1].cost,
                        ratio : productInput[1].ratio,
                        quantity : twoFloorQty
                    },
                    {
                        type : "three floor house",
                        size : productInput[2].size,
                        area : productInput[2].area,
                        cost : productInput[2].cost,
                        ratio : productInput[2].ratio,
                        quantity : threeFloorQty
                    }
                ],
                totalQuantity : totalFloorQty,
                totalCost : totalCost
            } 
        }

        return userProduct;
    }

    spendings(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        const spendingsInput = property.spendings_input;
        const areaInput = property.area_input
        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const productInput = property.product_input.user.products;
        const userProduct = product.user.products;

        const costDevelopRoad = area.ratio_area.roadSize * 1250 * 4;
        const costRoadCover = (area.totalArea/400) * 200000;
        const costTapWater = area.totalArea * 76;
        const costWaterTreatment = area.totalArea * 250;
        const costElectricity = area.totalArea * 250;
        const costFenceAndGuardHouse = area.fenceLength * 3000;
        const costDevelopGreenArea = area.ratio_area.greenArea * 3000 * 4;
        const costDevelopLand = spendingsInput.costPlan + costDevelopRoad + costRoadCover + costTapWater + costWaterTreatment + costElectricity + costFenceAndGuardHouse + costDevelopGreenArea;
        const costInProject = costDevelopLand + spendingsInput.priceLandBought;
        const costDevelopDone = costInProject/area.ratio_area.sellArea;
        const costOneFloorConstruction = (productInput[0].area * spendingsInput.costConstructionLivingSpace) + (productInput[0].size * costDevelopDone) + spendingsInput.costOther;
        const costTwoFloorConstruction = (productInput[1].area * spendingsInput.costConstructionLivingSpace)  + (productInput[1].size * costDevelopDone) + spendingsInput.costOther;
        const costThreeFloorConstruction = (productInput[2].area * spendingsInput.costConstructionLivingSpace)  + (productInput[2].size * costDevelopDone) + spendingsInput.costOther;
        
        const duration = util.duration(spendingsInput.periodSellStart,spendingsInput.periodSellEnd);
        const costOneFloorConstructionTotal = costOneFloorConstruction * userProduct[0].quantity;
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * userProduct[1].quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * userProduct[2].quantity;
        const salaryEmployee = duration * spendingsInput.salaryEmployee;
        const costAdvtOnePer = product.user.totalCost * 0.01;
        const costAdvt = costAdvtOnePer * duration;
        let centerArea = areaInput.standardArea.centerArea
        centerArea = Object.keys(centerArea).map( item => centerArea[item] * centerCost[item] * 4)
        const centerPrice = centerArea.reduce(reducer)

        const spendings = {
            priceLandBought : spendingsInput.priceLandBought,
            costConstructionLivingSpace : spendingsInput.costConstructionLivingSpace,
            costOther : spendingsInput.costOther,
            costPlan : spendingsInput.costPlan,
            costDevelopRoad : costDevelopRoad,
            costRoadCover : costRoadCover,
            costTapWater : costTapWater,
            costWaterTreatment : costWaterTreatment,
            costElectricity : costElectricity,
            costFenceAndGuardHouse : costFenceAndGuardHouse,
            costDevelopGreenArea : costDevelopGreenArea,
            costDevelopLand : costDevelopLand,
            costInProject : costInProject,
            costDevelopDone : costDevelopDone,
            costConstructionPerItem : [
                {
                    type : "single floor house",
                    costPerItem: costOneFloorConstruction,
                    quantity : userProduct[0].quantity,
                    total : costOneFloorConstructionTotal
                },
                {
                    type : "two floor house",
                    costPerItem: costTwoFloorConstruction,
                    quantity : userProduct[1].quantity,
                    total : costTwoFloorConstructionTotal
                },
                {
                    type : "three floor house",
                    costPerItem: costThreeFloorConstruction,
                    quantity : userProduct[2].quantity,
                    total : costThreeFloorConstructionTotal
                }
            ],
            periodSellStart : spendingsInput.periodSellStart,
            periodSellEnd : spendingsInput.periodSellEnd,
            sellPeriod : duration,
            noEmployee : spendingsInput.noEmployee,
            totalSalary : spendingsInput.salaryEmployee,
            salaryEmployee : salaryEmployee,
            costAdvtOnePer : costAdvtOnePer,
            costAdvt : costAdvt,
            centerCost : centerPrice
        };

        return spendings;
    }

    implicitCosts(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        const spendings = this.spendings(property);
        const productInput = property.product_input.user.products

        const costLand = (productInput[0].size + productInput[1].size + productInput[2].size) * spendings.costDevelopDone;
        const costAdvtAndEmployee = spendings.costAdvtOnePer + spendings.salaryEmployee;

        const implicitCosts = {
            sellAreaSize : area.ratio_area.sellArea,
            costLand : costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : spendings.costInProject,
            costProject : product.user.totalCost
        }

        return implicitCosts;
    }

    profit(property){
        const product = this.userProduct(property);
        const spendings = this.spendings(property);
        const productInput = property.product_input.user.products;
        const buildingCost = spendings.costConstructionPerItem;

        const singleOneFloorProfit = productInput[0].cost - buildingCost[0].costPerItem;
        const singleTwoFloorProfit = productInput[1].cost - buildingCost[1].costPerItem;
        const singleThreeFloorProfit = productInput[2].cost - buildingCost[2].costPerItem;
        const totalOneFloorProfit = singleOneFloorProfit * productInput[0].quantity;
        const totalTwoFloorProfit = singleTwoFloorProfit * productInput[1].quantity;
        const totalThreeFloorProfit = singleThreeFloorProfit * productInput[2].quantity;
        const totalProfit = totalOneFloorProfit + totalTwoFloorProfit + totalThreeFloorProfit;
        const netProfit = totalProfit - spendings.costInProject - (spendings.costAdvtOnePer + spendings.salaryEmployee);
        const averageProfitPerHouse = netProfit/ product.user.totalQuantity;

        const profit = {
            profitPerItems : [
                {
                    type : "single floor house",
                    profitPerItem : singleOneFloorProfit,
                    noItem : productInput[0].quantity,
                    totalProfit : totalOneFloorProfit
                },
                {
                    type : "two floor house",
                    profitPerItem : singleTwoFloorProfit,
                    noItem : productInput[1].quantity,
                    totalProfit : totalTwoFloorProfit
                },
                {
                    type : "three floor house",
                    profitPerItem : singleThreeFloorProfit,
                    noItem : productInput[2].quantity,
                    totalProfit : totalThreeFloorProfit
                }
            ],
            totalProfit : totalProfit,
            netProfit : netProfit,
            averageProfitPerHouse : averageProfitPerHouse
        };

        return profit;
    }

    ipr(property){
        const input = property.ipr_input;
        const spendings = this.spendings(property);
        const productInput = property.product_input.competitor.products;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const totalHouseQty = spendings.costConstructionPerItem.map( item => item.quantity ).reduce(reducer);
        const avgCompetitorProdCost = productInput.map(product => product.cost).reduce(reducer);

        const investmentBudget = spendings.costConstructionPerItem.map( item => item.total ).reduce(reducer);
        const incomePerMonth = totalHouseQty/4/12 * (avgCompetitorProdCost/3);
        const expensePerMonth = totalHouseQty/4/12 * investmentBudget;
 
        const bankExpensePerMonth = expensePerMonth - ((input.bankInterest/12) * (input.bankLoad * investmentBudget));

        const breakEvenPointMonthlyWithCash = investmentBudget/(incomePerMonth - expensePerMonth);
        const breakEvenPointYearWithCash = breakEvenPointMonthlyWithCash/12;
        const breakEvenPointYearWithBank = incomePerMonth/12;

        const investmentValue = investmentBudget;
        const investmentValueRatio = input.ratioInvestmentValue;
        const borrowFund = investmentValue * (input.bankLoad/100);
        const borrowFundRatio = input.bankLoad;
        const borrowFundInterest = input.bankInterest;
        const privateFund = investmentValue * (input.privateCash/100);
        const privateFundRatio = input.privateCash;
        const privateFundInterest = input.returnRate;

        const wacc = (privateFundRatio + privateFundInterest) * (borrowFundRatio * borrowFundInterest);
        const incomePerYear = incomePerMonth * 12;
        const cashflow = Array(input.cashFlowYear).fill(incomePerYear * input.cashFlowYear);
        const npv = finance.NPV(wacc,-investmentBudget,...cashflow);
        const irr = finance.IRR(-investmentBudget,...cashflow);

        const IPR = {
            ipr: {
                investmentBudget: investmentBudget,
                incomePerMonth: incomePerMonth,
                expensePerMonth: expensePerMonth,
                bankIncomePerMonth: incomePerMonth,
                bankExpensePerMonth: bankExpensePerMonth,
                breakEvenPointMonthCash: breakEvenPointMonthlyWithCash,
                breakEvenPointYearCash: breakEvenPointYearWithCash,
                bankLoad: input.bankLoad,
                privateCash: input.privateCash,
                bankInterest: input.bankInterest,
                returnRate: input.returnRate,
                breakEvenPointMonthBank: breakEvenPointMonthlyWithCash,
                breakEvenPointYearBank: breakEvenPointYearWithBank,
                cashFlowYear: input.cashFlowYear,
                npvValue: npv,
                irrValue: irr, 
                financeCosts: wacc,
                paybackPeriod: breakEvenPointMonthlyWithCash,
                investmentValue: investmentBudget,
                ratioInvestmentValue: investmentValueRatio,
                privateFund: privateFund,
                ratioPrivateFund: privateFundRatio,
                interestPrivateFund: privateFundInterest,
                borrowFund: borrowFund,
                ratioBorrowFund: borrowFundRatio,
                interestBorrowFund: borrowFundInterest,
                borrowPeriod: input.borrowPeriod
            }
        }

        return IPR;
    }

}

module.exports = Village;