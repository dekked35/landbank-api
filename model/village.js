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
            centerArea : Object.keys(centerArea).map( item => centerArea[item] * 1.25 *centerCost[item] ),
            isCompetitor : property.product_input.isCompetitor
        }
        return product;
    }

    competitorProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.competitor.products;
        const areaSellArea = property.product_input.competitor.usedArea ? parseFloat(property.product_input.competitor.usedArea) : area.ratio_area.sellArea 
        const oneFloorQty = parseInt(((productInput[0].ratio/100) * areaSellArea)/(productInput[0].size));
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * areaSellArea)/(productInput[1].size));
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * areaSellArea)/(productInput[2].size));
        const totalFloorQty = oneFloorQty + twoFloorQty + threeFloorQty;
        const totalCost =   (oneFloorQty * productInput[0].cost) + 
                            (twoFloorQty * productInput[1].cost) + 
                            (threeFloorQty * productInput[2].cost);

        const competitorProduct = {
            competitor : {
                products: [
                    {
                        type : productInput[0].type,
                        size : productInput[0].size,
                        area : productInput[0].area,
                        cost : productInput[0].cost,
                        ratio : productInput[0].ratio,
                        quantity : oneFloorQty 
                    },
                    {
                        type : productInput[1].type,
                        size : productInput[1].size,
                        area : productInput[1].area,
                        cost : productInput[1].cost,
                        ratio : productInput[1].ratio,
                        quantity : twoFloorQty
                    },
                    {
                        type : productInput[2].type,
                        size : productInput[2].size,
                        area : productInput[2].area,
                        cost : productInput[2].cost,
                        ratio : productInput[2].ratio,
                        quantity : threeFloorQty
                    }
                ],
                totalQuantity: totalFloorQty,
                totalCost: totalCost,
                usedArea : areaSellArea
            }
        }

        return competitorProduct;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user.products;
        const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.ratio_area.sellArea)/(productInput[0].size ));
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.ratio_area.sellArea)/(productInput[1].size));
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.ratio_area.sellArea)/(productInput[2].size));
        const totalFloorQty = oneFloorQty + twoFloorQty + threeFloorQty;
        const totalCost =   (oneFloorQty * productInput[0].cost) + 
                            (twoFloorQty * productInput[1].cost) + 
                            (threeFloorQty * productInput[2].cost);

        const userProduct = {
            user : {
                products: [
                    {
                        type : productInput[0].type,
                        size : productInput[0].size,
                        area : productInput[0].area,
                        cost : productInput[0].cost,
                        ratio : productInput[0].ratio,
                        quantity : oneFloorQty
                    },
                    {
                        type : productInput[1].type,
                        size : productInput[1].size,
                        area : productInput[1].area,
                        cost : productInput[1].cost,
                        ratio : productInput[1].ratio,
                        quantity : twoFloorQty
                    },
                    {
                        type : productInput[2].type,
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
        let centerArea = areaInput.standardArea.centerArea
        centerArea = Object.keys(centerArea).map( item => centerArea[item] * centerCost[item] * 1.25)
        const centerPrice = centerArea.reduce(reducer)
        const duration = util.duration(spendingsInput.periodSellStart,spendingsInput.periodSellEnd);
        const costAdvtOnePer = product.user.totalCost * spendingsInput.percentCostAdvt / 100;
        const salaryEmployee = duration * spendingsInput.salaryEmployee;
        const costPerOneMonth = (spendingsInput.costCommission * (userProduct[0].quantity + userProduct[1].quantity + userProduct[2].quantity)) + spendingsInput.costAdvt + (salaryEmployee * spendingsInput.noEmployee) + costAdvtOnePer
        const costDevelopLand = costDevelopRoad + costRoadCover + costTapWater + costWaterTreatment + costElectricity + costFenceAndGuardHouse + costDevelopGreenArea + centerPrice + spendingsInput.costPlan + costPerOneMonth ;
        const costInProject = costDevelopLand + spendingsInput.priceLandBought;
        const costDevelopDone = costInProject/area.ratio_area.sellArea;
        const costOneFloorConstruction = (productInput[0].area * spendingsInput.costConstructionLivingSpace) + (productInput[0].size * (costInProject/area.ratio_area.sellArea)) + spendingsInput.costOther;
        const costTwoFloorConstruction = (productInput[1].area * spendingsInput.costConstructionLivingSpace) + (productInput[1].size * (costInProject/area.ratio_area.sellArea)) + spendingsInput.costOther;
        const costThreeFloorConstruction = (productInput[2].area * spendingsInput.costConstructionLivingSpace) + (productInput[2].size * (costInProject/area.ratio_area.sellArea)) + spendingsInput.costOther;
        const costOneFloorConstructionTotal = costOneFloorConstruction * userProduct[0].quantity;
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * userProduct[1].quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * userProduct[2].quantity;
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
                    // type : "single floor house",
                    type : userProduct[0].type,
                    costPerItem: costOneFloorConstruction,
                    quantity : userProduct[0].quantity,
                    total : costOneFloorConstructionTotal
                },
                {
                    // type : "two floor house",
                    type : userProduct[1].type,
                    costPerItem: costTwoFloorConstruction,
                    quantity : userProduct[1].quantity,
                    total : costTwoFloorConstructionTotal
                },
                {
                    // type : "three floor house",
                    type : userProduct[2].type,
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
            costAdvt : spendingsInput.costAdvt,
            costAdvtOnePer : costAdvtOnePer,
            costCommission : spendingsInput.costCommission,
            centerCost : centerPrice,
            costPerOneMonth : costPerOneMonth,
            percentCostAdvt : spendingsInput.percentCostAdvt
        };

        return spendings;
    }

    implicitCosts(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        const spendings = this.spendings(property);

        const costLand = spendings.costInProject / area.ratio_area.sellArea;
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
        const productUserInput = property.product_input.user.products;
        const productCompetitorInput = property.product_input.competitor.products;
        const buildingCost = spendings.costConstructionPerItem;

        const singleOneFloorProfit = productUserInput[0].cost - buildingCost[0].costPerItem;
        const singleTwoFloorProfit = productUserInput[1].cost - buildingCost[1].costPerItem;
        const singleThreeFloorProfit = productUserInput[2].cost - buildingCost[2].costPerItem;
        const singleOneFloorProfitCom = productCompetitorInput[0].cost - buildingCost[0].costPerItem;
        const singleTwoFloorProfitCom = productCompetitorInput[1].cost - buildingCost[1].costPerItem;
        const singleThreeFloorProfitCom = productCompetitorInput[2].cost - buildingCost[2].costPerItem;
        const totalOneFloorProfit = singleOneFloorProfit * productUserInput[0].quantity;
        const totalTwoFloorProfit = singleTwoFloorProfit * productUserInput[1].quantity;
        const totalThreeFloorProfit = singleThreeFloorProfit * productUserInput[2].quantity;
        const totalOneFloorProfitCom = singleOneFloorProfitCom * productCompetitorInput[0].quantity;
        const totalTwoFloorProfitCom = singleTwoFloorProfitCom * productCompetitorInput[1].quantity;
        const totalThreeFloorProfitCom = singleThreeFloorProfitCom * productCompetitorInput[2].quantity;
        const totalProfit = totalOneFloorProfit + totalTwoFloorProfit + totalThreeFloorProfit;
        const totalProfitCom = totalOneFloorProfitCom + totalTwoFloorProfitCom + totalThreeFloorProfitCom;
        const netProfit = totalProfit - spendings.costInProject - (spendings.costAdvtOnePer + spendings.salaryEmployee);
        const averageProfitPerHouse = netProfit/ product.user.totalQuantity;

        const profit = {
            profitPerItems : [
                {
                    // type : "single floor house",
                    type : productUserInput[0].type,
                    profitPerItem : singleOneFloorProfit,
                    noItem : productUserInput[0].quantity,
                    totalProfit : totalOneFloorProfit
                },
                {
                    // type : "two floor house",
                    type : productUserInput[1].type,
                    profitPerItem : singleTwoFloorProfit,
                    noItem : productUserInput[1].quantity,
                    totalProfit : totalTwoFloorProfit
                },
                {
                    // type : "three floor house",
                    type : productUserInput[2].type,
                    profitPerItem : singleThreeFloorProfit,
                    noItem : productUserInput[2].quantity,
                    totalProfit : totalThreeFloorProfit
                }
            ],
            totalProfit : totalProfit,
            totalProfitCompetitor : totalProfitCom,
            netProfit : netProfit,
            averageProfitPerHouse : averageProfitPerHouse,
            isCompetitor : property.product_input.isCompetitor
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