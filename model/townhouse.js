class Townhouse{
    constructor(){}

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

    }

    spendings(property){

    }

    implicitCosts(property){

    }

    profit(property){

    }
}

module.exports = Townhouse;