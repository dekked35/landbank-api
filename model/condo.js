class Condo{
    constructor(){}

    area(property){
        const availableArea = property.area_input.totalArea * 0.65;
        const area = {
            farValue : property.area_input.farValue,
            osrValue : property.area_input.osrValue,
            totalArea : property.area_input.totalArea,
            availableArea : availableArea,
            hallway : property.area_input.hallway,
            clubhouse_hallway : property.area_input.clubhouse_hallway
        };

        return area;
    }

    product(property){

    }

    spendings(property){

    }

    implicitCosts(property){

    }

    profit(property){

    }
}

module.exports = Condo;