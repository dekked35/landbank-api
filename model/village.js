class Village {
    constructor() {}

    area(property){
        const fenceLength = 3.14 * ((Math.sqrt(property.totalArea * 4)/(22/7))) * 2;
        const sellArea = property.totalArea * 0.65;
        const roadSize = property.totalArea * 0.3;
        const greenArea = property.totalArea *0.3;
        const area = JSON.stringify({
            "fenceLength" : fenceLength,
            "sellArea" : sellArea,
            "roadSize" : roadSize,
            "greenArea" : greenArea 
        });

        return area
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

module.exports = Village;