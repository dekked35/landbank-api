const Util = require("../util/util");
const util = new Util();

class Village {
    constructor() {}

    area(property){
        const areaInput = property.area_input;

        const fenceLength = 3.14 * ((Math.sqrt(areaInput.totalArea * 4)/(22/7))) * 2;
        const ratio_area = JSON.parse(JSON.stringify({
            sellArea : (areaInput.percent.sellArea/100) * areaInput.totalArea,
            roadSize : (areaInput.percent.roadSize/100) * areaInput.totalArea,
            greenArea : (areaInput.percent.greenArea/100) * areaInput.totalArea
        }));
        
        const area = {
            farValue : areaInput.farValue,
            osrValue : areaInput.osrValue,
            totalArea : areaInput.totalArea,
            fenceLength : fenceLength,
            percent : areaInput.percent,
            ratio_area : ratio_area
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

    competitorProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.competitor.products;

        const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.ratio_area.sellArea)/productInput[0].size);
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.ratio_area.sellArea)/productInput[1].size);
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.ratio_area.sellArea)/productInput[2].size);
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
        const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.ratio_area.sellArea)/productInput[0].size);
        const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.ratio_area.sellArea)/productInput[1].size);
        const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.ratio_area.sellArea)/productInput[2].size);
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

        const productInput = property.product_input.user.products;
        const userProduct = product.user.products;

        const costDevelopRoad = area.ratio_area.greenArea * 1250 * 4;
        const costRoadCover = (area.totalArea/400) * 200000;
        const costTapWater = area.totalArea * 76;
        const costWaterTreatment = area.totalArea * 250;
        const costElectricity = area.totalArea * 250;
        const costFenceAndGuardHouse = area.fenceLength * 3000;
        const costDevelopGreenArea = area.ratio_area.greenArea * 3000 * 4;
        const costDevelopLand = spendingsInput.costPlan + costDevelopRoad + costRoadCover + costTapWater + costWaterTreatment + costElectricity + costFenceAndGuardHouse + costDevelopGreenArea;
        const costInProject = costDevelopLand + spendingsInput.priceLandBought;
        const costDevelopDone = costInProject/area.ratio_area.sellArea
        const costOneFloorConstruction = productInput[0].area * spendingsInput.costConstructionLivingSpace
        const costTwoFloorConstruction = productInput[1].area * spendingsInput.costConstructionLivingSpace
        const costThreeFloorConstruction = productInput[2].area * spendingsInput.costConstructionLivingSpace
        
        const duration = util.duration(spendingsInput.periodSellStart,spendingsInput.periodSellEnd);
        const costOneFloorConstructionTotal = costOneFloorConstruction * userProduct[0].quantity;
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * userProduct[1].quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * userProduct[2].quantity;
        const salaryEmployee = duration * spendingsInput.salaryEmployee;
        const costAdvtOnePer = product.user.totalCost * 0.01;
        const costAdvt = costAdvtOnePer * duration;

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
            costAdvt : costAdvt
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
        const userProduct = product.user.products;
        const spendingsInput = property.spendings_input;
        const buildingCost = spendings.costConstructionPerItem;

        const oneFloorLandCost = userProduct[0].size * spendings.costDevelopDone;
        const twoFloorLandCost = userProduct[1].size * spendings.costDevelopDone;
        const threeFloorLandCost = userProduct[2].size * spendings.costDevelopDone;
        const singleOneFloorCost = buildingCost[0].costPerItem + oneFloorLandCost + spendingsInput.costOther;
        const singleTwoFloorCost = buildingCost[1].costPerItem + twoFloorLandCost + spendingsInput.costOther;
        const singleThreeFloorCost = buildingCost[2].costPerItem + threeFloorLandCost + spendingsInput.costOther;
        const singleOneFloorProfit = userProduct[0].cost - singleOneFloorCost;
        const singleTwoFloorProfit = userProduct[1].cost - singleTwoFloorCost;
        const singleThreeFloorProfit = userProduct[2].cost - singleThreeFloorCost;
        const totalOneFloorProfit = singleOneFloorProfit * userProduct[0].quantity;
        const totalTwoFloorProfit = singleTwoFloorProfit * userProduct[1].quantity;
        const totalThreeFloorProfit = singleThreeFloorProfit * userProduct[2].quantity;
        const totalProfit = totalOneFloorProfit + totalTwoFloorProfit + totalThreeFloorProfit;
        const netProfit = totalProfit - spendings.costInProject;
        const averageProfitPerHouse = netProfit/ product.user.totalQuantity

        const profit = {
            profitPerItems : [
                {
                    type : "single floor house",
                    profitPerItem : singleOneFloorProfit,
                    noItem : 0,
                    totalProfit : totalOneFloorProfit
                },
                {
                    type : "two floor house",
                    profitPerItem : singleTwoFloorProfit,
                    noItem : 0,
                    totalProfit : totalTwoFloorProfit
                },
                {
                    type : "three floor house",
                    profitPerItem : singleThreeFloorProfit,
                    noItem : 0,
                    totalProfit : totalThreeFloorProfit
                }
            ],
            totalProfit : totalProfit,
            netProfit : netProfit,
            averageProfitPerHouse : averageProfitPerHouse
        };

        return profit;
    }
    
}

module.exports = Village;