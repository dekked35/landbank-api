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
        const area = this.area(property);
        //Wait for further instruction. Rn the calc is amount of 2flr 3flr 4flr combined.
        const competitor_2flr_quantity = parseInt(((property.product_input.competitor_2flr_ratio/100) * area.sellArea)/property.product_input.competitor_2flr_size);
        const competitor_3flr_quantity = parseInt(((property.product_input.competitor_3flr_ratio/100) * area.sellArea)/property.product_input.competitor_3flr_size);
        const competitor_4flr_quantity = parseInt(((property.product_input.competitor_4flr_ratio/100) * area.sellArea)/property.product_input.competitor_4flr_size);
        const competitor_allFlr_quantity = competitor_2flr_quantity + competitor_3flr_quantity + competitor_4flr_quantity;
        const competitor_total_cost =   (competitor_2flr_quantity * property.product_input.competitor_2flr_cost) + 
                                        (competitor_3flr_quantity * property.product_input.competitor_3flr_cost) + 
                                        (competitor_4flr_quantity * property.product_input.competitor_4flr_cost);

        const user_2flr_quantity = parseInt(((property.product_input.user_2flr_ratio/100) * area.sellArea)/property.product_input.user_2flr_size);
        const user_3flr_quantity = parseInt(((property.product_input.user_3flr_ratio/100) * area.sellArea)/property.product_input.user_3flr_size);
        const user_4flr_quantity = parseInt(((property.product_input.user_4flr_ratio/100) * area.sellArea)/property.product_input.user_4flr_size);
        const user_allFlr_quantity = user_2flr_quantity + user_3flr_quantity + user_4flr_quantity;
        const user_total_cost = (user_2flr_quantity * property.product_input.user_2flr_cost) + 
                                (user_3flr_quantity * property.product_input.user_3flr_cost) + 
                                (user_4flr_quantity * property.product_input.user_4flr_cost);

        const product = {
            competitor_2flr_quantity : competitor_2flr_quantity,
            competitor_3flr_quantity : competitor_3flr_quantity,
            competitor_4flr_quantity : competitor_4flr_quantity,
            competitor_allFlr_quantity : competitor_allFlr_quantity,
            competitor_total_cost : competitor_total_cost,
            user_2flr_quantity : user_2flr_quantity,
            user_3flr_quantity : user_3flr_quantity,
            user_4flr_quantity : user_4flr_quantity,
            user_allFlr_quantity : user_allFlr_quantity,
            user_total_cost : user_total_cost
        };

        return product;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user.products;

        const twoFloorQty = parseInt(((productInput[0].ratio/100) * area.sellArea)/productInput[0].size);

        // const oneFloorQty = parseInt(((productInput[0].ratio/100) * area.sellArea)/productInput[0].size);
        // const twoFloorQty = parseInt(((productInput[1].ratio/100) * area.sellArea)/productInput[1].size);
        // const threeFloorQty = parseInt(((productInput[2].ratio/100) * area.sellArea)/productInput[2].size);
        // const totalFloorQty = oneFloorQty + twoFloorQty + threeFloorQty;
        // const totalCost =   (oneFloorQty * productInput[0].cost) + 
        //                     (twoFloorQty * productInput[1].cost) + 
        //                     (threeFloorQty * productInput[2].cost);

        const userProduct = {
            user : {
                products: [
                    {
                        type : "two floor house",
                        size : productInput[0].size,
                        area : productInput[0].area,
                        cost : productInput[0].cost,
                        ratio : productInput[0].ratio,
                        quantity : twoFloorQty
                    },
                    {
                        type : "three floor house",
                        size : productInput[1].size,
                        area : productInput[1].area,
                        cost : productInput[1].cost,
                        ratio : productInput[1].ratio,
                        quantity : threeFloorQty
                    },
                    {
                        type : "four floor house",
                        size : productInput[2].size,
                        area : productInput[2].area,
                        cost : productInput[2].cost,
                        ratio : productInput[2].ratio,
                        quantity : fourFloorQty
                    }
                ],
                totalQuantity : totalFloorQty,
                totalCost : totalCost
            } ,
            totalWidth : [
                {
                    type : "4 metres wide",
                    informations : [
                        { type : "two floor house", quantity : 0},
                        { type : "three floor house", quantity : 0},
                        { type : "four floor house", quantity : 0},
                    ]
                },
                {
                    type : "5 metres wide",
                    informations : [
                        { type : "two floor house", quantity : 0},
                        { type : "three floor house", quantity : 0},
                        { type : "four floor house", quantity : 0},
                    ]
                },
                {
                    type : "6 metres wide",
                    informations : [
                        { type : "two floor house", quantity : 0},
                        { type : "three floor house", quantity : 0},
                        { type : "four floor house", quantity : 0},
                    ]
                }
            ]
        }

        return userProduct;
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
        //Wait for further instruction. Rn the calc is one width per one type of townhouse.∫
        const costTwoFloorConstruction = (property.product_input.user_2flr_width[0] * property.product_input.user_2flr_length * 2)
                                        * property.spendings_input.costConstructionLivingSpace
        const costThreeFloorConstruction = (property.product_input.user_3flr_width[1] * property.product_input.user_3flr_length * 3) 
                                        * property.spendings_input.costConstructionLivingSpace
        const costFourFloorConstruction = (property.product_input.user_4flr_width[2] * property.product_input.user_4flr_length * 4) 
                                        * property.spendings_input.costConstructionLivingSpace
        
        const costTwoFloorConstructionTotal = costTwoFloorConstruction * product.user_2flr_quantity;
        const costThreeFloorConstructionTotal = costThreeFloorConstruction * product.user_3flr_quantity;
        const costFourFloorConstructionTotal = costFourFloorConstruction * product.user_4flr_quantity;

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
            costTwoFloorConstruction : costTwoFloorConstruction,
            costThreeFloorConstruction : costThreeFloorConstruction,
            costFourFloorConstruction : costFourFloorConstruction,
            user_2flr_quantity : product.user_2flr_quantity,
            user_3flr_quantity : product.user_3flr_quantity,
            user_4flr_quantity : product.user_4flr_quantity,
            costTwoFloorConstructionTotal : costTwoFloorConstructionTotal,
            costThreeFloorConstructionTotal : costThreeFloorConstructionTotal,
            costFourFloorConstructionTotal : costFourFloorConstructionTotal,
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

        const costLand = (property.product_input.user_2flr_size + property.product_input.user_3flr_size + property.product_input.user_4flr_size) * spendings.costDevelopDone;
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

        const twoFloorLandCost = property.product_input.user_2flr_size * spendings.costDevelopDone;
        const threeFloorLandCost = property.product_input.user_3flr_size * spendings.costDevelopDone;
        const fourFloorLandCost = property.product_input.user_4flr_size * spendings.costDevelopDone;
        const singleTwoFloorCost = spendings.costTwoFloorConstruction + twoFloorLandCost + property.spendings_input.costOther;
        const singleThreeFloorCost = spendings.costThreeFloorConstruction + threeFloorLandCost + property.spendings_input.costOther;
        const singleFourFloorCost = spendings.costFourFloorConstruction + fourFloorLandCost + property.spendings_input.costOther;
        const singleTwoFloorProfit = property.product_input.user_2flr_cost - singleTwoFloorCost;
        const singleThreeFloorProfit = property.product_input.user_3flr_cost - singleThreeFloorCost;
        const singleFourFloorProfit = property.product_input.user_4flr_cost - singleFourFloorCost;
        const totalTwoFloorProfit = singleTwoFloorProfit * product.user_2flr_quantity;
        const totalThreeFloorProfit = singleThreeFloorProfit * product.user_3flr_quantity;
        const totalFourFloorProfit = singleFourFloorProfit * product.user_4flr_quantity;
        const totalProfit = totalTwoFloorProfit + totalThreeFloorProfit + totalFourFloorProfit;
        const netProfit = totalProfit - spendings.costInProject;
        const averageProfitPerHouse = netProfit/ product.user_allFlr_quantity

        const profit = {
            singleTwoFloorProfit : singleTwoFloorProfit,
            singleThreeFloorProfit : singleThreeFloorProfit,
            singleFourFloorProfit : singleFourFloorProfit,
            user_2flr_quantity : product.user_2flr_quantity,
            user_3flr_quantity : product.user_3flr_quantity,
            user_4flr_quantity : product.user_4flr_quantity,
            totalTwoFloorProfit : totalTwoFloorProfit,
            totalThreeFloorProfit : totalThreeFloorProfit,
            totalFourFloorProfit : totalFourFloorProfit,
            totalProfit : totalProfit,
            netProfit : netProfit,
            averageProfitPerHouse : averageProfitPerHouse
        };

        return profit;
    }
}

module.exports = Townhouse;