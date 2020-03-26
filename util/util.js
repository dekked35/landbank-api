class Util{
    duration(firstDate, lastDate){
        const start = new Date(firstDate);
        const end = new Date(lastDate);
        const duration = parseInt(((end.getTime() - start.getTime()) / (1000 * 3600 * 24))/30);
        return duration;
    }
}

module.exports = Util;