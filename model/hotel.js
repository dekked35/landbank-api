const Finance = require('financejs');
const Util = require('../util/util');
const finance = new Finance();
const util = new Util;

class Hotel{
    constructor(){}

    area(property){
        const input = property.area_input;
        const availableArea = input.availableArea;

        const newRatio = JSON.parse(JSON.stringify({
            room: ((input.percent.room/100) * availableArea) - input.coverArea,
            central: (input.percent.central/100) * availableArea,
            corridor: (input.percent.corridor/100) * availableArea,
            parking: (input.percent.parking/100) * availableArea,
            outdoor: (input.percent.outdoor/100) * availableArea,
            resort: ((input.percent.resort/100) * availableArea) - input.coverArea
        }));
        const costLand = (input.costLandType === 'rent') ? input.deposit + (input.rentNoYear * 12 * input.rentPerMonth) :  input.costLand;
        const area = {
            townPlanColor : input.farValue,
            farValue : input.farValue,
            osrValue : input.osrValue,
            totalArea : input.totalArea,
            availableArea : availableArea,
            percent : input.percent,
            ratio_area : newRatio,
            costLand : costLand,
            deposit : input.deposit,
            rentNoYear : input.rentNoYear,
            rentPerMonth : input.rentPerMonth,
            costLandType : input.costLandType
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
        const productInput = property.product_input.competitor;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const totalAllRoomArea = (productInput.rooms && productInput.rooms.length > 0) ? productInput.rooms.map(room => room.area * room.noRoom).reduce(reducer) : 0;
        const availableRoomArea = area.ratio_area.room - totalAllRoomArea;
        const roomHallway = totalAllRoomArea * 0.15;

        const totalCentralArea = (productInput.centrals && productInput.centrals.length > 0) ? productInput.centrals.map(facility => facility.area * facility.noRoom).reduce(reducer) : 0;
        const availableCentralArea = area.ratio_area.central - totalCentralArea ;
        const centralHallway = totalCentralArea * 0.20;

        const totalParkingLotArea = (productInput.parking && productInput.parking.length > 0) ? productInput.parking.map(lot => lot.area * lot.noRoom).reduce(reducer) : 0;
        const availableParkingLotArea = area.percent.parking - totalParkingLotArea;
        const roadArea = totalParkingLotArea * 0.4;

        const outdoorArea = (productInput.outdoors && productInput.outdoors.length > 0) ? productInput.outdoors.map(outdoor => outdoor.area * outdoor.noRoom).reduce(reducer) : 0;
        const availableOutdoorArea = area.percent.outdoor - outdoorArea;
        const totalOutdoorArea = outdoorArea + roadArea;

        const totalResortArea = (productInput.resort && productInput.resort.length > 0) ? productInput.resort.map(resort => resort.area * resort.noRoom).reduce(reducer) : 0;
        const availableResortArea = area.ratio_area.resort - totalResortArea;
        const resortHallway = totalResortArea * 0.15;
        
        const usedArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalParkingLotArea + roadArea + totalOutdoorArea + totalResortArea + resortHallway;
        const totalCorridor = roomHallway + centralHallway + resortHallway;
        const totalIndoorArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalResortArea + resortHallway;
        const totalRoomQuantity = productInput.rooms.length > 0 ? productInput.rooms.map( room => room.noRoom).reduce(reducer) : 0;
        const remainingArea = area.availableArea - usedArea;

        const totalParkingLotQuantity = util.parkingLot(totalRoomQuantity);

        const competitorProduct = {
            competitor : {
                rooms : productInput.rooms,
                totalRoomArea : totalAllRoomArea,
                availableRoomArea : availableRoomArea,
                roomCorridor : roomHallway,

                centrals : productInput.centrals,
                totalCentralArea : totalCentralArea,
                availableCentralArea : availableCentralArea,
                centralCorridor : centralHallway,

                parking : productInput.parking,
                totalParkingArea : totalParkingLotArea,
                availableParkingLotArea : availableParkingLotArea,
                roadArea : roadArea,

                outdoors : productInput.outdoors,
                totalOutdoorArea : outdoorArea,
                availableOutdoorArea : availableOutdoorArea,

                resort : productInput.resort,
                totalResortArea : totalResortArea,
                availableResortArea : availableResortArea,
                resortCorridor: resortHallway,

                totalOutdoorArea : totalOutdoorArea,
                availableArea : area.availableArea,
                usedArea : usedArea,
                totalRoomArea : totalAllRoomArea,
                totalCentralArea : totalCentralArea,
                totalCorridor : totalCorridor,
                indoorArea : totalIndoorArea,
                totalOutdoor : totalOutdoorArea,
                totalRoomQuantity : totalRoomQuantity,
                totalParkingLotQuantity: totalParkingLotQuantity,
                remainingArea : remainingArea
            }
        };

        return competitorProduct;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const totalAllRoomArea = (productInput.rooms && productInput.rooms.length > 0) ? productInput.rooms.map(room => room.area * room.noRoom).reduce(reducer) : 0;
        const availableRoomArea = area.ratio_area.room - totalAllRoomArea;
        const roomHallway = totalAllRoomArea * 0.15;

        const totalCentralArea = (productInput.centrals && productInput.centrals.length > 0) ? productInput.centrals.map(facility => facility.area * facility.noRoom).reduce(reducer) : 0;
        const availableCentralArea = area.ratio_area.central - totalCentralArea ;
        const centralHallway = totalCentralArea * 0.20;

        const totalParkingLotArea = (productInput.parking && productInput.parking.length > 0) ? productInput.parking.map(lot => lot.area * lot.noRoom).reduce(reducer) : 0;
        const availableParkingLotArea = area.percent.parking - totalParkingLotArea;
        const roadArea = totalParkingLotArea * 0.4;

        const outdoorArea = (productInput.outdoors && productInput.outdoors.length > 0) ? productInput.outdoors.map(outdoor => outdoor.area * outdoor.noRoom).reduce(reducer) : 0;
        const availableOutdoorArea = area.percent.outdoor - outdoorArea;

        const totalResortArea = (productInput.resort && productInput.resort.length > 0) ? productInput.resort.map(resort => resort.area * resort.noRoom).reduce(reducer) : 0;
        const availableResortArea = area.ratio_area.resort - totalResortArea;
        const resortHallway = totalResortArea * 0.15;
        
        const totalOutdoorArea = outdoorArea + roadArea;
        
        const usedArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalParkingLotArea + roadArea + totalOutdoorArea + totalResortArea + resortHallway;
        const totalCorridor = roomHallway + centralHallway + resortHallway;
        const totalIndoorArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalResortArea + resortHallway;
        const totalRoomQuantity = (productInput.rooms && productInput.rooms.length > 0) ? productInput.rooms.map( room => room.noRoom).reduce(reducer) : 0;
        const remainingArea = area.availableArea - usedArea;

        const totalParkingLotQuantity = util.parkingLot(totalRoomQuantity);

        const userProduct = {
            user : {
                rooms : productInput.rooms,
                totalRoomArea : totalAllRoomArea,
                availableRoomArea : availableRoomArea,
                roomCorridor : roomHallway,

                centrals : productInput.centrals,
                totalCentralArea : totalCentralArea,
                availableCentralArea : availableCentralArea,
                centralCorridor : centralHallway,

                parking : productInput.parking,
                totalParkingArea : totalParkingLotArea,
                availableParkingLotArea : availableParkingLotArea,
                roadArea : roadArea,

                outdoors : productInput.outdoors,
                totalOutdoorArea : outdoorArea,
                availableOutdoorArea : availableOutdoorArea,

                resort : productInput.resort,
                totalResortArea : totalResortArea,
                availableResortArea : availableResortArea,
                resortCorridor: resortHallway,

                availableArea : area.availableArea,
                usedArea : usedArea,
                totalRoomArea : totalAllRoomArea,
                totalCentralArea : totalCentralArea,
                totalCorridor : totalCorridor,
                indoorArea : totalIndoorArea,
                totalOutdoor : totalOutdoorArea,
                totalRoomQuantity : totalRoomQuantity,
                totalParkingLotQuantity: totalParkingLotQuantity,
                remainingArea : remainingArea
            }
        };

        return userProduct;
    }

    spendings(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        const input = property.spendings_input;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const newRooms = (input.rooms.length > 0) ? input.rooms.map(room => JSON.parse(JSON.stringify({
            type  : room.type,
            name : room.name,
            area : room.area,
            noRoom : room.noRoom,
            cost : room.cost,
            totalCost : room.area * room.noRoom * room.cost
        }))) : [];
        const totalRoomCost = (newRooms.length > 0) ? newRooms.map(room => room.totalCost).reduce(reducer) : 0;

        const newResort = (input.resort.length > 0) ? input.resort.map(room => JSON.parse(JSON.stringify({
            type  : room.type,
            name : room.name,
            area : room.area,
            noRoom : room.noRoom,
            cost : room.cost,
            totalCost : room.area * room.noRoom * room.cost
        }))) : [];
        const totalResortCost = (newResort.length > 0) ? newResort.map(room => room.totalCost).reduce(reducer) : 0;

        const newCentrals = (input.centrals.length > 0) ? input.centrals.map(facility => JSON.parse(JSON.stringify({
            type  : facility.type,
            name : facility.name,
            area : facility.area,
            noRoom : facility.noRoom,
            cost : facility.cost,
            totalCost : facility.area * facility.noRoom * facility.cost
        }))) : [];
        const totalCentralCost = (newCentrals.length > 0) ? newCentrals.map(facility => facility.totalCost).reduce(reducer) : 0;

        const newPark = (input.parking.length > 0) ? input.parking.map(lot => JSON.parse(JSON.stringify({
            type  : lot.type,
            name : lot.name,
            area : lot.area,
            noRoom : lot.noRoom,
            cost : lot.cost,
            totalCost : lot.area * lot.noRoom * lot.cost
        }))) : [];
        const totalParkingCost = (newPark.length > 0) ? newPark.map(lot => lot.totalCost).reduce(reducer) : 0;

        const newOutdoors = (input.outdoors.length > 0) ? input.outdoors.map(garden => JSON.parse(JSON.stringify({
            type  : garden.type,
            name : garden.name,
            area : garden.area,
            noRoom : garden.noRoom,
            cost : garden.cost,
            totalCost : garden.area * garden.noRoom * garden.cost
        }))) : [];
        const totalOutDoorCost = (newOutdoors.length > 0) ? newOutdoors.map(garden => garden.totalCost).reduce(reducer) : 0;

        const totalConstructionCost = totalRoomCost + totalResortCost + totalCentralCost + totalParkingCost + totalOutDoorCost;

        const monthlyPaidItems = (input.costPerMonth && input.costPerMonth.length > 0) ? input.costPerMonth.map(item => JSON.parse(JSON.stringify({
            type : item.type,
            cost : item.cost,
            no : item.no,
            total : item.cost * item.no
        }))) : [];
        const monthlyItemsCost = (monthlyPaidItems.length > 0) ? monthlyPaidItems.map(item => item.total).reduce(reducer) : 0;

        const equipments = (input.specialEquipments.length > 0) ? input.specialEquipments.map(item => JSON.parse(JSON.stringify({
            type : item.type,
            cost : item.cost,
            no : item.no,
            total : item.cost * item.no
        }))) : [];
        const equipmentsCost = (equipments.length > 0) ? equipments.map(item => item.total).reduce(reducer) : 0;
        
        const duration = equipments.find(eq => eq.type === "ค่า Pre-Opening" || eq.type === "Pre-Opening");
        const preOpeningCost = monthlyItemsCost * duration.no;
        const costSpecielEquipmentAndPreOpening = preOpeningCost + equipmentsCost;
        const absoluteCost = costSpecielEquipmentAndPreOpening + monthlyItemsCost + totalConstructionCost + area.costLand;


        const spendings = {
            rooms : newRooms,
            totalRoomArea : product.user.totalRoomArea,
            roomCorridor : product.user.roomCorridor,
            totalRoomCost : totalRoomCost,

            resort : newResort,
            totalResortArea : product.user.totalResortArea,
            resortCorridor : product.user.resortCorridor,
            totalResortCost : totalResortCost,

            centrals : newCentrals,
            totalCentralArea : product.user.totalCentralArea,
            centralCorridor : product.user.centralCorridor,
            totalCentralCost : totalCentralCost,

            parking : newPark,
            totalParkingArea : product.user.totalParkingArea,
            roadArea : product.user.roadArea,
            totalParkingCost : totalParkingCost,

            outdoors : newOutdoors,
            totalOutdoorArea : product.user.totalOutdoorArea,
            totalOutDoorCost : totalOutDoorCost,

            costPerMonth : monthlyPaidItems,
            totalCostPerMonth : monthlyItemsCost,

            specialEquipments : equipments,
            totalEquipmentsCost : equipmentsCost,

            totalCostPerMonthAndPreOpening : preOpeningCost, //since preOpeningCost comes from monthlyItemsCost * duration
            costLand : area.costLand,
            costSpecielEquipmentAndPreOpening : costSpecielEquipmentAndPreOpening,
            costConstruction : totalConstructionCost,
            absoluteCost : absoluteCost
        }

        return spendings;
    }

    implicitCosts(property){
        const area = this.area(property);
        const product = this.userProduct(property);
        // const spendings = this.spendings(property);
        const spendings = property.spendings_input

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const input = property.implicit_costs_input;

        const sellAreaSize = product.user.totalRoomArea;
        const costAdvtAndEmployee = spendings.totalCostPerMonthAndPreOpening;
        const costAll = spendings.absoluteCost;
        const newIncome = (input.incomes.length > 0) ? input.incomes.map(room => JSON.parse(JSON.stringify({
            roomType  : room.roomType,
            roomName : room.roomName,
            area : room.area,
            noRoom : room.noRoom,
            pricePerRoom : room.pricePerRoom, 
            incomePerDay :  room.pricePerRoom * room.noRoom
        }))) : [];
        const incomePerDay = (newIncome.length > 0) ? newIncome.map(room => room.incomePerDay).reduce(reducer) : 0;
        const incomePerMonth = (newIncome.length > 0) ? newIncome.map(room => room.incomePerDay * 30).reduce(reducer) : 0;
        const netIncome = (incomePerMonth - spendings.totalCostPerMonth) * (input.occupancy/100);
        const incomePerYear = (netIncome > 0) ? netIncome * 12 : 0;

        const implicitCosts = {
            sellAreaSize : sellAreaSize,
            costLand : area.costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : costAll,
            occupancy : input.occupancy,
            incomes : newIncome,
            totalIncomePerDay : incomePerDay,
            totalIncomePerMonth : incomePerMonth,
            estimatedIncomePerMonth : netIncome,
            totalIncomePerYear : incomePerYear
        }

        return implicitCosts;
    }

    ipr(property){
        const input = property.ipr_input;
        const area = this.area(property);
        const spendings = this.spendings(property);
        const implicitCosts = this.implicitCosts(property);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const totalRoomQty = spendings.rooms.map(room => room.noRoom).reduce(reducer);

        const investmentBudget = area.costLand + spendings.costSpecielEquipmentAndPreOpening + spendings.costConstruction;
        const netProfitPerMonth = totalRoomQty/4/12 * implicitCosts.estimatedIncomePerMonth;
        const expensePerMonth = totalRoomQty/4/12 * investmentBudget;

        const breakEvenPointMonthlyWithCash = investmentBudget/netProfitPerMonth;
        const breakEvenPointYearWithCash = breakEvenPointMonthlyWithCash/12;
        const breakEvenPointMonthlyWithBank = investmentBudget/netProfitPerMonth;
        const breakEvenPointYearWithBank = breakEvenPointMonthlyWithBank/12;
        
        const overBorrowFund = area.costLand * totalRoomQty;
        const loanInterest = (input.bankInterest/12) * overBorrowFund;

        const firstMonthCashflow = overBorrowFund + loanInterest;
        const monthlyCashflow = netProfitPerMonth + expensePerMonth + loanInterest;

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

module.exports = Hotel;