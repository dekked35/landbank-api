class Village {
    constructor() {}

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
        const area = this.area(property);
        const competitorProductInput = property.product_input.competitor.products;
        const userProductInput = property.product_input.user.products;

        const competitorOneFloorQty = parseInt(((competitorProductInput[0].ratio/100) * area.sellArea)/competitorProductInput[0].size);
        const competitorTwoFloorQty = parseInt(((competitorProductInput[1].ratio/100) * area.sellArea)/competitorProductInput[1].size);
        const competitorThreeFloorQty = parseInt(((competitorProductInput[2].ratio/100) * area.sellArea)/competitorProductInput[2].size);
        const competitorAllFloorQty = competitorOneFloorQty + competitorTwoFloorQty + competitorThreeFloorQty;
        const competitorTotalCost =   (competitorOneFloorQty * competitorProductInput[0].cost) + 
                                        (competitorTwoFloorQty * competitorProductInput[1].cost) + 
                                        (competitorThreeFloorQty * competitorProductInput[2].cost);

        const userOneFloorQty = parseInt(((userProductInput[0].ratio/100) * area.sellArea)/userProductInput[0].size);
        const userTwoFloorQty = parseInt(((userProductInput[1].ratio/100) * area.sellArea)/userProductInput[1].size);
        const userThreeFloorQty = parseInt(((userProductInput[2].ratio/100) * area.sellArea)/userProductInput[2].size);
        const userAllFloorQty = userOneFloorQty + userTwoFloorQty + userThreeFloorQty;
        const userTotalCost = (userOneFloorQty * userProductInput[0].cost) + 
                                (userTwoFloorQty * userProductInput[1].cost) + 
                                (userThreeFloorQty * userProductInput[2].cost);

        const product = {
            competitor : {
                products: [
                    {
                        type : "single floor house",
                        size : competitorProductInput[0].size,
                        area : competitorProductInput[0].area,
                        cost : competitorProductInput[0].cost,
                        ratio : competitorProductInput[0].ratio,
                        quantity : competitorOneFloorQty 
                    },
                    {
                        type : "two floor house",
                        size : competitorProductInput[1].size,
                        area : competitorProductInput[1].area,
                        cost : competitorProductInput[1].cost,
                        ratio : competitorProductInput[1].ratio,
                        quantity : competitorTwoFloorQty
                    },
                    {
                        type : "three floor house",
                        size : competitorProductInput[2].size,
                        area : competitorProductInput[2].area,
                        cost : competitorProductInput[2].cost,
                        ratio : competitorProductInput[2].ratio,
                        quantity : competitorTwoFloorQty
                    }
                ],
                totalQuantity: competitorAllFloorQty,
                totalCost: competitorTotalCost
            },
            user :{
                products: [
                    {
                        type : "single floor house",
                        size : userProductInput[0].size,
                        area : userProductInput[0].area,
                        cost : userProductInput[0].cost,
                        ratio : userProductInput[0].ratio,
                        quantity : userOneFloorQty
                    },
                    {
                        type : "two floor house",
                        size : userProductInput[1].size,
                        area : userProductInput[1].area,
                        cost : userProductInput[1].cost,
                        ratio : userProductInput[1].ratio,
                        quantity : userTwoFloorQty
                    },
                    {
                        type : "three floor house",
                        size : userProductInput[2].size,
                        area : userProductInput[2].area,
                        cost : userProductInput[2].cost,
                        ratio : userProductInput[2].ratio,
                        quantity : userThreeFloorQty
                    }
                ],
                totalQuantity : userAllFloorQty,
                totalCost : userTotalCost
            } 
        }

        return product;
    }

    spendings(property){
        const area = this.area(property);
        const product = this.product(property);
        const spendingsInput = property.spendings_input;

        const userProductInput = property.product_input.user.products;
        const userProduct = product.user.products;

        const costDevelopRoad = area.greenArea * 1250 * 4;
        const costRoadCover = (area.totalArea/400) * 200000;
        const costTapWater = area.totalArea * 76;
        const costWaterTreatment = area.totalArea * 250;
        const costElectricity = area.totalArea * 250;
        const costFenceAndGuardHouse = area.fenceLength * 3000;
        const costDevelopGreenArea = area.greenArea * 3000 * 4;
        const costDevelopLand = spendingsInput.costPlan + costDevelopRoad + costRoadCover + costTapWater + costWaterTreatment + costElectricity + costFenceAndGuardHouse + costDevelopGreenArea;
        const costInProject = costDevelopLand + spendingsInput.priceLandBought;
        const costDevelopDone = costInProject/area.sellArea
        const costOneFloorConstruction = userProductInput[0].area * spendingsInput.costConstructionLivingSpace
        const costTwoFloorConstruction = userProductInput[1].area * spendingsInput.costConstructionLivingSpace
        const costThreeFloorConstruction = userProductInput[1].area * spendingsInput.costConstructionLivingSpace
        
        const costOneFloorConstructionTotal = costOneFloorConstruction * userProduct[0].quantity;
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * userProduct[1].quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * userProduct[2].quantity;

        const salaryEmployee = spendingsInput.sellPeriod * spendingsInput.salaryEmployee;
        const costAdvtOnePer = product.user.totalCost * 0.01;
        const costAdvt = costAdvtOnePer * spendingsInput.sellPeriod;

        const spendings = {
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
            costOneFloorConstruction : costOneFloorConstruction,
            costTwoFloorConstruction : costTwoFloorConstruction,
            costThreeFloorConstruction : costThreeFloorConstruction,
            user_1flr_quantity : userProduct[0].quantity,
            user_2flr_quantity : userProduct[1].quantity,
            user_3flr_quantity : userProduct[2].quantity,
            costOneFloorConstructionTotal : costOneFloorConstructionTotal,
            costTwoFloorConstructionTotal : costTwoFloorConstructionTotal,
            costThreeFloorConstructionTotal : costThreeFloorConstructionTotal,
            salaryEmployee : salaryEmployee,
            costAdvtOnePer : costAdvtOnePer,
            costAdvt : costAdvt
        };

        return spendings;
    }

    implicitCosts(property){
        const area = this.area(property);
        const product = this.product(property);
        const spendings = this.spendings(property);
        const userProductInput = property.product_input.user.products

        const costLand = (userProductInput[0].size + userProductInput[1].size + userProductInput[2].size) * spendings.costDevelopDone;
        const costAdvtAndEmployee = spendings.costAdvtOnePer + spendings.salaryEmployee;

        const implicitCosts = {
            sellAreaSize : area.sellArea,
            costLand : costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : spendings.costInProject,
            costProject : product.user.totalCost
        }

        return implicitCosts;
    }

    profit(property){
        const product = this.product(property);
        const spendings = this.spendings(property);
        const userProduct = product.user.products;
        const spendingsInput = property.spendings_input;

        const oneFloorLandCost = userProduct[0].size * spendings.costDevelopDone;
        const twoFloorLandCost = userProduct[1].size * spendings.costDevelopDone;
        const threeFloorLandCost = userProduct[2].size * spendings.costDevelopDone;
        const singleOneFloorCost = spendings.costOneFloorConstruction + oneFloorLandCost + spendingsInput.costOther;
        const singleTwoFloorCost = spendings.costTwoFloorConstruction + twoFloorLandCost + spendingsInput.costOther;
        const singleThreeFloorCost = spendings.costThreeFloorConstruction + threeFloorLandCost + spendingsInput.costOther;
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
            singleOneFloorProfit : singleOneFloorProfit,
            singleTwoFloorProfit : singleTwoFloorProfit,
            singleThreeFloorProfit : singleThreeFloorProfit,
            user_1flr_quantity : userProduct[0].quantity,
            user_2flr_quantity : userProduct[1].quantity,
            user_3flr_quantity : userProduct[2].quantity,
            totalOneFloorProfit : totalOneFloorProfit,
            totalTwoFloorProfit : totalTwoFloorProfit,
            totalThreeFloorProfit : totalThreeFloorProfit,
            totalProfit : totalProfit,
            netProfit : netProfit,
            averageProfitPerHouse : averageProfitPerHouse
        };

        return profit;
    }
}

module.exports = Village;