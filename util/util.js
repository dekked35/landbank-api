class Util{
    duration(firstDate, lastDate){
        const start = new Date(firstDate);
        const end = new Date(lastDate);
        const duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        return duration;
    }
}

module.exports = Util;