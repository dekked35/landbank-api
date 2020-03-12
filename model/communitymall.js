class CommunityMall{
    constructor(){}

    area(property){
        const input = property.area_input;
        const availableArea = input.totalArea * 0.65;
        // const availableArea = input.totalArea * 0.65;
        // const usedArea = 0;
        // const totalAreaRooms = 0;
        // const totalAreaCentrals = 0;
        // const totalCorridor = 0;
        // const totalParkingArea = 0;
        // const totalOutdoorArea = 0;
        const area = {
            townPlanColor : input.farValue,
            farValue : input.farValue,
            osrValue : input.osrValue,
            totalArea : input.totalArea,
            availableArea : availableArea,
            // usedArea : usedArea,
            // totalAreaRooms : totalAreaRooms,
            // totalAreaCentrals : totalAreaCentrals,
            // totalCorridor : totalCorridor,
            // totalParkingArea : totalParkingArea,
            // totalOutdoorArea : totalOutdoorArea
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

        // const totalTypeARoomArea = productInput.rooms[0].area * productInput.rooms[0].noRoom;
        // const totalTypeBRoomArea = productInput.rooms[1].area * productInput.rooms[1].noRoom;
        // const totalAllRoomArea = totalTypeARoomArea + totalTypeBRoomArea;
        const totalAllRoomArea = productInput.rooms.map(room => room.area * room.noRoom).reduce(reducer);
        const roomHallway = totalAllRoomArea * 0.15;

        // const poolArea = productInput.centrals[0].area * productInput.centrals[0].noRoom;
        // const lobbyArea = productInput.centrals[1].area * productInput.centrals[1].noRoom;
        // const totalCentralArea = poolArea + lobbyArea;
        const totalCentralArea = productInput.centrals.map(facility => facility.area * facility.noRoom).reduce(reducer);
        const centralHallway = totalCentralArea * 0.20;

        const totalParkingLotArea = productInput.parking.map(lot => lot.area * lot.noRoom).reduce(reducer);
        const roadArea = totalParkingLotArea * 0.4;

        const outdoorArea = productInput.outdoors.map(outdoor => outdoor.area * outdoor.noRoom).reduce(reducer);
        
        const totalOutdoorArea = outdoorArea + roadArea;
        
        const usedArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalParkingLotArea + roadArea + totalOutdoorArea;
        const totalCorridor = roomHallway + centralHallway;
        const totalIndoorArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway;
        const totalRoomQuantity = productInput.rooms.map(room => room.noRoom).reduce(reducer);
        const remainingArea = (area.availableArea * 4) - usedArea;

        const competitorProduct = {
            competitor : {
                rooms : productInput.rooms,
                totalRoomArea : totalAllRoomArea,
                roomCorridor : roomHallway,
                centrals : productInput.centrals,
                totalCentralArea : totalCentralArea,
                centralCorridor : centralHallway,
                parking : productInput.parking,
                totalParkingArea : totalParkingLotArea,
                roadArea : roadArea,
                outdoors : productInput.outdoors,
                totalOutdoorArea : totalOutdoorArea,
                availableArea : area.availableArea,
                usedArea : usedArea,
                totalRoomArea : totalAllRoomArea,
                totalCentralArea : totalCentralArea,
                totalCorridor : totalCorridor,
                indoorArea : totalIndoorArea,
                totalOutdoor : totalOutdoorArea,
                totalRoomQuantity : totalRoomQuantity,
                remainingArea : remainingArea
            }
        };

        return competitorProduct;
    }

    userProduct(property){
        const area = this.area(property);
        const productInput = property.product_input.user;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        // const totalTypeARoomArea = productInput.rooms[0].area * productInput.rooms[0].noRoom;
        // const totalTypeBRoomArea = productInput.rooms[1].area * productInput.rooms[1].noRoom;
        // const totalAllRoomArea = totalTypeARoomArea + totalTypeBRoomArea;
        const totalAllRoomArea = productInput.rooms.map(room => room.area * room.noRoom).reduce(reducer);
        const roomHallway = totalAllRoomArea * 0.15;

        // const poolArea = productInput.centrals[0].area * productInput.centrals[0].noRoom;
        // const lobbyArea = productInput.centrals[1].area * productInput.centrals[1].noRoom;
        // const totalCentralArea = poolArea + lobbyArea;
        const totalCentralArea = productInput.centrals.map(facility => facility.area * facility.noRoom).reduce(reducer);
        const centralHallway = totalCentralArea * 0.20;

        const totalParkingLotArea = productInput.parking.map(lot => lot.area * lot.noRoom).reduce(reducer);
        const roadArea = totalParkingLotArea * 0.4;

        const outdoorArea = productInput.outdoors.map(outdoor => outdoor.area * outdoor.noRoom).reduce(reducer);
        
        const totalOutdoorArea = outdoorArea + roadArea;
        
        const usedArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway + totalParkingLotArea + roadArea + totalOutdoorArea;
        const totalCorridor = roomHallway + centralHallway;
        const totalIndoorArea = totalAllRoomArea + totalCentralArea + roomHallway + centralHallway;
        const totalRoomQuantity = productInput.rooms.map( room => room.noRoom).reduce(reducer);
        const remainingArea = (area.availableArea * 4) - usedArea

        const userProduct = {
            user : {
                rooms : productInput.rooms,
                totalRoomArea : totalAllRoomArea,
                roomCorridor : roomHallway,

                centrals : productInput.centrals,
                totalCentralArea : totalCentralArea,
                centralCorridor : centralHallway,

                parking : productInput.parking,
                totalParkingArea : totalParkingLotArea,
                roadArea : roadArea,

                outdoors : productInput.outdoors,
                totalOutdoorArea : outdoorArea,

                availableArea : area.availableArea,
                usedArea : usedArea,
                totalRoomArea : totalAllRoomArea,
                totalCentralArea : totalCentralArea,
                totalCorridor : totalCorridor,
                indoorArea : totalIndoorArea,
                totalOutdoor : totalOutdoorArea,
                totalRoomQuantity : totalRoomQuantity,
                remainingArea : remainingArea
            }
        };

        return userProduct;
    }

    spendings(property){
        const product = this.userProduct(property);
        const input = property.spendings_input;

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const newRooms = input.rooms.map(room => JSON.parse(JSON.stringify({
            type  : room.type,
            name : room.name,
            area : room.area,
            noRoom : room.noRoom,
            cost : room.cost,
            totalCost : room.area * room.noRoom * room.cost
        })));
        const totalRoomCost = newRooms.map(room => room.totalCost).reduce(reducer);

        const newCentrals = input.centrals.map(facility => JSON.parse(JSON.stringify({
            type  : facility.type,
            name : facility.name,
            area : facility.area,
            noRoom : facility.noRoom,
            cost : facility.cost,
            totalCost : facility.area * facility.noRoom * facility.cost
        })));
        const totalCentralCost = newCentrals.map(facility => facility.totalCost).reduce(reducer);

        const newPark = input.parking.map(lot => JSON.parse(JSON.stringify({
            type  : lot.type,
            name : lot.name,
            area : lot.area,
            noRoom : lot.noRoom,
            cost : lot.cost,
            totalCost : lot.area * lot.noRoom * lot.cost
        })));
        const totalParkingCost = newPark.map(lot => lot.totalCost).reduce(reducer);

        const newOutdoors = input.outdoors.map(garden => JSON.parse(JSON.stringify({
            type  : garden.type,
            name : garden.name,
            area : garden.area,
            noRoom : garden.noRoom,
            cost : garden.cost,
            totalCost : garden.area * garden.noRoom * garden.cost
        })));
        const totalOutDoorCost = newOutdoors.map(garden => garden.totalCost).reduce(reducer);

        const totalConstructionCost = totalRoomCost + totalCentralCost + totalParkingCost + totalOutDoorCost;

        const monthlyPaidItems = input.costPerMonths.map(item => JSON.parse(JSON.stringify({
            type : item.type,
            cost : item.cost,
            no : item.no,
            total : item.cost * item.no
        })));
        const monthlyItemsCost = monthlyPaidItems.map(item => item.total).reduce(reducer);

        const totalElevatorCost = input.costLift * input.noLift;
        const totalEquipmentsCost = totalElevatorCost + input.costITRoom + input.costCar + input.costRoomEquipment + 
                                    input.costDesign + input.costOtherEquipment + input.costKitchenEquipment + input.costRestaurant +
                                    input.costContingency;
        const preOpeningCost = monthlyItemsCost * input.noMonthPreOpening;
        const costSpecielEquipmentAndPreOpening = preOpeningCost + totalEquipmentsCost;
        //since preOpeningCost comes from monthlyItemsCost * duration
        const totalCostPerMonthAndPreOpening = preOpeningCost;
        //missing costLand
        const absoluteCost = costSpecielEquipmentAndPreOpening + monthlyItemsCost + totalConstructionCost;


        const spendings = {
            rooms : newRooms,
            totalRoomArea : product.user.totalRoomArea,
            roomCorridor : product.user.roomCorridor,
            totalRoomCost : totalRoomCost,

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

            totalCostPerMonth : monthlyItemsCost,
            costPreOpening : preOpeningCost,

            totalEquipmentsCost : totalEquipmentsCost,
            totalCostPerMonthAndPreOpening : totalCostPerMonthAndPreOpening,
            costLand : 0, //"Either from users's input or from calculation"
            costSpecielEquipmentAndPreOpening : costSpecielEquipmentAndPreOpening,
            costConstruction : totalConstructionCost,
            absoluteCost : absoluteCost
        }

        return spendings;
    }

    implicitCosts(property){
        const product = this.userProduct(property);
        const spendings = this.spendings(property);

        const reducer = (accumulator, currentValue) => accumulator + currentValue;

        const input = property.implicit_costs_input;

        const sellAreaSize = product.user.totalRoomArea;
        const costLand = 0; //mock for now
        const costAdvtAndEmployee = spendings.costPreOpening;
        const costAll = spendings.absoluteCost;
        const newIncome = input.incomes.map(room => JSON.parse(JSON.stringify({
            roomType  : room.roomType,
            roomName : room.roomName,
            area : room.area,
            noRoom : room.noRoom,
            pricePerRoom : room.pricePerRoom, 
            incomePerDay :  room.pricePerRoom * room.noRoom
        })));
        const incomePerDay = newIncome.map(room => room.incomePerDay).reduce(reducer);
        const incomePerMonth = newIncome.map(room => room.incomePerDay * 30).reduce(reducer);
        const netIncome = incomePerMonth - spendings.totalCostPerMonth;

        const implicitCosts = {
            sellAreaSize : sellAreaSize,
            costLand : costLand,
            costAdvtAndEmployee : costAdvtAndEmployee,
            costAll : costAll,
            occupancy : input.occupancy,
            incomes : newIncome,
            totalIncomePerDay : incomePerDay,
            totalIncomePerMonth : incomePerMonth,
            estimatedIncomePerMonth : netIncome,
            totalIncomePerYear : incomePerMonth * 12,
        }

        return implicitCosts;
    }

    profit(property){

    }
}

module.exports = CommunityMall;