class Util{
    duration(firstDate, lastDate){
        const start = new Date(firstDate);
        const end = new Date(lastDate);
        const duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return duration;
    }

    NPV(rate, initialCost, cashFlows) {
        return cashFlows.reduce(
          (accumulator, currentValue, index) =>
            accumulator + currentValue / Math.pow(rate / 100 + 1, index + 1),
          initialCost
        );
    }
}

module.exports = Util;