class Village {
    constructor() {}

    area(property){
        const fenceLength = 3.14 * ((Math.sqrt(property.area_input.totalArea * 4)/(22/7))) * 2;
        const sellArea = property.area_input.totalArea * 0.65;
        const roadSize = property.area_input.totalArea * 0.3;
        const greenArea = property.area_input.totalArea * 0.05;
        const area = {
            totalArea : 1000,
            fenceLength : fenceLength,
            sellArea : sellArea,
            roadSize : roadSize,
            greenArea : greenArea 
        };

        return area;
    }

    product(property){
        const area = this.area(property);
        
        const competitor_1flr_quantity = parseInt(((property.product_input.competitor_1flr_ratio/100) * area.sellArea)/property.product_input.competitor_1flr_size);
        const competitor_2flr_quantity = parseInt(((property.product_input.competitor_2flr_ratio/100) * area.sellArea)/property.product_input.competitor_2flr_size);
        const competitor_3flr_quantity = parseInt(((property.product_input.competitor_3flr_ratio/100) * area.sellArea)/property.product_input.competitor_3flr_size);
        const competitor_allFlr_quantity = competitor_1flr_quantity + competitor_2flr_quantity + competitor_3flr_quantity;
        const competitor_total_cost =   (competitor_1flr_quantity * property.product_input.competitor_1flr_cost) + 
                                        (competitor_2flr_quantity * property.product_input.competitor_2flr_cost) + 
                                        (competitor_3flr_quantity * property.product_input.competitor_3flr_cost);

        const user_1flr_quantity = parseInt(((property.product_input.user_1flr_ratio/100) * area.sellArea)/property.product_input.user_1flr_size);
        const user_2flr_quantity = parseInt(((property.product_input.user_2flr_ratio/100) * area.sellArea)/property.product_input.user_2flr_size);
        const user_3flr_quantity = parseInt(((property.product_input.user_3flr_ratio/100) * area.sellArea)/property.product_input.user_3flr_size);
        const user_allFlr_quantity = user_1flr_quantity + user_2flr_quantity + user_3flr_quantity;
        const user_total_cost = (user_1flr_quantity * property.product_input.user_1flr_cost) + 
                                (user_2flr_quantity * property.product_input.user_2flr_cost) + 
                                (user_3flr_quantity * property.product_input.user_3flr_cost);

        const product = {
            competitor_1flr_quantity : competitor_1flr_quantity,
            competitor_2flr_quantity : competitor_2flr_quantity,
            competitor_3flr_quantity : competitor_3flr_quantity,
            competitor_allFlr_quantity : competitor_allFlr_quantity,
            competitor_total_cost : competitor_total_cost,
            user_1flr_quantity : user_1flr_quantity,
            user_2flr_quantity : user_2flr_quantity,
            user_3flr_quantity : user_3flr_quantity,
            user_allFlr_quantity : user_allFlr_quantity,
            user_total_cost : user_total_cost
        };

        return product;
    }

    spendings(property){
        const area = this.area(property);
        const product = this.product(property);

        const costDevelopRoad = area.greenArea * 1250 * 4;
        const costRoadCover = (area.totalArea/400) * 200000;
        const costTapWater = area.totalArea * 76;
        const costWaterTreatment = area.totalArea * 250;
        const costElectricity = area.totalArea * 250;
        const costFenceAndGuardHouse = area.fenceLength * 3000;
        const costDevelopGreenArea = area.greenArea * 3000 * 4;
        const costDevelopLand = property.spendings_input.costPlan + costDevelopRoad + costRoadCover + costTapWater + costWaterTreatment + costElectricity + costFenceAndGuardHouse + costDevelopGreenArea;
        const costInProject = costDevelopLand + property.spendings_input.priceLandBought;
        const costDevelopDone = costInProject/area.sellArea
        const costOneFloorConstruction = property.product_input.user_1flr_area * property.spendings_input.costConstructionLivingSpace
        const costTwoFloorConstruction = property.product_input.user_2flr_area * property.spendings_input.costConstructionLivingSpace
        const costThreeFloorConstruction = property.product_input.user_3flr_area * property.spendings_input.costConstructionLivingSpace
        
        const costOneFloorConstructionTotal = costOneFloorConstruction * product.user_1flr_quantity;
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * product.user_2flr_quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * product.user_3flr_quantity;

        const salaryEmployee = property.spendings_input.sellPeriod * property.spendings_input.salaryEmployee;
        const costAdvtOnePer = product.user_total_cost * 0.01;
        const costAdvt = costAdvtOnePer * property.spendings_input.sellPeriod;

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
            user_1flr_quantity : product.user_1flr_quantity,
            user_2flr_quantity : product.user_2flr_quantity,
            user_3flr_quantity : product.user_3flr_quantity,
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

        const costLand = (property.product_input.user_1flr_size + property.product_input.user_2flr_size + property.product_input.user_3flr_size) * spendings.costDevelopDone;
        const costAdvtAndEmployee = spendings.costAdvtOnePer + spendings.salaryEmployee;

        const implicitCosts = {
            sellAreaSize : area.sellArea,
            costLand : costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : spendings.costInProject,
            costProject : product.user_total_cost
        }

        return implicitCosts;
    }

    profit(property){
        const product = this.product(property);
        const spendings = this.spendings(property);

        const oneFloorLandCost = property.product_input.user_1flr_size * spendings.costDevelopDone;
        const twoFloorLandCost = property.product_input.user_2flr_size * spendings.costDevelopDone;
        const threeFloorLandCost = property.product_input.user_3flr_size * spendings.costDevelopDone;
        const singleOneFloorCost = spendings.costOneFloorConstruction + oneFloorLandCost + property.spendings_input.costOther;
        const singleTwoFloorCost = spendings.costTwoFloorConstruction + twoFloorLandCost + property.spendings_input.costOther;
        const singleThreeFloorCost = spendings.costThreeFloorConstruction + threeFloorLandCost + property.spendings_input.costOther;
        const singleOneFloorProfit = property.product_input.user_1flr_cost - singleOneFloorCost;
        const singleTwoFloorProfit = property.product_input.user_2flr_cost - singleTwoFloorCost;
        const singleThreeFloorProfit = property.product_input.user_3flr_cost - singleThreeFloorCost;
        const totalOneFloorProfit = singleOneFloorProfit * product.user_1flr_quantity;
        const totalTwoFloorProfit = singleTwoFloorProfit * product.user_2flr_quantity;
        const totalThreeFloorProfit = singleThreeFloorProfit * product.user_3flr_quantity;
        const totalProfit = totalOneFloorProfit + totalTwoFloorProfit + totalThreeFloorProfit;
        const netProfit = totalProfit - spendings.costInProject;
        const averageProfitPerHouse = netProfit/ product.user_allFlr_quantity

        const profit = {
            singleOneFloorProfit : singleOneFloorProfit,
            singleTwoFloorProfit : singleTwoFloorProfit,
            singleThreeFloorProfit : singleThreeFloorProfit,
            user_1flr_quantity : product.user_1flr_quantity,
            user_2flr_quantity : product.user_2flr_quantity,
            user_3flr_quantity : product.user_3flr_quantity,
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